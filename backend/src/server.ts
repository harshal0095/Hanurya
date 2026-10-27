import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import collectionRoutes from './routes/collectionRoutes';
import adminRoutes from './routes/adminRoutes';
import orderRoutes from './routes/orderRoutes';
import accountRoutes from './routes/accountRoutes';
import { getJwtSecret } from './utils/jwtSecret';
import { usesCloudinaryStorage } from './utils/cloudinary';
import { prisma } from './utils/prisma';

const app = express();

const clientUrls = (process.env.CLIENT_URLS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production') {
  getJwtSecret();
  if (!process.env.DATABASE_URL?.trim()) throw new Error('DATABASE_URL must be configured in production.');
  if (!process.env.CLIENT_URLS?.trim()) throw new Error('Set CLIENT_URLS to your frontend origin in production.');
  if (!usesCloudinaryStorage) throw new Error('Configure Cloudinary credentials for persistent production product images.');
}

const allowedOrigins = clientUrls.map((clientUrl) => {
  let origin: URL;
  try {
    origin = new URL(clientUrl);
  } catch {
    throw new Error(`Invalid client origin configured in CLIENT_URLS: ${clientUrl}`);
  }

  if (
    !['http:', 'https:'].includes(origin.protocol)
    || origin.username
    || origin.password
    || origin.pathname !== '/'
    || origin.search
    || origin.hash
    || (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:')
  ) {
    throw new Error('CLIENT_URLS must contain only valid origins; production origins must use HTTPS.');
  }

  return origin.origin;
});

const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (!Number.isInteger(trustProxyHops) || trustProxyHops < 0) {
  throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.');
}
if (trustProxyHops > 0) app.set('trust proxy', trustProxyHops);

// Middlewares
app.use(express.json({ limit: '32kb' }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(Object.assign(new Error('Origin is not allowed by CORS.'), { status: 403 }));
  },
  credentials: true,
}));
app.use(helmet());

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'success', message: 'API and database are ready' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'error', message: 'Service is not ready' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/account', accountRoutes);

// Global Error Handler
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  void next;
  const status = typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
    ? err.status
    : 500;
  console.error(err instanceof Error ? err.stack : err);
  res.status(status).json({
    status: 'error',
    message: status < 500 && err instanceof Error ? err.message : 'Internal Server Error',
  });
});

const PORT = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be a valid TCP port number.');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

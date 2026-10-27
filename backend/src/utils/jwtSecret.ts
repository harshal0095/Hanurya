const localDevelopmentSecret = 'local-development-only-secret';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  const isPlaceholder = !secret || /^(your_|placeholder|example|change.?me|replace|insert|set[_ -]?me|<)/i.test(secret);

  if (process.env.NODE_ENV === 'production') {
    if (!secret || isPlaceholder || Buffer.byteLength(secret, 'utf8') < 32) {
      throw new Error('Set a non-placeholder JWT_SECRET of at least 32 bytes before starting in production.');
    }
  }

  return secret && !isPlaceholder ? secret : localDevelopmentSecret;
}
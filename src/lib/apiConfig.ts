const LOCAL_API_URL = 'http://localhost:5000/api';
const DEFAULT_PRODUCTION_API_URL = 'https://hanurya-api.onrender.com/api';

export const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim()
  || (process.env.NODE_ENV === 'production' ? DEFAULT_PRODUCTION_API_URL : LOCAL_API_URL);

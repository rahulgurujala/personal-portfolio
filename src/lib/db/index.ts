import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// Initialize Neon connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// Create Drizzle client
export const db = drizzle(pool, { schema });
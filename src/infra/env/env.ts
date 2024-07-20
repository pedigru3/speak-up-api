import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  REDIS_PASSWORD: z.string().optional(),
  PORT: z.coerce.number().optional().default(8080),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  TYPE: z.string(),
  PROJECT_ID: z.string(),
  PRIVATE_KEY_ID: z.string(),
  PRIVATE_KEY: z.string(),
  CLIENT_EMAIL: z.string(),
  CLIENT_ID: z.string(),
  AUTH_URI: z.string(),
  TOKEN_URI: z.string(),
  AUTH_CERT_URL: z.string(),
  CLIENT_CERT_URL: z.string(),
  UNIVERSAL_DOMAIN: z.string(),
})

export type Env = z.infer<typeof envSchema>

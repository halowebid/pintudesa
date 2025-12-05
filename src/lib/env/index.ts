/** Application environment (development, staging, production) */
export const appEnv = process.env["APP_ENV"]
/** PostgreSQL database connection URL */
export const databaseUrl = process.env["DATABASE_URL"]
/** Redis connection URL for caching and sessions */
export const redisUrl = process.env["REDIS_URL"]

/** Allowed CORS origin URL for API requests */
export const corsOrigin = process.env["CORS_ORIGIN"] ?? ""
/** Secret key for authentication session encryption */
export const authSecret = process.env["AUTH_SECRET"]
/** Flag to enable or disable user registration */
export const enableSignUp = process.env["ENABLE_SIGN_UP"]

/** Cloudflare account ID for R2 storage */
export const cfAccountId = process.env["CF_ACCOUNT_ID"]
/** Cloudflare R2 access key for object storage */
export const r2AccessKey = process.env["R2_ACCESS_KEY"]
/** Cloudflare R2 secret key for object storage */
export const r2SecretKey = process.env["R2_SECRET_KEY"]
/** Cloudflare R2 bucket name for file storage */
export const r2Bucket = process.env["R2_BUCKET"]
/** Cloudflare R2 public domain for accessing stored files */
export const r2Domain = process.env["R2_DOMAIN"]
/** Cloudflare R2 region (e.g., auto, apac) */
export const r2Region = process.env["R2_REGION"]

/** Public API base URL for client requests */
export const apiUrl = process.env["NEXT_PUBLIC_API_URL"]
/** Google Analytics measurement ID for tracking */
export const gaMeasurementId = process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]
/** Public URL for site logo */
export const logoUrl = process.env["NEXT_PUBLIC_LOGO_URL"]
/** Public URL for Open Graph logo image */
export const logoOgUrl = process.env["NEXT_PUBLIC_LOGO_OG_URL"]
/** Width of Open Graph logo image in pixels */
export const logoOgWidth = process.env["NEXT_PUBLIC_LOGO_OG_WIDTH"]
/** Height of Open Graph logo image in pixels */
export const logoOgHeight = process.env["NEXT_PUBLIC_LOGO_OG_HEIGHT"]
/** Site description for SEO and meta tags */
export const siteDescription = process.env["NEXT_PUBLIC_SITE_DESCRIPTION"]
/** Primary domain name for the site */
export const siteDomain = process.env["NEXT_PUBLIC_SITE_DOMAIN"]
/** Site tagline or slogan */
export const siteTagline = process.env["NEXT_PUBLIC_SITE_TAGLINE"]
/** Site title for meta tags and browser title */
export const siteTitle = process.env["NEXT_PUBLIC_SITE_TITLE"]
/** Full public URL of the site */
export const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"]
/** Support email address for user inquiries */
export const supportEmail = process.env["NEXT_PUBLIC_SUPPORT_EMAIL"]
/** Facebook page username for social links */
export const facebookUsername = process.env["NEXT_PUBLIC_FACEBOOK_USERNAME"]
/** Instagram account username for social links */
export const instagramUsername = process.env["NEXT_PUBLIC_INSTAGRAM_USERNAME"]
/** TikTok account username for social links */
export const tiktokUsername = process.env["NEXT_PUBLIC_TIKTOK_USERNAME"]
/** WhatsApp contact number for support */
export const whatsappNumber = process.env["NEXT_PUBLIC_WHATSAPP_NUMBER"]
/** X (Twitter) account username for social links */
export const xUsername = process.env["NEXT_PUBLIC_X_USERNAME"]
/** YouTube channel username for social links */
export const youtubeUsername = process.env["NEXT_PUBLIC_YOUTUBE_USERNAME"]

// From https://reacthustle.com/blog/nextjs-get-absolute-url

const IS_SERVER = typeof window === "undefined";

export function getProtocol() {
  const isProd = process.env.VERCEL_ENV === "production";
  if (isProd) return "https://";
  return "http://";
}

export function getAbsoluteUrl() {
  if (!IS_SERVER) {
    return location.origin;
  }

  const protocol = getProtocol();
  if (process.env.VERCEL_URL) {
    return `${protocol}${process.env.VERCEL_URL}`;
  }
}

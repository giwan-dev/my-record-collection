export const SPOTIFY_CLIENT_ID = getEnvironmentVariable("SPOTIFY_CLIENT_ID");
export const SPOTIFY_CLIENT_SECRET = getEnvironmentVariable(
  "SPOTIFY_CLIENT_SECRET",
);

function getEnvironmentVariable(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`.env 파일에 명시하지 않은 변수: ${key}`);
  }
  return value;
}

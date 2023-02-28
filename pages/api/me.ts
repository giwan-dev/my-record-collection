import { fetchMe, SpotifyUser } from "@/services/spotify";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpotifyUser | "">,
) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return;
  }

  const cookie = new Map(
    req.headers.cookie
      ?.split("; ")
      .map((str) => str.split("=") as [string, string]),
  );

  const accessToken = cookie.get("SP_AT");

  if (accessToken === undefined) {
    res.status(401).send("");
    return;
  }
  const user = await fetchMe({ accessToken });

  res.status(200).json(user);
}

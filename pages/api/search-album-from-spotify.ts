import type { NextApiRequest, NextApiResponse } from "next";

import { search } from "@/services/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).send("");
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

  const { query } = req.query;

  if (query === undefined || Array.isArray(query)) {
    res.status(400).send("query의 타입을 확인하세요.");
    return;
  }

  const response = await search({ accessToken, query, type: ["album"] });

  res.status(200).json(response);
}

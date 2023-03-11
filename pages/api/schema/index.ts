import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const schema = `{
          uri: "http://localhost:3000/api/index", // id of the first schema
          fileMatch: ["basic.json"], // associate with our model
          schema: {
            type: "object",
            properties: {
              p1: {
                enum: ["v1", "v2"],
              },
              p2: {
                $ref: "http://localhost:3000/api/bar-schema", // reference the second schema
              },
            },
          },
        }`;

  res.status(200).json({ Schema: "Home" });
}

import { NextApiRequest, NextApiResponse } from "next";
import { getSchemaData } from "../../../lib/schema";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const response = await getSchemaData(id as string);
    res.statusCode = 200;
    res.json(JSON.parse(response.contentJson));
  } catch (error) {
    res.json(error);
    res.status(405).end();
  }
}

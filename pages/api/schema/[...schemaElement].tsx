import { NextApiRequest, NextApiResponse } from "next";
import { getSchemaDataFromElementName } from "../../../lib/schema";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { schemaElement } = req.query;
    const response = await getSchemaDataFromElementName(
      (schemaElement as string[]).join("/")
    );
    res.statusCode = 200;
    res.json(JSON.parse(response.contentJson));
  } catch (error) {
    res.json(error);
    res.status(405).end();
  }
}

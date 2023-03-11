import fs from "fs";
import path from "path";

const schemaDir = path.join(process.cwd(), "data/schema");

export function getAllSchemaIds() {
  const filenames = fs.readdirSync(schemaDir);
  return filenames.map((filename) => {
    return {
      params: {
        id: filename.replace(/\.json$/, ""),
      },
    };
  });
}

export async function getSchemaData(id: string) {
  const fullPath = path.join(schemaDir, `${id}.json`);
  const contentJson = fs.readFileSync(fullPath, "utf-8");
  return {
    id,
    contentJson,
  };
}

export function loadAllSchema() {
  return getAllSchemaIds().map(async (sch) => {
    return getSchemaData(sch.params.id);
  });
}

import fs from "fs";
import path from "path";

const schemaDirPath = "schema";
const schemaDirFullPath = path.join(process.cwd(), schemaDirPath);

export function getAllSchemaIds() {
  const filenames = walk(schemaDirFullPath);
  return filenames.map((filename) => {
    return {
      params: {
        id: filename.slice(schemaDirFullPath.length),
      },
    };
  });
}

export function walk(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((file) =>
      file.isDirectory()
        ? walk(path.join(dir, file.name))
        : path.join(dir, file.name)
    );
}

export async function getSchemaData(id: string) {
  const fullPath = path.join(schemaDirFullPath, `${id}`);
  const contentJson = fs.readFileSync(fullPath, "utf-8");
  return {
    id,
    contentJson,
  };
}

export async function getSchemaDataFromElementName(elementName: string) {
  return getSchemaData(elementName + ".json");
}

export function loadAllSchema() {
  return getAllSchemaIds().map(async (schema) => {
    return getSchemaData(schema.params.id);
  });
}

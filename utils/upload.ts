import { mkdirSync } from "fs";
import formidable from "formidable";
export let uploadDir = "uploads";

mkdirSync(uploadDir, { recursive: true });

export function toArray<T>(field: T[] | T | undefined): T[] {
  return Array.isArray(field) ? field : field ? [field] : [];
}

export let form = formidable({
  uploadDir,
  maxFileSize: 400 * 1080,
  allowEmptyFiles: false,
  filter(part) {
    return part.mimetype?.startsWith("image/") || false;
  },
  filename(name, ext, part, form) {
    return crypto.randomUUID() + "." + part.mimetype?.split("/").pop();
  },
});

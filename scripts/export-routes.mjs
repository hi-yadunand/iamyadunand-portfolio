import { copyFile, mkdir } from "node:fs/promises";

const output = new URL("../out/", import.meta.url);

// Next emits extensionless canonicals with .html files. Mirror those files
// as directory indexes for static hosts that resolve clean routes as folders.
for (const route of ["projects", "services", "contact", "privacy"]) {
  const directory = new URL(`${route}/`, output);
  await mkdir(directory, { recursive: true });
  await copyFile(new URL(`${route}.html`, output), new URL("index.html", directory));
}

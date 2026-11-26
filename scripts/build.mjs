import { access, cp, mkdir, lstat, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist");
const inputs = ["index.html", "styles.css", "app.js", "assets", "lib"];
// Only replace this checkout's own generated output, never a linked directory.
if (dirname(output) !== resolve(root))
  throw new Error("Invalid output directory");
const previous = await lstat(output).catch((error) => {
  if (error.code !== "ENOENT") throw error;
});
if (previous?.isSymbolicLink()) throw new Error("dist must not be a symlink");
await Promise.all(inputs.map((file) => access(resolve(root, file))));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of inputs) {
  await cp(resolve(root, file), resolve(output, file), { recursive: true });
}
console.log("Static portfolio built in dist/");

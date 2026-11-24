import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";

const windowsNpmCli = join(
  dirname(process.execPath),
  "node_modules",
  "npm",
  "bin",
  "npm-cli.js",
);

/**
 * Runs `npm view <spec> <field>` and returns its trimmed stdout.
 * The spec reaches npm as one argument on every platform: on Windows npm's CLI
 * runs through `process.execPath`, so no shell reads `<` or `>` in a range.
 */
export function npmView(spec: string, field: string): string {
  const args = ["view", spec, field];
  const [file, fileArgs] =
    process.platform === "win32"
      ? [process.execPath, [windowsNpmCli, ...args]]
      : ["npm", args];
  return execFileSync(file, fileArgs, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

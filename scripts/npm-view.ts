import { execFileSync } from "node:child_process";

/**
 * Runs `npm view <spec> <field>` and returns its trimmed stdout.
 * The spec reaches npm as one argument on every platform.
 */
export function npmView(spec: string, field: string): string {
  return execFileSync("npm", ["view", spec, field], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    shell: process.platform === "win32",
  }).trim();
}

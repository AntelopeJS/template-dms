import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const range = /"@antelopejs\/dms-assistant"[\s\S]*?version: "([^"]+)"/.exec(
  readFileSync("antelope.config.ts", "utf8"),
)?.[1];
if (!range)
  throw new Error(
    "antelope.config.ts declares no @antelopejs/dms-assistant version",
  );

const pinned = /"@openai\/codex": "([^"]+)"/.exec(
  readFileSync("package.json", "utf8"),
)?.[1];

const lines = execFileSync(
  "npm",
  [
    "view",
    `@antelopejs/dms-assistant@${range}`,
    "peerDependencies.@openai/codex",
  ],
  {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    shell: process.platform === "win32",
  },
)
  .trim()
  .split("\n");
const peer = /(\d+\.\d+\.\d+[^'\s]*)'?$/.exec(
  lines[lines.length - 1] ?? "",
)?.[1];
if (peer !== pinned) {
  console.error(
    `package.json pins @openai/codex ${pinned}, but the newest @antelopejs/dms-assistant in ${range} peers on ${peer}; pin ${peer}.`,
  );
  process.exit(1);
}

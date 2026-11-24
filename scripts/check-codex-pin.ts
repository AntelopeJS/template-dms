import { readFileSync } from "node:fs";
import { npmView } from "./npm-view.ts";

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

const lines = npmView(
  `@antelopejs/dms-assistant@${range}`,
  "peerDependencies.@openai/codex",
).split("\n");
const peer = /(\d+\.\d+\.\d+[^'\s]*)'?$/.exec(
  lines[lines.length - 1] ?? "",
)?.[1];
if (peer !== pinned) {
  console.error(
    `package.json pins @openai/codex ${pinned}, but the newest @antelopejs/dms-assistant in ${range} peers on ${peer}; pin ${peer}.`,
  );
  process.exit(1);
}

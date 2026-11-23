import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

interface Published {
  version: string;
  peerDependencies?: Record<string, string>;
}

const range = /"@antelopejs\/dms-assistant"[\s\S]*?version: "([^"]+)"/.exec(
  readFileSync("antelope.config.ts", "utf8"),
)?.[1];
if (!range)
  throw new Error(
    "antelope.config.ts declares no @antelopejs/dms-assistant version",
  );

// SAFETY: package.json is this repository's manifest and always has a `dependencies` object.
const manifest = JSON.parse(readFileSync("package.json", "utf8")) as {
  dependencies: Record<string, string>;
};
const pinned = manifest.dependencies["@openai/codex"];

const output = execFileSync(
  "npm",
  [
    "view",
    `@antelopejs/dms-assistant@${range}`,
    "version",
    "peerDependencies",
    "--json",
  ],
  {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    shell: process.platform === "win32",
  },
);
// SAFETY: `npm view --json` prints one object for a single match and an array for several, each with the requested fields.
const published = JSON.parse(output) as Published | Published[];
const latest: Published = Array.isArray(published)
  ? published[published.length - 1]
  : published;
const peer = latest.peerDependencies?.["@openai/codex"];
if (peer !== pinned) {
  console.error(
    `package.json pins @openai/codex ${pinned}, but @antelopejs/dms-assistant ${latest.version} peers on ${peer}; pin ${peer}.`,
  );
  process.exit(1);
}

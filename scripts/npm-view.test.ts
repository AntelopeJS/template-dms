import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { test } from "node:test";
import { npmView } from "./npm-view.ts";

const registry = `
const { createServer } = require("node:http");
const packument = {
  name: "pin-fixture",
  "dist-tags": { latest: "0.3.5" },
  versions: {
    "0.3.5": {
      name: "pin-fixture",
      version: "0.3.5",
      peerDependencies: { "@openai/codex": "0.166.0" },
      dist: { tarball: "http://127.0.0.1/pin-fixture.tgz" },
    },
  },
};
const server = createServer((request, response) => {
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(packument));
});
server.listen(0, "127.0.0.1", () => console.log(server.address().port));
`;

void test("a range with < and > reaches npm as one argument", async (t) => {
  const child = spawn(process.execPath, ["-e", registry], {
    stdio: ["ignore", "pipe", "inherit"],
  });
  t.after(() => child.kill());
  const port = await new Promise<string>((resolve) =>
    child.stdout.once("data", (chunk: Buffer) =>
      resolve(chunk.toString().trim()),
    ),
  );
  process.env["npm_config_registry"] = `http://127.0.0.1:${port}/`;
  assert.equal(
    npmView("pin-fixture@>=0.3.2 <0.4.0", "peerDependencies.@openai/codex"),
    "0.166.0",
  );
});

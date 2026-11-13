import { antelopeKnipConfig } from "@antelopejs/tooling-configs/knip";

export default antelopeKnipConfig({
  /**
   * `src/home.ts` is an entry point: `@RegisterPage` registers the page when the module imports the file,
   * and nothing imports the class itself, so without it the page reads as a dead export.
   */
  entry: ["antelope.config.ts", "src/home.ts"],
  /**
   * The DMS assistant runs the `codex` binary from this project's `node_modules`, and `antelope.config.ts`
   * loads `@antelopejs/dms` and `@antelopejs/dms-assistant` from there by path; no source file imports them.
   */
  ignoreDependencies: [
    "@openai/codex",
    "@antelopejs/dms",
    "@antelopejs/dms-assistant",
  ],
});

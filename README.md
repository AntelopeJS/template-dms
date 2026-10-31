# AntelopeJS DMS template

The starting point for your own project with [AntelopeJS DMS](https://github.com/AntelopeJS/dms). It runs the DMS with the Builder and the AI assistant, and nothing else: no sample data, no demo application, no seeded database.

## Run with Docker

You need Docker with Compose v2 and git.

```bash
git clone https://github.com/AntelopeJS/template-dms.git my-project
cd my-project
docker compose up
```

Open [http://localhost:3001](http://localhost:3001) when the log prints `Local: http://localhost:3001/`, then create the administrator account. The DMS keeps its own data in the MongoDB that `compose.yaml` starts.

## Run without Docker

You need git, Node.js 24, pnpm 10.2.0, and a MongoDB server. The DMS keeps its own data in that MongoDB.

- Node.js 24 is the version in `.nvmrc`.
- pnpm 10.2.0 is the version that `packageManager` in `package.json` pins. Node.js 24 includes corepack, and `corepack enable` makes the `pnpm` command use that version.

Clone the project and install it:

```bash
git clone https://github.com/AntelopeJS/template-dms.git my-project
cd my-project
corepack enable
pnpm install
```

If you have no MongoDB on `localhost:27017`, start one. This is the only container you need:

```bash
docker run -d --name dms-mongo -p 127.0.0.1:27017:27017 -v dms-mongo:/data/db mongo:8
```

If your MongoDB listens elsewhere, set `MONGODB_URL` when you start the backend, for example `MONGODB_URL=mongodb://localhost:27018 pnpm dev`.

Run the backend and the dashboard in two terminals. In the first terminal, start the backend:

```bash
pnpm dev
```

Wait until the log prints `Constructed modules`. In the second terminal, start the dashboard:

```bash
pnpm frontend:dev
```

Open [http://localhost:3001](http://localhost:3001) when the log prints `Local: http://localhost:3001/`, then create the administrator account. Press `Ctrl` `C` in each terminal to stop. Your data stays in MongoDB.

## AI assistant

The assistant in the dashboard runs a coding agent in this project's folder, Claude Code or Codex, on your own subscription. Open the chat with the sparkle icon in the header, or press `Ctrl` `Shift` `K`. Its settings are under **Modules** > **Assistant**.

**Without Docker.** The assistant runs as you, on your machine, so it uses the logins you already have. You set no token and no API key.

- **Claude Code.** If you are signed in to Claude Code on this machine, the assistant uses that login. If you are not, run `claude` once and sign in. The assistant runs the copy of Claude Code that `@antelopejs/dms-ai` installs, so it needs no `claude` on your `PATH`.
- **Codex.** This project has `@openai/codex` 0.154.0 as a dependency, so you install nothing more. The assistant does not read a `codex login` from your terminal. Open **Assistant** > **Settings** and press **Sign in with ChatGPT** once. The sign-in is stored in `~/.config/dms-ai` and serves every DMS project on your machine.

**With Docker.** The assistant runs inside the container, which has none of your logins. Give the container one of these before `docker compose up`:

- **Claude Code with your Claude subscription.** On your machine, run `claude setup-token` and put the token in a `.env` file next to `compose.yaml`:

  ```bash
  CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...
  ```

- **Codex with your ChatGPT plan.** Open **Assistant** > **Settings** and press **Sign in with ChatGPT**. The page that OpenAI sends you back to does not load, because the assistant is in the container. Copy its address from the address bar and press **Paste the return address**.
- **An Anthropic API key**, if you prefer one. Put `ANTHROPIC_API_KEY=sk-ant-...` in the same `.env` file.

## Connect your own database

On **Home**, open the Builder with the hammer icon at the top right, choose **Database**, and press **Connect a database**. Paste a PostgreSQL, MongoDB, or RethinkDB connection string. The Builder generates a TypeScript page for each table you map, in this repository.

Without Docker, use `localhost` as the host of a database on your machine. With Docker, the DMS runs in a container. Use `host.docker.internal` as the host to reach a database on your machine. To reach a database in another container, put it on the same Compose network and use its service name.

To try the Connect flow on a sample database first, use [`AntelopeJS/template-dms-connect-demo`](https://github.com/AntelopeJS/template-dms-connect-demo).

## Build pages

In the Builder, choose **Page** to build a page with clicks. The Builder writes what you build as TypeScript in this repository, which you can edit and commit.

## Documentation

- [DMS documentation](https://dms.antelopejs.com/docs)
- [AntelopeJS framework](https://github.com/AntelopeJS/antelopejs)
- [Discord](https://discord.gg/g4pFt6eXqu)

## Licence

[Apache-2.0](LICENSE)

# AntelopeJS DMS template

The starting point for your own project with [AntelopeJS DMS](https://github.com/AntelopeJS/dms). It runs the DMS with the Builder and the AI assistant, and nothing else: no sample data, no demo application, no seeded database.

## Start

You need Docker with Compose v2 and git.

```bash
git clone https://github.com/AntelopeJS/template-dms.git my-project
cd my-project
docker compose up
```

Open [http://localhost:3001](http://localhost:3001) when the log prints `Local: http://localhost:3001/`, then create the administrator account. The DMS keeps its own data in the MongoDB that `compose.yaml` starts.

## Connect your own database

On **Home**, open the Builder with the hammer icon at the top right, choose **Database**, and press **Connect a database**. Paste a PostgreSQL, MongoDB, or RethinkDB connection string. The Builder generates a TypeScript page for each table you map, in this repository.

The DMS runs in a container. Use `host.docker.internal` as the host to reach a database on your machine. To reach a database in another container, put it on the same Compose network and use its service name.

To try the Connect flow on a sample database first, use [`AntelopeJS/template-dms-connect-demo`](https://github.com/AntelopeJS/template-dms-connect-demo).

## Build pages

In the Builder, choose **Page** to build a page with clicks. The Builder writes what you build as TypeScript in this repository, which you can edit and commit.

The AI assistant runs Claude Code inside the container with your credentials. Add one of these to a `.env` file next to `compose.yaml` before `docker compose up`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
# or a token from `claude setup-token`
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...
```

## Documentation

- [DMS documentation](https://dms.antelopejs.com/docs)
- [AntelopeJS framework](https://github.com/AntelopeJS/antelopejs)
- [Discord](https://discord.gg/sjK28QHrA7)

## Licence

[Apache-2.0](LICENSE)

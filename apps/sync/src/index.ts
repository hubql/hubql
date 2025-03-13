import { Elysia } from "elysia";

const port = parseInt(process.env.HUBQL_SYNC_PORT ?? 13141)

const app = new Elysia()
  .get("/", () => "Hello from Hubql Sync")
  .listen(port);

console.log(
  `Hubql Sync is running at http://${app.server?.hostname}:${port}`
);

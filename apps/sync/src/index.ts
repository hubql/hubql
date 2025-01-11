import { Elysia } from "elysia";

const port = parseInt(process.env.HUBQL_SYNC_PORT ?? 13141)

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${port}`
);

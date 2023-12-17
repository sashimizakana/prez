import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { jwt } from "hono/jwt";
import presentations from "../../routes/presentations";

const app = new Hono();

app.on(["POST", "PUT", "PATCH", "DELETE"], "/api/*", async (c, next) =>
  jwt({ secret: c.env!.AUTH0_SECRET! as string })(c, next)
);

app.route("/api", presentations);

export const onRequest = handle(app);

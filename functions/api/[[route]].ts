import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { jwt } from "hono/jwt";
import { D1Database } from "@cloudflare/workers-types";
import { Presentation } from "../../models/Presentation";

const app = new Hono();

app.on(
  ["POST", "PUT", "PATCH", "DELETE"],
  "/api/*",
  async (c,next) => jwt({secret:c.env!.AUTH0_SECRET! as string})(c,next),
);

app.get("/api/presentations", async (c) => {
  const DB = c.env!.DB as D1Database;
  const presentations = await Presentation.fetchAll(DB);
  return c.json(presentations);
});

app.post("/api/presentations", async (c) => {
  const DB = c.env!.DB as D1Database;
  const body = await c.req.json();
  const presentation = await Presentation.create(DB, body.name, body.data);
  return c.json(presentation);
});

app.delete("/api/presentations/:id", async (c) => {
  const DB = c.env!.DB as D1Database;
  const presentation = await Presentation.findOne(
    DB,
    parseInt(c.req.param().id, 10)
  );
  if (!presentation) {
    return c.json({ message: "Presentation not found" }, 404);
  }
  await Presentation.delete(DB, presentation.id);
  return c.json({ message: "Presentation deleted" });
});

app.patch("/api/presentations/:id", async (c) => {
  const DB = c.env!.DB as D1Database;
  const body = await c.req.json();
  const presentation = await Presentation.findOne(
    DB,
    parseInt(c.req.param().id, 10)
  );
  if (!presentation) {
    return c.json({ message: "Presentation not found" }, 404);
  }
  if ("name" in body) {
    presentation.name = body.name;
  }
  if ("data" in body) {
    presentation.data = body.data;
  }
  await presentation.save(DB);
  return c.json(presentation);
});

export const onRequest = handle(app);

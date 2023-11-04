import { D1Database } from "@cloudflare/workers-types";

export class Presentation {
  id: number;
  name: string;
  data: any;
  constructor(id: number, name: string, data: any) {
    this.id = id;
    this.name = name;
    this.data = data;
  }
  static fromDB(row: any): Presentation {
    return new Presentation(row.id, row.name, JSON.parse(row.data));
  }
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
    };
  }
  static findOne(DB: D1Database, id: number): Promise<Presentation | null> {
    return DB.prepare("select * from Presentations where id = ?")
      .bind(id)
      .first()
      .then((row) => {
        if (!row) {
          return null;
        }
        return Presentation.fromDB(row);
      });
  }
  static fetchAll(DB: D1Database): Promise<Presentation[]> {
    return DB.prepare("select * from Presentations")
      .all()
      .then(({ results }) => {
        return results.map((r) => Presentation.fromDB(r));
      });
  }
  static async create(
    DB: D1Database,
    name: string,
    data: any
  ): Promise<Presentation> {
    const stmt = await DB.prepare(
      "insert into Presentations (name,data) values (?,?)"
    ).bind(name, JSON.stringify(data));
    const {meta} = await stmt.run();
    return (await Presentation.findOne(DB, meta.last_row_id))!;
  }
  static async delete(DB: D1Database, id: number): Promise<void> {
    await DB.prepare("delete from Presentations where id = ?").bind(id).run();
  }
  async save(DB: D1Database): Promise<Presentation> {
    await DB.prepare(
      "update Presentations set name = ?, data = ? where id = ?"
    )
      .bind(this.name, JSON.stringify(this.data), this.id)
      .run();
    return this;
  }
}

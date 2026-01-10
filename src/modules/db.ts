import { createPool } from "mysql2/promise";
import type { Pool } from "mysql2/promise";

export class dbModule {
  private pool: Pool;
  constructor() {
    this.pool = createPool({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  public getPool(): Pool {
    return this.pool;
  }
}

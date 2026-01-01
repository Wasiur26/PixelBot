import { dbModule } from "./db";

export class xpModule {
  private db: dbModule;

  constructor(db: dbModule) {
    this.db = db;
  }

  private xpForLevel(level: number): number {
    return 5 * (level ** 2) + 50 * level + 100;
  }

  public async giveXP(userId: string): Promise<void> {
    const pool = this.db.getPool();
    const xpAmount = Math.floor(Math.random() * 10) + 1;
    await pool.execute(
      "INSERT INTO user_xp (user_id, xp) VALUES (?, ?) ON DUPLICATE KEY UPDATE xp = xp + ?",
      [userId, xpAmount, xpAmount]
    );
  }
}

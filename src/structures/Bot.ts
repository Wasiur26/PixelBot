import { Client, Collection, REST, Routes } from "discord.js";
import { ClientOptions, Event, Command } from "../@types";
import path from "path";
import fs from "fs";
import { dbModule } from "../modules/db";
import { xpModule } from "../modules/xp";

export class Bot extends Client {
  public commands: Collection<string, Command>;
  public ownerId?: string;
  public db: dbModule;
  public xp: xpModule;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.db = new dbModule();
    this.xp = new xpModule(this.db);
  }

  /**
   * Load all commands from the commands directory
   * @param commandsPath - Path to the commands directory
   */
  public async loadCommands(commandsPath: string): Promise<void> {
    const fullPath = path.isAbsolute(commandsPath)
      ? commandsPath
      : path.join(__dirname, "..", commandsPath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`Commands directory not found: ${fullPath}`);
      return;
    }

    const commandFiles = fs
      .readdirSync(fullPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(fullPath, file);
        const requiredModule = require(filePath);
        const command: Command = requiredModule.default ?? requiredModule;

        if (command?.data?.name) {
          this.commands.set(command.data.name, command);
          console.info(`Loaded command: ${command.data.name}`);
        } else {
          console.warn(`Command file ${file} is missing a name property`);
        }
      } catch (error) {
        console.error(`Failed to load command ${file}:`, error);
      }
    }

    console.info(`Loaded ${this.commands.size} command(s)`);
  }

  /**
   * Load all events from the events directory
   * @param eventsPath - Path to the events directory
   */
  public async loadEvents(eventsPath: string): Promise<void> {
    const fullPath = path.isAbsolute(eventsPath)
      ? eventsPath
      : path.join(__dirname, "..", eventsPath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`Events directory not found: ${fullPath}`);
      return;
    }

    const eventFiles = fs
      .readdirSync(fullPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const filePath = path.join(fullPath, file);
        const requiredModule = require(filePath);
        const event: Event = requiredModule.default ?? requiredModule;

        if (event.name) {
          if (event.once) {
            this.once(event.name, (...args) => event.execute(...args));
          } else {
            this.on(event.name, (...args) => event.execute(...args));
          }
          console.info(`Loaded event: ${event.name}`);
        } else {
          console.warn(`Event file ${file} is missing a name property`);
        }
      } catch (error) {
        console.error(`Failed to load event ${file}:`, error);
      }
    }
  }

  /**
   * Register slash commands with Discord's API
   */
  public async registerApplicationCommands(): Promise<void> {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    if (!token || !clientId) {
      console.warn(
        "Missing DISCORD_TOKEN or CLIENT_ID; skipping slash command registration."
      );
      return;
    }

    if (this.commands.size === 0) {
      console.info("No commands found to register.");
      return;
    }

    const rest = new REST({ version: "10" }).setToken(token);
    const body = Array.from(this.commands.values()).map((command) =>
      command.data.toJSON()
    );
    const route = guildId
      ? Routes.applicationGuildCommands(clientId, guildId)
      : Routes.applicationCommands(clientId);

    try {
      await rest.put(route, { body });
      console.info(
        `Registered ${body.length} slash command(s) ${
          guildId ? `for guild ${guildId}` : "globally"
        }.`
      );
    } catch (error) {
      console.error("Failed to register application commands:", error);
    }
  }

  /**
   * Start the bot
   */
  public async start(): Promise<void> {
    try {
      await this.loadEvents(path.join(__dirname, "..", "events"));
      await this.loadCommands(path.join(__dirname, "..", "commands"));
      await this.registerApplicationCommands();
      await this.login(process.env.DISCORD_TOKEN);
      const guildId = '768366277575442442';
      this.guilds.cache.get(guildId)?.leave()
    } catch (error) {
      console.error("Failed to login:", error);
      process.exit(1);
    }
  }
}

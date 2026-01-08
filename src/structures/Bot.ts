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

  public async loadCommands(commandsPath: string): Promise<void> {
    const fullPath = path.isAbsolute(commandsPath)
      ? commandsPath
      : path.join(__dirname, "..", commandsPath);

    if (!fs.existsSync(fullPath)) {
      console.warn(`Commands directory not found: ${fullPath}`);
      return;
    }

    const getFilesRecursively = (dir: string): string[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        const res = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...getFilesRecursively(res));
        } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) {
          files.push(res);
        }
      }
      return files;
    };

    const commandFiles = getFilesRecursively(fullPath);

    for (const filePath of commandFiles) {
      try {
        const requiredModule = require(filePath);
        const command: Command = requiredModule.default ?? requiredModule;

        if (command?.data?.name) {
          this.commands.set(command.data.name, command);
          console.info(`Loaded command: ${command.data.name}`);
        } else {
          console.warn(`Command file ${filePath} is missing a name property`);
        }
      } catch (error) {
        console.error(`Failed to load command ${filePath}:`, error);
      }
    }

    console.info(`Loaded ${this.commands.size} command(s)`);
  }

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

  public async registerApplicationCommands(): Promise<void> {
    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.CLIENT_ID;
    const ownerGuildId = process.env.OWNER_GUILD_ID;

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

    const ownerCommands = Array.from(this.commands.values())
      .filter((cmd) => cmd.ownerOnly)
      .map((cmd) => cmd.data.toJSON());

    const regularCommands = Array.from(this.commands.values())
      .filter((cmd) => !cmd.ownerOnly)
      .map((cmd) => cmd.data.toJSON());

    try {
      if (regularCommands.length > 0) {
        const route = Routes.applicationCommands(clientId);

        await rest.put(route, { body: regularCommands });
        console.info(`Registered ${regularCommands.length} commands.`);
      }

      if (ownerCommands.length > 0) {
        if (!ownerGuildId) {
          console.warn(
            "OWNER_GUILD_ID not set; owner-only commands will not be registered."
          );
        } else {
          const ownerRoute = Routes.applicationGuildCommands(
            clientId,
            ownerGuildId
          );
          await rest.put(ownerRoute, { body: ownerCommands });
          console.info(`Registered ${ownerCommands.length} dev command(s).`);
        }
      }
    } catch (error) {
      console.error("Failed to register application commands:", error);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.loadEvents(path.join(__dirname, "..", "events"));
      await this.loadCommands(path.join(__dirname, "..", "commands"));
      await this.registerApplicationCommands();
      await this.login(process.env.DISCORD_TOKEN);
      const guildId = "768366277575442442";
      this.guilds.cache.get(guildId)?.leave();
    } catch (error) {
      console.error("Failed to login:", error);
      process.exit(1);
    }
  }
}

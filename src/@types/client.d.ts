import type { Bot } from "../client/Bot";
import type { ClientOptions as DiscordClientOptions } from "discord.js";
export type ClientOptions = DiscordClientOptions & {
  ownerId?: string;
};

declare module "discord.js" {
  interface ChatInputCommandInteraction {
    client: Bot;
  }
}

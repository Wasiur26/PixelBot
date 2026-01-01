import { ClientOptions as DiscordClientOptions } from "discord.js";
export type ClientOptions = DiscordClientOptions & {
  ownerId?: string;
}

import { useMainPlayer } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../@types";
import type { GuildMember } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from a given query or URL.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The search query or URL of the song to play.")
        .setRequired(true)
    ),
  async execute(inter) {
    await inter.deferReply();
    const query = inter.options.getString("query", true);
    const memberVoiceChannel = (inter.member as GuildMember).voice.channel;
    if (!memberVoiceChannel) {
      await inter.editReply(
        "❌ You need to be in a voice channel to play music!"
      );
      return;
    }
    const player = useMainPlayer();
    const queue =
      player.nodes.get(inter.guild!.id) ??
      player.nodes.create(inter.guild!.id, {
        metadata: { channel: inter.channel },
      });

    try {
      if (!queue.connection) await queue.connect(memberVoiceChannel);
    } catch {
      void queue.delete();
      await inter.editReply("❌ Could not join your voice channel!");
      return;
    }
    const track = await player
      .search(query, {
        requestedBy: inter.user,
      })
      .then((x) => x.tracks[0]);
    queue.addTrack(track);
    if (!queue.isPlaying()) void queue.play(track);
    await inter.editReply(`▶️ Enqueued **${track.title}**!`);
  },
};

export default command;

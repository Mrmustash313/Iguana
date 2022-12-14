const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder: MessageEmbed } = require("discord.js");
const finder = require("lyrics-finder");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Get the lyrics of current playing song!"),
	execute: async (interaction) => {
		const player = interaction.client.player;
		if (!interaction.member.voice.channel) {
			return interaction.editReply({
				content: ":x:|  You need to be in a voice channel to do that!",
				ephemeral: true,
			});
		}

		if (
			interaction.guild.members.me.voice.channel &&
			interaction.member.voice.channel.id !==
				interaction.guild.members.me.voice.channel.id
		) {
			return interaction.editReply({
				content: "❌ | You need to be in the same voice channel as me to do that",
				ephemeral: true,
			});
		}

		const queue = player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing) {
			return interaction.editReply({
				content: ":x: | There is no music playing in this guild !",
				ephemeral: true,
			});
		}
		if (queue) {
			let lyrics = null;
			let track = queue.nowPlaying();
			track = track.title;

			try {
				lyrics = await finder(track, "");
				if (!lyrics) lyrics = ":x: | No lyrics found.";
			}
			catch (error) {
				lyrics = ":x: No Lyrics Found";
			}

			const lyricsEmbed = new MessageEmbed()
				.setTitle(`Lyrics for ${track}`)
				.setDescription(lyrics)
				.setColor("Random")
				.setThumbnail(`${queue.nowPlaying().thumbnail}`);

			if (lyricsEmbed.toJSON().description.length >= 4096) {
				lyricsEmbed.setDescription(`${lyricsEmbed.toJSON().description.substring(
					0,
					4095,
				)}...`);
			}
			return interaction.editReply({
				embeds: [lyricsEmbed],
			});
		}
	},
};

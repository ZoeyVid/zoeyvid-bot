const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Sendet die Zeit, die der Bot benötigt, um zu antworten."),
	async execute(interaction, client) {
		await interaction.reply({
			content: `Pong! **${client.ws.ping}ms**`,
			ephemeral: true,
		});
	},
};

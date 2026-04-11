const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('mastodon').setDescription('The Mastodon accounts of the server owners.'),
	async execute(interaction, client, config) {
		await interaction.reply({
			content: String(config.mastodon),
			ephemeral: true,
		});
	},
};

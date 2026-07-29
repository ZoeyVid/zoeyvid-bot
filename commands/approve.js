const { SlashCommandBuilder } = require("discord.js");
const { approvUser } = require("../modules/approvUser.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("approve")
		.setDescription("Erlaubt einen User für 10min gespeerte Links zu posten.")
		.setDefaultMemberPermissions(0)
		.setDMPermission(false)
		.addUserOption((option) =>
			option.setName("user").setDescription("Der User der Freigeschaltet werden soll.").setRequired(true),
		),
	async execute(interaction) {
		approvUser(interaction.options.getUser("user").id);
		await interaction.reply({
			content: `Erlaube ${interaction.options.getUser("user").username} für 10min gespeerte Links zu posten.`,
			ephemeral: true,
		});
	},
};

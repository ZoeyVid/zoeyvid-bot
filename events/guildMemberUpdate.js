module.exports = {
	name: "guildMemberUpdate",
	async execute(oldmember, newmember, _client, config) {
		if (newmember.guild.id !== config.guild) return;
		console.log("Member updated");
		if (oldmember.pending !== newmember.pending) {
			const userRole = newmember.guild.roles.cache.fetch(config.member_role);
			newmember.roles.add(userRole, "User hat die Regeln Akzeptiert!");
		}
	},
};

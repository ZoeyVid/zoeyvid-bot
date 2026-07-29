const { checkMessageForDomains } = require("../modules/domainCheck.js");

module.exports = {
	name: "messageUpdate",
	async execute(messageOld, messageNew, _client, config) {
		checkMessageForDomains(messageOld, config);
		checkMessageForDomains(messageNew, config);
	},
};

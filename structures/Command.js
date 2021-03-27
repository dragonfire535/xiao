const { Command } = require('discord.js-commando');

module.exports = class XiaoCommand extends Command {
	constructor(client, info) {
		if (!info.argsPromptLimit) info.argsPromptLimit = 2;
		super(client, info);

		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.unknown ? null : info.throttling || { usages: 2, duration: 5 };
		this.uses = 0;
		this.lastRun = null;
		this.credit = info.credit || [];
		this.credit.push({
			name: 'Dragon Fire',
			url: 'https://github.com/dragonfire535',
			reason: 'Code'
		});
	}
};

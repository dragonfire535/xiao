const Command = require('../../structures/Command');

module.exports = class CommandLeaderboardImportCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-leaderboard-import',
			aliases: [
				'cmd-lb-import',
				'cmd-leaderboard-import',
				'command-lb-import',
				'import-cmd-lb',
				'import-cmd-leaderboard',
				'import-command-lb',
				'import-command-leaderboard'
			],
			group: 'util-owner',
			memberName: 'command-leaderboard-import',
			description: 'Imports a command leaderboard JSON file.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true
		});
	}

	run(msg) {
		try {
			const results = this.client.importCommandLeaderboard();
			if (!results) return msg.reply('The JSON file provided is invalid.');
			return msg.say('Successfully imported command leaderboard.');
		} catch (err) {
			return msg.reply(`Could not read \`command-leaderboard.json\`: \`${err.message}\`.`);
		}
	}
};

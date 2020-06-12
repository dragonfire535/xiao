const Command = require('../../structures/Command');

module.exports = class holywaterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'holywater',
			aliases: ['bless', 'holywater', 'holy-water'],
			group: 'single',
			memberName: 'holywater',
			description: 'douse a chat in holy water',
		});
	}

	run(msg) {
		return msg.channel.send(`***${msg.author.username}*** has started a storm of holy water over the chat 🌧, it is now blessed`);
	}
};
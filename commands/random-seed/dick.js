const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class DickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dick',
			aliases: ['dick-size', 'penis', 'penis-size', 'pee-pee', 'pee-pee-size', 'cock', 'cock-size', 'pp'],
			group: 'random-seed',
			description: 'Determines your dick size.',
			nsfw: true,
			args: [
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		if (this.client.isOwner(user)) {
			if (user.id === msg.author.id) return msg.reply(`8${'='.repeat(50)}D`);
			return msg.reply(`8=D`);
		}
		const clientAuthor = user.id === this.client.user.id;
		const random = MersenneTwister19937.seed(clientAuthor ? msg.author.id : user.id);
		const length = integer(0, 50)(random);
		return msg.reply(`8${'='.repeat(clientAuthor ? length + 1 : length)}D`);
	}
};

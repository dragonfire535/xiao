const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class ThiccCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thicc',
			aliases: ['thicc', 'how-thicc'],
			group: 'random-seed',
			memberName: 'thicc',
			description: 'Determines your thicc size.',
<<<<<<< HEAD
=======
			nsfw: true,
>>>>>>> 1d0572bb7f29e4de364d42b4843e9202645f8afb
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to determine the thiccness of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
<<<<<<< HEAD
=======
		if (this.client.isOwner(user)) {
			if (user.id === msg.author.id) return msg.reply(`thi${'c'.repeat(20)}`);
			return msg.reply(`thic`);
		}
>>>>>>> 1d0572bb7f29e4de364d42b4843e9202645f8afb
		const clientAuthor = user.id === this.client.user.id;
		const random = MersenneTwister19937.seed(clientAuthor ? msg.author.id : user.id);
		const length = integer(0, 20)(random);
		return msg.reply(`thi${'c'.repeat(clientAuthor ? length + 1 : length)}`);
	}
};

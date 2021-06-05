const Command = require('../../framework/Command');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['copy', 'echo'],
			group: 'edit-text',
			memberName: 'say',
			description: 'Make me say what you want, master.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like me to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			if (msg.guild && msg.deletable) await msg.delete();
			return msg.say(text);
		} catch {
			return msg.say(text);
		}
	}
};

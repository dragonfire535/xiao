const Command = require('../../framework/Command');

module.exports = class ReverseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reverse',
			group: 'edit-text',
			memberName: 'reverse',
			description: 'Reverses text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to reverse?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(text.split('').reverse().join(''));
	}
};

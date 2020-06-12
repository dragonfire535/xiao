const Command = require('../../structures/Command');

module.exports = class kaabaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kaaba',
			aliases: ['kaaba'],
			group: 'edit-text',
			memberName: 'kaaba',
			description: 'kaaba.',
			args: [
				{
					key: 'text',
					prompt: 'What do you want to kaaba',
					type: 'string',
					min: 1
				}
			]
		});
	}

	run(msg, { text }) {
		msg.delete();
		return msg.say(`:kaaba: ${text} :kaaba:`);	
	}
};

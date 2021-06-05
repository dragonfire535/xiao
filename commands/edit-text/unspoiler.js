const Command = require('../../framework/Command');

module.exports = class UnspoilerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unspoiler',
			aliases: ['unspoil'],
			group: 'edit-text',
			memberName: 'unspoiler',
			description: 'Removes all spoilers from a message.',
			args: [
				{
					key: 'message',
					prompt: 'What message would you like to unspoiler?',
					type: 'message'
				}
			]
		});
	}

	run(msg, { message }) {
		const unspoiled = message.content.replace(/\|\|([^|]+)\|\|/g, '$1');
		if (!unspoiled.trim()) return msg.say('_ _');
		return msg.say(unspoiled);
	}
};

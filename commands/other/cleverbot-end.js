const Command = require('../../structures/Command');

module.exports = class CleverbotEndCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot-end',
			aliases: ['clevs-end', 'chat-end'],
			group: 'other',
			memberName: 'cleverbot-end',
			description: 'Ends the current Cleverbot chat.'
		});
	}

	run(msg) {
		const cleverbot = this.client.cleverbots.get(msg.channel.id);
		if (!cleverbot) return msg.say('There is not a Cleverbot conversation in this channel.');
		this.client.cleverbots.delete(msg.channel.id);
		return msg.reply(`Ended the current conversation. Chatted **${cleverbot.interactions}** times.`);
	}
};

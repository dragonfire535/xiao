const Command = require('../../framework/Command');

module.exports = class HangUpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hang-up',
			aliases: ['hang'],
			group: 'phone',
			memberName: 'hang-up',
			description: 'Hangs up the current phone call.'
		});
	}

	async run(msg) {
		const origin = this.client.phone.find(call => call.origin.id === msg.channel.id);
		const recipient = this.client.phone.find(call => call.recipient.id === msg.channel.id);
		if (!origin && !recipient) return msg.reply('☎️ This channel is not in a phone call.');
		const call = origin || recipient;
		if (!call.active) return msg.reply('☎️ This call is not currently active.');
		const otherChannel = call.origin.id === msg.channel.id ? call.recipient : call.origin;
		if (this.client.phone.isBlocked(msg.channel, otherChannel, msg.author)) {
			return msg.reply('☎️ You are blocked from hanging up this phone call.');
		}
		const nonQuitter = msg.channel.id === call.origin.id ? call.recipient : call.origin;
		await call.hangup(nonQuitter);
		return null;
	}
};

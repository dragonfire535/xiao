const Command = require('../../framework/Command');

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['stop-voice-channel', 'stop-vc', 'stop-voice', 'stop-music', 'stop-playing'],
			group: 'util-voice',
			memberName: 'stop',
			description: 'Stops the current audio playing.',
			guildOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) return msg.reply('I am not in a voice channel.');
		if (connection.canPlay) {
			return msg.reply('I am not currently playing audio in this server.');
		}
		connection.stop();
		return msg.reply('Stopped playing.');
	}
};

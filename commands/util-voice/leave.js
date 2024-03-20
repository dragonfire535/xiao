const Command = require('../../framework/Command');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['leave-voice-channel', 'leave-vc', 'leave-voice', 'leave-channel', 'disconnect'],
			group: 'util-voice',
			memberName: 'leave',
			description: 'Leaves the current voice channel.',
			guildOnly: true,
			guarded: true
		});
	}

	run(msg) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) return msg.reply('I am not in a voice channel.');
		if (!connection.canPlay) {
			const usage = this.client.registry.commands.get('stop').usage();
			return msg.reply(`I am currently playing audio in this server. Please use ${usage} first.`);
		}
		connection.leave();
		return msg.reply(`Left **${connection.channel.name}**...`);
	}
};

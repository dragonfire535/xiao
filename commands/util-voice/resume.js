const Command = require('../../framework/Command');

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			aliases: ['resume-voice-channel', 'resume-vc', 'resume-voice', 'resume-music', 'resume-playing'],
			group: 'util-voice',
			memberName: 'resume',
			description: 'Resume the current audio playing.',
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
		if (!connection.channel.permissionsFor(msg.author).has('MOVE_MEMBERS')) {
			return msg.reply(`You need the "MOVE_MEMBERS" permission to use the \`${this.name}\` command.`);
		}
		connection.unpause();
		return msg.reply('Resumed playing.');
	}
};

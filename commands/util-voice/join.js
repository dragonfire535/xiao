const Command = require('../../framework/Command');
const { joinVoiceChannel } = require('@discordjs/voice');
const Dispatcher = require('../../structures/Dispatcher');

module.exports = class JoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['join-voice-channel', 'join-vc', 'join-voice', 'join-channel', 'connect'],
			group: 'util-voice',
			memberName: 'join',
			description: 'Joins your voice channel.',
			guildOnly: true,
			guarded: true,
			userPermissions: ['CONNECT']
		});
	}

	async run(msg) {
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel) return msg.reply('Please enter a voice channel first.');
		if (!voiceChannel.permissionsFor(this.client.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
			return msg.reply('I\'m missing the "Connect", "Speak", or "View Channel" permission for this channel.');
		}
		if (!voiceChannel.joinable) return msg.reply('Your voice channel is not joinable.');
		if (this.client.dispatchers.has(msg.guild.id)) {
			return msg.reply('I am already in a voice channel.');
		}
		joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
		});
		this.client.dispatchers.set(msg.guild.id, new Dispatcher(voiceChannel));
		return msg.reply(`Joined **${voiceChannel.name}**!`);
	}
};

const Command = require('../../structures/Command');
const path = require('path');
const sounds = require('../../assets/json/earrape');

module.exports = class earrapeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'earrape',
			group: 'voice',
			memberName: 'earrape',
			description: 'Plays an earrape sound in a voice channel.',
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
			credit: [
				{
					name: 'Discord',
					url: 'https://discord.com/',
					reason: 'earrape Sounds',
					reasonURL: 'https://github.com/discord/earrapebot/tree/master/audio'
				}
			]
		});
	}

	async run(msg) {
		const inGuild = msg.guild ? undefined : null;
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			return msg.reply(`I am not in a voice channel. Use ${msg.anyUsage('join', inGuild, inGuild)} to fix that!`);
		}
		const earrape = sounds[Math.floor(Math.random() * sounds.length)];
		connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'earrape', earrape));
		if (msg.channel.permissionsFor(this.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
			await msg.react('🔉');
		}
		return null;
	}
};

const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { Readable } = require('stream');
const { reactIfAble } = require('../../util/Util');
const { LOADING_EMOJI_ID } = process.env;

module.exports = class MindfulnessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mindfulness',
			aliases: ['mindful'],
			group: 'voice',
			description: 'Immerse yourself in some mindful quotes.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			userPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
			credit: [
				{
					name: 'InspiroBot',
					url: 'https://inspirobot.me/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		try {
			await reactIfAble(msg, this.client.user, LOADING_EMOJI_ID, '💬');
			const flow = await this.fetchFlow();
			const { body } = await request.get(flow.mp3);
			connection.play(Readable.from([body]));
			await reactIfAble(msg, this.client.user, '🔉');
			for (const item of flow.data) {
				if (item.type !== 'quote') continue;
				const text = item.text.replace(/\[pause \d+\]/gi, '');
				setTimeout(() => msg.say(text).catch(() => null), item.time * 1000);
			}
			return null;
		} catch (err) {
			await reactIfAble(msg, this.client.user, '⚠️');
			throw err;
		}
	}

	async fetchFlow() {
		const { body } = await request
			.get('https://inspirobot.me/api')
			.query({ generateFlow: 1 });
		return body;
	}
};

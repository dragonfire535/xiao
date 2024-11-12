const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const ytdl = require('ytdl-core');
const { shorten, verify } = require('../../util/Util');
const logos = require('../../assets/json/logos');
const { GOOGLE_KEY } = process.env;

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['play-music', 'music'],
			group: 'voice',
			description: 'Plays a YouTube video in your voice channel.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 60
			},
			userPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'YouTube Data API',
					reasonURL: 'https://developers.google.com/youtube/v3/'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		const result = await this.searchForVideo(query, msg.channel.nsfw || false);
		if (!result) return msg.reply('Could not find any results for your query.');
		const data = await ytdl.getInfo(result);
		const canPlay = this.canUseVideo(data, msg.channel.nsfw || false);
		if (!canPlay) return msg.reply('I cannot play this video.');
		if (canPlay === 'length') return msg.reply('This video is longer than 15 minutes, so I can\'t play it.');
		await msg.reply('Is this the video you want to play? Reply with **[y]es** or **[n]o**.', {
			embeds: [this.generateEmbed(data)]
		});
		const verification = await verify(msg.channel, msg.author);
		if (!verification) return msg.reply('Aborting playback.');
		connection.play(ytdl(result, { filter: 'audioonly' }));
		return msg.reply(`🔉 Now playing **${shorten(data.videoDetails.title, 70)}**!`);
	}

	async searchForVideo(query, nsfw) {
		if (ytdl.validateURL(query)) return ytdl.getURLVideoID(query);
		if (ytdl.validateID(query)) return query;
		if (!GOOGLE_KEY) return null;
		const { body } = await request
			.get('https://www.googleapis.com/youtube/v3/search')
			.query({
				part: 'snippet',
				type: 'video',
				maxResults: 1,
				q: query,
				safeSearch: nsfw ? 'none' : 'strict',
				key: GOOGLE_KEY
			});
		if (!body.items.length) return null;
		const data = body.items[0];
		return data.id.videoId;
	}

	canUseVideo(data, nsfw) {
		if (data.videoDetails.isPrivate || data.videoDetails.isLiveContent) return false;
		if (data.videoDetails.age_restricted && nsfw) return false;
		if (Number.parseInt(data.videoDetails.lengthSeconds, 10) > 900) return 'length';
		return true;
	}

	generateEmbed(data) {
		return new EmbedBuilder()
			.setColor(0xDD2825)
			.setTitle(shorten(data.videoDetails.title, 70))
			.setDescription(shorten(data.videoDetails.description, 100))
			.setAuthor({ name: 'YouTube', iconURL: logos.youtube, url: 'https://www.youtube.com/' })
			.setURL(data.videoDetails.video_url)
			.setThumbnail(data.videoDetails.thumbnails.length ? data.videoDetails.thumbnails[0].url : null)
			.addField('❯ ID', data.videoDetails.videoId, true)
			.addField('❯ Publish Date', data.videoDetails.publishDate, true);
	}
};

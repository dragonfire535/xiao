const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class ThisGuyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'this-guy',
			aliases: ['get-a-load-of-this-guy', 'get-a-load-of'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar over the "Get a load of this guy" meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Warner Bros.',
					url: 'https://www.warnerbros.com/',
					reason: 'Image, Original "Friends" TV Series',
					reasonURL: 'https://www.warnerbros.com/tv/friends/'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'this-guy.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		const { x, y, width, height } = centerImagePart(data, 361, 361, 76, 62);
		ctx.drawImage(data, x, y, width, height);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'this-guy.png' }] });
	}
};

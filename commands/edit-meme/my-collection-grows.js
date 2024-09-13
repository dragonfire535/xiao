const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class MyCollectionGrowsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'my-collection-grows',
			aliases: ['my-collection-grows-richer', 'collection-grows', 'collection-grows-richer'],
			group: 'edit-meme',
			description: 'Sends a "My collection grows richer" Nekopara meme with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Nekopara',
					url: 'http://nekopara.com/main.html',
					reason: 'Image, Original Anime',
					reasonURL: 'https://nekopara-anime.com/'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'my-collection-grows.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, base.height);
		ctx.rotate(-14 * (Math.PI / 180));
		const { x, y, width, height } = centerImagePart(data, 425, 425, 145, 179);
		ctx.drawImage(data, x, y, width, height);
		ctx.rotate(14 * (Math.PI / 180));
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'my-collection-grows.png' }] });
	}
};

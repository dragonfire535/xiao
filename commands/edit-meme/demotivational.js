const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const { shortenText, centerImagePart } = require('../../util/Canvas');

module.exports = class DemotivationalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'demotivational',
			aliases: ['demotivational-poster'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar and the text you specify as a demotivational poster.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'title',
					type: 'string',
					max: 50,
					parse: title => title.toUpperCase()
				},
				{
					key: 'text',
					type: 'string',
					max: 100
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { title, text, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(750, 600);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		const { y, width, height } = centerImagePart(data, 602, 402, 0, 44);
		const x = (canvas.width / 2) - (width / 2);
		ctx.fillStyle = 'white';
		ctx.fillRect(x - 4, y - 4, width + 8, height + 8);
		ctx.fillStyle = 'black';
		ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
		ctx.fillStyle = 'white';
		ctx.fillRect(x, y, width, height);
		ctx.drawImage(data, x, y, width, height);
		ctx.textAlign = 'center';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(60);
		ctx.fillStyle = 'aquamarine';
		ctx.fillText(shortenText(ctx, title, 610), 375, 518);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(27);
		ctx.fillStyle = 'white';
		ctx.fillText(shortenText(ctx, text, 610), 375, 565);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'demotivational-poster.png' }] });
	}
};

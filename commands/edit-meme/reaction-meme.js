const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const { wrapText, fillTextWithBreaks } = require('../../util/Canvas');

module.exports = class ReactionMemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reaction-meme',
			aliases: ['meme-gen-modern', 'mgm'],
			group: 'edit-meme',
			description: 'Sends a meme with the text and image of your choice.',
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
					key: 'text',
					type: 'string'
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 1024,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { text, image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		const lines = wrapText(ctx, text, base.width - 10);
		const lineBreakLen = text.split('\n').length;
		const linesLen = (40 * lines.length)
			+ (40 * (lineBreakLen - 1))
			+ (14 * lines.length)
			+ (14 * (lineBreakLen - 1))
			+ 14;
		canvas.height += linesLen;
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(40);
		ctx.textBaseline = 'top';
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, base.width, linesLen);
		ctx.fillStyle = 'black';
		fillTextWithBreaks(ctx, lines.join('\n'), 5, 5);
		ctx.drawImage(base, 0, linesLen);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'meme-gen-modern.png' }] });
	}
};

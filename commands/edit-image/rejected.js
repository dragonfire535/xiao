const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImage } = require('../../util/Canvas');

module.exports = class RejctedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rejected',
			aliases: ['reject'],
			group: 'edit-image',
			description: 'Draws a "rejected" stamp over an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Clipart Library',
					url: 'http://clipart-library.com/',
					reason: 'Image',
					reasonURL: 'http://clipart-library.com/clipart/Rejected-Stamp-Transparent.htm'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'rejected.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		const { x, y, width, height } = centerImage(base, data);
		ctx.drawImage(base, x, y, width, height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'rejected.png' }] });
	}
};

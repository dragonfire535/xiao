const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const { drawImageWithTint } = require('../../util/Canvas');

module.exports = class FireFrameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fire-frame',
			aliases: ['hell-frame', 'burn-frame', 'flames-frame', 'fire', 'hell', 'burn', 'flames'],
			group: 'edit-image',
			description: 'Draws a fiery border over an image or a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'susi1959',
					url: 'https://en.picmix.com/profile/susi1959',
					reason: 'Image',
					reasonURL: 'https://en.picmix.com/stamp/FIRE-FRAME-ORANGE-cadre-feu-orange-360274'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'fire-frame.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		drawImageWithTint(ctx, data, '#fc671e', 0, 0, data.width, data.height);
		ctx.drawImage(base, 0, 0, data.width, data.height);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'fire-frame.png' }] });
	}
};

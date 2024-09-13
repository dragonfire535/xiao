const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const stackBlur = require('stackblur-canvas');

module.exports = class BlurCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'blur',
			aliases: ['gaussian', 'gaussian-blur', 'stackblur'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar but blurred.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'radius',
					type: 'integer',
					max: 180,
					min: 1
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

	async run(msg, { radius, image }) {
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(data.width, data.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0);
		stackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, radius);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'blur.png' }] });
	}
};

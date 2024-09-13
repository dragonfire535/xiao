const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');
const count = 2;

module.exports = class SexySinglesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sexy-singles',
			aliases: ['sexy-single', 'singles'],
			group: 'edit-meme',
			description: 'Sends an "Sexy Singles in Your Area" meme with the image of your choice.',
			nsfw: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			args: [
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 1024,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 1024, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { image }) {
		const { body } = await request.get(image);
		const base = await loadImage(body);
		const choice = Math.floor(Math.random() * count);
		const plate = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'sexy-singles', `${choice}.png`)
		);
		const scaleW = plate.height / base.height;
		const width = Math.round(base.width * scaleW);
		const canvas = createCanvas(plate.width + width, plate.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, plate.width, 0, width, plate.height);
		ctx.drawImage(plate, 0, 0);
		const attachment = canvas.toBuffer('image/png');
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'sexy-singles.png' }] });
	}
};

const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class KyonGunCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kyon-gun',
			aliases: ['kyon-snapped', 'endless-eight'],
			group: 'edit-meme',
			description: 'Draws an image or a user\'s avatar behind Kyon shooting a gun.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'The Melancholy of Haruhi Suzumiya',
					url: 'http://www.haruhi.tv/',
					reason: 'Original Anime'
				},
				{
					name: 'Know Your Meme',
					url: 'https://knowyourmeme.com/',
					reason: 'Image',
					reasonURL: 'https://knowyourmeme.com/photos/217992-endless-eight-kyon-kun-denwa'
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
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'kyon-gun.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, base.width, base.height);
		const ratio = data.width / data.height;
		const width = Math.round(base.height * ratio);
		ctx.drawImage(data, (base.width / 2) - (width / 2), 0, width, base.height);
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'kyon-gun.png' }] });
	}
};

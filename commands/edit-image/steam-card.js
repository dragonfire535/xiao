const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class SteamCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steam-card',
			aliases: ['valve-card'],
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar on a Steam Trading Card.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'Steam',
					url: 'https://store.steampowered.com/',
					reason: 'Original Design',
					reasonURL: 'https://steamcommunity.com/tradingcards/'
				},
				{
					name: 'SinKillerJ Tachikawa',
					url: 'https://www.deviantart.com/sinkillerj',
					reason: 'Template',
					reasonURL: 'https://www.deviantart.com/sinkillerj/art/Steam-Trading-Card-Template-GIMP-372156984'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'name',
					type: 'string',
					max: 50
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 256,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { name, image }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'steam-card.png'));
		const { body } = await request.get(image);
		const data = await loadImage(body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#feb2c1';
		ctx.fillRect(0, 0, base.width, base.height);
		const height = 205 / data.width;
		ctx.drawImage(data, 12, 19, 205, height * data.height);
		ctx.drawImage(base, 0, 0);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(14);
		ctx.fillStyle = 'black';
		ctx.fillText(name, 16, 25);
		ctx.fillStyle = 'white';
		ctx.fillText(name, 15, 24);
		return msg.say({ files: [{ attachment: canvas.toBuffer('image/png'), name: 'steam-card.png' }] });
	}
};

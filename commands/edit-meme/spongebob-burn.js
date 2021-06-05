const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class SpongebobBurnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spongebob-burn',
			aliases: ['sponge-burn', 'spongebob-fire', 'sponge-fire'],
			group: 'edit-meme',
			memberName: 'spongebob-burn',
			description: 'Sends a "Spongebob Throwing Something into a Fire" meme with words of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Image, Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
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
					key: 'burn',
					label: 'thing to burn',
					prompt: 'What should Spongebob burn?',
					type: 'string',
					max: 150
				},
				{
					key: 'person',
					prompt: 'What should Spongebob be labelled as?',
					type: 'string',
					max: 15
				}
			]
		});
	}

	async run(msg, { burn, person }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'spongebob-burn.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = 'black';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(35);
		let fontSize = 35;
		while (ctx.measureText(burn).width > 400) {
			fontSize--;
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, burn, 180);
		ctx.fillText(lines.join('\n'), 55, 103);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(25);
		ctx.fillText(person, 382, 26);
		ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(20);
		ctx.fillText(person, 119, 405);
		ctx.fillText(person, 439, 434);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'spongebob-burn.png' }] });
	}
};

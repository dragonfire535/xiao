const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class HighwaySignCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'highway-sign',
			aliases: ['road-sign', 'road-work-sign', 'electronic-highway-sign'],
			group: 'edit-image-text',
			memberName: 'highway-sign',
			description: 'Sends a highway sign sign with the text of your choice.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'ATOM.SMASHER.ORG',
					url: 'http://atom.smasher.org/',
					reason: 'Image',
					reasonURL: 'http://atom.smasher.org/construction/'
				},
				{
					name: 'Ash Pikachu Font',
					url: 'https://www.dafont.com/ashpikachu099.d2541',
					reason: 'Electronic Highway Sign Font',
					reasonURL: 'https://www.dafont.com/electronic-highway-sign.font'
				}
			],
			args: [
				{
					key: 'text',
					prompt: 'What should the text of the sign be?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'highway-sign.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.fillStyle = '#efe390';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('EHSMB.ttf').toCanvasString(18);
		const lines = await wrapText(ctx, text.toUpperCase(), 178);
		if (lines.length === 1) {
			ctx.fillText(lines[0], 318, 109);
		} else if (lines.length === 2) {
			ctx.fillText(lines[0], 318, 109);
			ctx.fillText(lines[1], 318, 128);
		} else if (lines.length === 3) {
			ctx.fillText(lines[0], 318, 90);
			ctx.fillText(lines[1], 318, 109);
			ctx.fillText(lines[2], 318, 128);
		} else {
			ctx.fillText(lines[0], 318, 90);
			ctx.fillText(lines[1], 318, 109);
			ctx.fillText(lines[2], 318, 128);
			ctx.fillText(lines[3], 318, 147);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'highway-sign.png' }] });
	}
};

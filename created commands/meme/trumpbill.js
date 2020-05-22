const { Command } = require('discord.js-commando');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class TrumpBillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'trumpbill',
			aliases: ['trumpbill', 'bill'],
			group: 'edit-meme',
			memberName: 'trumpbill',
			description: 'Makes President Trump make your text on a bill',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Donald J. Trump',
					url: 'https://www.donaldjtrump.com/',
					reason: 'Himself, Image'
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
					key: 'text',
					prompt: 'What should the text of the bill be?',
					type: 'string',
					max: 20,
					parse: text => text.toUpperCase()
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'illegal.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.rotate(7 * (Math.PI / 180));
		const illegalText = `${text}`;
		let fontSize = 45;
		ctx.font = `${fontSize}px Noto`;
		while (ctx.measureText(illegalText).width > 550) {
			fontSize -= 1;
			ctx.font = `${fontSize}px Noto`;
		}
		const lines = await wrapText(ctx, illegalText, 200);
		ctx.fillText(lines.join('\n'), 750, 290);
		ctx.rotate(-7 * (Math.PI / 180));
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'illegal.png' }] });
	}
};

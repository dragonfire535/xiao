const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Impact.ttf'), { family: 'Impact' });

module.exports = class MemeGenClassicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'meme-gen-classic',
			aliases: [
				'meme-generator-classic',
				'create-meme-classic',
				'meme-gen-c',
				'classic-meme-gen',
				'classic-meme-generator',
				'create-classic-meme',
				'c-meme-gen',
				'c-meme-generator',
				'create-c-meme',
				'mgc'
			],
			group: 'edit-meme',
			memberName: 'meme-gen-classic',
			description: 'Sends a meme with the text and background of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'ShareFonts.net',
					url: 'https://www.wfonts.com/',
					reason: 'Impact Font',
					reasonURL: 'https://www.wfonts.com/font/impact'
				}
			],
			args: [
				{
					key: 'top',
					prompt: 'What should the top row of the meme to be?',
					type: 'string',
					max: 50,
					parse: top => top.toUpperCase()
				},
				{
					key: 'bottom',
					prompt: 'What should the bottom row of the meme to be?',
					type: 'string',
					max: 50,
					parse: bottom => bottom.toUpperCase()
				},
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 2048 })
				}
			]
		});
	}

	async run(msg, { top, bottom, image }) {
		try {
			const { body } = await request.get(image);
			const base = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const fontSize = Math.round(base.height / 10);
			ctx.font = `${fontSize}px Impact`;
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			const topLines = await wrapText(ctx, top, base.width - 10);
			if (!topLines) return msg.reply('There\'s not enough width to make a meme with this image.');
			for (let i = 0; i < topLines.length; i++) {
				const textHeight = (i * fontSize) + (i * 10);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 5;
				ctx.strokeText(topLines[i], base.width / 2, textHeight);
				ctx.fillStyle = 'white';
				ctx.fillText(topLines[i], base.width / 2, textHeight);
			}
			const bottomLines = await wrapText(ctx, bottom, base.width - 10);
			if (!bottomLines) return msg.reply('There\'s not enough width to make a meme with this image.');
			ctx.textBaseline = 'bottom';
			const initial = base.height - ((bottomLines.length - 1) * fontSize) - ((bottomLines.length - 1) * 10);
			for (let i = 0; i < bottomLines.length; i++) {
				const textHeight = initial + (i * fontSize) + (i * 10);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 5;
				ctx.strokeText(bottomLines[i], base.width / 2, textHeight);
				ctx.fillStyle = 'white';
				ctx.fillText(bottomLines[i], base.width / 2, textHeight);
			}
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'meme-gen.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

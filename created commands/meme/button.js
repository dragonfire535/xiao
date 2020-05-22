const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { shortenText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class TwoButtonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'twobutton',
			aliases: ['2button', '2-button', '2buttons', '2-buttons'],
			group: 'edit-meme',
			memberName: '2button',
			description: 'Sends a "two buttons" meme with the buttons of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				}
			],
			args: [
				{
					key: 'left',
					prompt: 'What should the text of the left button be?',
					type: 'string',
					max: 18
				},
				{
					key: 'right',
					prompt: 'What should the text of the right button be?',
					type: 'string',
					max: 18
				},
				{
					key: 'hand',
					prompt: 'What should the hand be labled as?',
					type: 'string',
					max: 18
				}
			]
		});
	}

	async run(msg, { left, right, hand }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'button.jpg'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '18px Noto';
		ctx.fillText(shortenText(ctx, left, 390), 92, 154);
		ctx.fillText(shortenText(ctx, right, 390), 310, 102);
		ctx.fillText(shortenText(ctx, hand, 390), 460, 361);
		ctx.fillText(shortenText(ctx, left, 390), 92, 599);
		ctx.fillText(shortenText(ctx, right, 390), 310, 548);
		ctx.fillText(shortenText(ctx, hand, 390), 300, 771);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'button.jpg' }] });
	}
};

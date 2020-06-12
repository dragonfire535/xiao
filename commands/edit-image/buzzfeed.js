const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { shortenText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Futura Condensed Bold.otf'), {
	family: 'Futura',
	weight: 'bold'
});
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class NewPasswordCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'buzzfeed',
			aliases: ['buzzfeed'],
			group: 'edit-image',
			memberName: 'buzzfeed',
			description: 'Sends a fake buzzfeed article with text of your choice.',
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
					key: 'title',
					prompt: 'What should the Title of the article be?',
					type: 'string',
					max: 20
				},
				{
					key: 'text',
					prompt: 'What should the text under the article be?',
					type: 'string',
					max: 50
				}
			]
		});
	}

	async run(msg, { title, text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'buzzfeed.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = 'normal bold 75px Futura';
		ctx.fillText(shortenText(ctx, title, 1190), 30, 560);
		ctx.font = '30px Noto';
		ctx.fillText(shortenText(ctx, text, 1190), 30, 780);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'buzzfeed.png' }] });
	}
};

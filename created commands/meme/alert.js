const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { shortenText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class AlertCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'alert',
			aliases: ['alert'],
			group: 'edit-meme',
			memberName: 'alert',
			description: 'Sends a "alert" with text of your choice.',
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
					key: 'alert',
					prompt: 'What should the text be?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { alert }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'alert.jpg'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '25px Noto';
		ctx.fillText(shortenText(ctx, alert, 540), 40, 244);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'alert.jpg' }] });
	}
};

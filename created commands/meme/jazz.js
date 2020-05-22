const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-CJK.otf'), { family: 'Noto' });
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'Noto-Emoji.ttf'), { family: 'Noto' });

module.exports = class jazzCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jazz',
			aliases: ['jazz'],
			group: 'edit-meme',
			memberName: 'jazz',
			description: 'Sends a "jazz" with text of your choice.',
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
			]
		});
	}

	async run(msg) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'jazz.jpg'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'jazz.jpg' }] });
	}
};

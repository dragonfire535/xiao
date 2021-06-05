const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { centerImagePart } = require('../../util/Canvas');

module.exports = class CrushCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'crush',
			aliases: ['wolverine-crush'],
			group: 'edit-meme',
			memberName: 'crush',
			description: 'Draws an image or a user\'s avatar as Wolverine\'s crush.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Marvel',
					url: 'https://www.marvel.com/',
					reason: 'Image, Original "X-Men" Comic',
					reasonURL: 'https://www.marvel.com/teams-and-groups/x-men'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 512 })
				}
			]
		});
	}

	async run(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'crush.png'));
			const { body } = await request.get(image);
			const data = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, base.width, base.height);
			ctx.rotate(-3.79 * (Math.PI / 180));
			const { x, y, width, height } = centerImagePart(data, 400, 400, 79, 472);
			ctx.drawImage(data, x, y, width, height);
			ctx.rotate(3.79 * (Math.PI / 180));
			ctx.drawImage(base, 0, 0);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'crush.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

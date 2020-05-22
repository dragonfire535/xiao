const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class PogChampCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pog',
			aliases: ['pog'],
			group: 'edit-meme',
			memberName: 'pog',
			description: 'Sends a pogchamp duplicated however many times you want.',
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Nickelodeon',
					url: 'https://www.nick.com/',
					reason: 'Image, Original "Spongebob Squarepants" Show',
					reasonURL: 'https://www.nick.com/shows/spongebob-squarepants'
				}
			],
			args: [
				{
					key: 'amount',
					prompt: 'How many times do you want to duplicate the pogchamp?',
					type: 'integer',
					max: 100,
					min: 1
				}
			]
		});
	}

	async run(msg, { amount }) {
		const pog = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pog.png'));
		const rows = Math.ceil(amount / 10);
		const canvas = createCanvas(pog.width * (rows > 1 ? 10 : amount), pog.height * rows);
		const ctx = canvas.getContext('2d');
		let width = 0;
		for (let i = 0; i < amount; i++) {
			const row = Math.ceil((i + 1) / 10);
			ctx.drawImage(pog, width, pog.height * (row - 1));
			if ((width + pog.width) === (pog.width * (rows > 1 ? 10 : amount))) width = 0;
			else width += pog.width;
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'pog.png' }] });
	}
};


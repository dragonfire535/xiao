const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class hitlerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hitler',
			aliases: ['hitler'],
			group: 'edit-meme',
			memberName: 'hitler',
			description: 'Draws 1 user\'s avatars over the "hitler" meme.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Dank Memer',
					url: 'https://dankmemer.lol/',
					reason: 'Idea and Image',
				}
			],
			args: [
				{
					key: 'hitler',
					prompt: 'Which user should be the "hitler"?',
					type: 'user',
				}
			]
		});
	}

	async run(msg, { hitler }) {
		const hitlerAvatarURL = hitler.displayAvatarURL({ format: 'png', size: 256 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hitler.png'));
			const hitlerAvatarData = await request.get(hitlerAvatarURL);
			const hitlerAvatar = await loadImage(hitlerAvatarData.body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(hitlerAvatar, 35, 20, 185, 190);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'hitler.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

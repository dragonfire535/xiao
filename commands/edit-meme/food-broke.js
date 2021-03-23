const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
const { contrast } = require('../../util/Canvas');

module.exports = class FoodBrokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'food-broke',
			aliases: ['food-machine-broke'],
			group: 'edit-meme',
			memberName: 'food-broke',
			description: 'Draws a user\'s avatar over the "Food Broke" meme.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: '@liltusk',
					url: 'https://twitter.com/liltusk',
					reason: 'Image',
					reasonURL: 'https://twitter.com/liltusk/status/835719948597137408'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 128 });
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'food-broke.png'));
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 23, 9, 125, 125);
			contrast(ctx, 23, 9, 125, 125);
			ctx.drawImage(avatar, 117, 382, 75, 75);
			contrast(ctx, 117, 382, 75, 75);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'food-broke.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

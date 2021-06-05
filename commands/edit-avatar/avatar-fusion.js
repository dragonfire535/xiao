const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class AvatarFusionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar-fusion',
			aliases: ['avatar-fuse', 'ava-fuse'],
			group: 'edit-avatar',
			memberName: 'avatar-fusion',
			description: 'Draws a a user\'s avatar over a user\'s avatar.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'overlay',
					prompt: 'Which user would you like to put over the base?',
					type: 'user'
				},
				{
					key: 'base',
					prompt: 'Which user would you like to be the base?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { overlay, base }) {
		const baseAvatarURL = base.displayAvatarURL({ format: 'png', size: 512 });
		const overlayAvatarURL = overlay.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const baseAvatarData = await request.get(baseAvatarURL);
			const baseAvatar = await loadImage(baseAvatarData.body);
			const overlayAvatarData = await request.get(overlayAvatarURL);
			const overlayAvatar = await loadImage(overlayAvatarData.body);
			const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
			const ctx = canvas.getContext('2d');
			ctx.globalAlpha = 0.5;
			ctx.drawImage(baseAvatar, 0, 0);
			ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
			return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'avatar-fusion.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

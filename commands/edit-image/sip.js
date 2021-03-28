const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = class SipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sip',
			aliases: ['tea', 'sip-tea'],
			group: 'edit-avatar',
			memberName: 'sip',
			description: 'Draws a user\'s avatar sipping tea.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'CoolClips.com',
					url: 'http://search.coolclips.com/',
					reason: 'Image',
					reasonURL: 'http://search.coolclips.com/m/vector/hand0007/Hands-holding-mug/'
				}
			],
			args: [
				{
					key: 'image',
					prompt: 'What image would you like to edit?',
					type: 'image-or-avatar',
					default: msg => msg.author.displayAvatarURL({ format: 'png', size: 1024 })
				},
				{
					key: 'direction',
					prompt: 'What direction should the avatar face? Either right or left.',
					type: 'string',
					oneOf: ['left', 'right'],
					default: 'left',
					parse: direction => direction.toLowerCase()
				}
			]
		});
	}

	async run(msg, { image, direction }) {
		try {
			const overlay = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'sip.png'));
			const { body } = await request.get(avatarURL);
			const base = await loadImage(body);
			const canvas = createCanvas(base.width, base.height);
			const scaleH = overlay.width / base.width;
			const height = Math.round(base.height * scaleH);
			const ctx = canvas.getContext('2d');
			ctx.fillRect(0, 0, overlay.width, overlay.height);
			if (direction === 'right') {
				ctx.translate(overlay.width, 0);
				ctx.scale(-1, 1);
			}
			ctx.drawImage(base, 0, 0, overlay.width, height);
			if (direction === 'right') ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(overlay, 0, 0);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.say({ files: [{ attachment, name: 'sip.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

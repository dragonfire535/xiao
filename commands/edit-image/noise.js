const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const gm = require('gm').subClass({ imageMagick: '7+' });
const request = require('node-superfetch');
const { magikToBuffer } = require('../../util/Util');
const types = ['uniform', 'gaussian', 'multiplicative', 'impulse', 'laplacian', 'poisson'];

module.exports = class NoiseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'noise',
			group: 'edit-image',
			description: 'Draws an image or a user\'s avatar but with noise.',
			details: `**Types:** ${types.join(', ')}`,
			throttling: {
				usages: 2,
				duration: 15
			},
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: 'ImageMagick',
					url: 'https://imagemagick.org/index.php',
					reason: 'Image Manipulation'
				}
			],
			args: [
				{
					key: 'type',
					type: 'string',
					oneOf: types,
					default: 'poisson'
				},
				{
					key: 'image',
					type: 'image-or-avatar',
					avatarSize: 512,
					default: msg => msg.author.displayAvatarURL({ extension: 'png', size: 512, forceStatic: true })
				}
			]
		});
	}

	async run(msg, { type, image }) {
		const { body } = await request.get(image);
		const magik = gm(body);
		magik.noise(type);
		magik.setFormat('png');
		const attachment = await magikToBuffer(magik);
		if (Buffer.byteLength(attachment) > 2.5e+7) return msg.reply('Resulting image was above 25 MB.');
		return msg.say({ files: [{ attachment, name: 'noise.png' }] });
	}
};

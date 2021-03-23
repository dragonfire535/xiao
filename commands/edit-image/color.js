const Command = require('../../structures/Command');
const { createCanvas } = require('canvas');

module.exports = class ColorCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'color',
			aliases: ['colour'],
			group: 'edit-image',
			memberName: 'color',
			description: 'Sends an image of the color you choose.',
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'color',
					prompt: 'What color do you want to view? This can be #colorcode or a name.',
					type: 'string',
					parse: color => color.toLowerCase()
				}
			]
		});
	}

	run(msg, { color }) {
		const canvas = createCanvas(250, 250);
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 250, 250);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'color.png' }] });
	}
};

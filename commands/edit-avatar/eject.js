const Command = require('../../framework/Command');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { MersenneTwister19937, bool } = require('random-js');
const request = require('node-superfetch');
const path = require('path');
const { streamToArray } = require('../../util/Util');
const frameCount = 52;

module.exports = class EjectCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eject',
			group: 'edit-avatar',
			memberName: 'eject',
			description: 'Ejects a user.',
			throttling: {
				usages: 2,
				duration: 30
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Wisq',
					url: 'https://www.youtube.com/channel/UCrOS0iXaZgW45AdbEznGXLA',
					reason: 'Images',
					reasonURL: 'https://www.youtube.com/watch?v=yx4Hp8TBVtQ'
				},
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Noto Font',
					reasonURL: 'https://www.google.com/get/noto/'
				},
				{
					name: 'InnerSloth',
					url: 'https://innersloth.com/index.php',
					reason: 'Original "Among Us" Game',
					reasonURL: 'https://innersloth.com/gameAmongUs.php'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to edit the avatar of?',
					type: 'user',
					default: msg => msg.author
				},
				{
					key: 'imposter',
					prompt: 'Is the user an imposter?',
					type: 'boolean',
					default: ''
				}
			]
		});
	}

	async run(msg, { user, imposter }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 512 });
		try {
			const { body } = await request.get(avatarURL);
			const avatar = await loadImage(body);
			if (imposter === '') {
				const random = MersenneTwister19937.seed(user.id);
				imposter = bool()(random);
			}
			const text = `${user.username} was${imposter ? ' ' : ' not '}An Imposter.`;
			const encoder = new GIFEncoder(320, 180);
			const canvas = createCanvas(320, 180);
			const ctx = canvas.getContext('2d');
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = 'white';
			ctx.font = this.client.fonts.get('Noto-Regular.ttf').toCanvasString(18);
			const stream = encoder.createReadStream();
			encoder.start();
			encoder.setRepeat(0);
			encoder.setDelay(100);
			encoder.setQuality(200);
			for (let i = 0; i < frameCount; i++) {
				const frameID = `frame_${i.toString().padStart(2, '0')}.gif`;
				const frame = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'eject', frameID));
				ctx.drawImage(frame, 0, 0);
				if (i <= 17) {
					const x = ((320 / 15) * i) - 50;
					const y = (frame.height / 2) - 25;
					const rotation = (360 / 15) * i;
					const angle = rotation * (Math.PI / 180);
					const originX = x + 25;
					const originY = y + 25;
					ctx.translate(originX, originY);
					ctx.rotate(-angle);
					ctx.translate(-originX, -originY);
					ctx.drawImage(avatar, x, y, 50, 50);
					ctx.translate(originX, originY);
					ctx.rotate(angle);
					ctx.translate(-originX, -originY);
				}
				if (i > 17) {
					if (i <= 27) {
						const letters = Math.ceil(((text.length / 10) * (i - 17)) + 1);
						const toDraw = text.slice(0, letters + 1);
						ctx.fillText(toDraw, frame.width / 2, frame.height / 2, 300);
					} else {
						ctx.fillText(text, frame.width / 2, frame.height / 2, 300);
					}
				}
				encoder.addFrame(ctx);
			}
			encoder.finish();
			const buffer = await streamToArray(stream);
			return msg.say({ files: [{ attachment: Buffer.concat(buffer), name: 'eject.gif' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

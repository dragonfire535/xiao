const Command = require('../../framework/Command');
const { GuildEmoji } = require('discord.js');
const request = require('node-superfetch');
const { createCanvas, loadImage } = require('canvas');
const twemoji = require('twemoji-parser');

module.exports = class EmojiFaceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-face',
			aliases: ['emoji-f', 'e-face'],
			group: 'edit-face',
			memberName: 'emoji-face',
			description: 'Draws an emoji onto the faces in an image.',
			throttling: {
				usages: 1,
				duration: 60
			},
			args: [
				{
					key: 'emoji',
					prompt: 'What emoji do you want to draw?',
					type: 'default-emoji|custom-emoji'
				},
				{
					key: 'image',
					prompt: 'What face would you like to scan?',
					type: 'image-or-avatar'
				}
			]
		});
	}

	async run(msg, { emoji, image }) {
		let emojiURL;
		if (emoji instanceof GuildEmoji) {
			emojiURL = emoji.url;
		} else {
			const parsed = twemoji.parse(emoji);
			if (!parsed.length || !parsed[0].url) return msg.reply('This emoji is not yet supported.');
			emojiURL = parsed[0].url;
		}
		const emojiData = await request.get(emojiURL);
		const emojiImg = await loadImage(emojiData.body);
		if (emojiURL.endsWith('svg')) {
			emojiImg.width *= 4;
			emojiImg.height *= 4;
		}
		const imgData = await request.get(image);
		const faces = await this.client.detectFaces(imgData.body);
		if (!faces) return msg.reply('There are no faces in this image.');
		if (faces === 'size') return msg.reply('This image is too large.');
		const base = await loadImage(imgData.body);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		for (const face of faces) {
			const ratio = face.box.width / danny.width;
			const height = danny.height * ratio;
			ctx.drawImage(
				emojiImg,
				face.box.xMin - (face.box.width * 0.2),
				face.box.yMin - (height / 2.5),
				face.box.width * 1.4,
				height * 1.4
			);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'emoji-face.png' }] });
	}
};

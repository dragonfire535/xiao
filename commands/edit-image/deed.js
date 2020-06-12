const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const request = require('node-superfetch');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'oldengl.ttf'), { family: 'Old English Text MT' });

module.exports = class deedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deed',
			aliases: ['deed'],
			group: 'edit-image',
			memberName: 'deed',
			description: 'Sends a deed of excellence with the name and reason of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Creative deeds',
					url: 'https://www.creativedeeds.com/',
					reason: 'Image',
					reasonURL: 'https://www.creativedeeds.com/award-deed-templates/'
				},
				{
					name: 'Cheng Xiao',
					url: 'https://www.instagram.com/chengxiao_0715/',
					reason: 'Signature'
				},
				{
					name: 'Monotype',
					url: 'https://www.monotype.com/',
					reason: 'Old English Text MT Font',
					reasonURL: 'https://catalog.monotype.com/family/monotype/monotype-old-english-text'
				}
			],
			args: [
				{
					key: 'property',
					prompt: 'What/Who is it you want to own?',
					type: 'string',
					max: 30
				},
				{
					key: 'name',
					prompt: 'whats the Signature',
					type: 'string',
					max: 30
				}
			]
		});
	}

	async run(msg, { property, name }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'deed.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '40px Old English Text MT';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';
		ctx.fillText(property, 490, 400);
		ctx.fillText(name, 510, 750);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'deed.png' }] });
	}
};


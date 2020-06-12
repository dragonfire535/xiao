const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const { firstUpperCase, list } = require('../../util/Util');
const { wrapText } = require('../../util/Canvas');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'DeterminationMono.ttf'), { family: 'Undertale' });
const characters = {
	Time: ['time'],
	fisk: ['fisk'],
	papyrus: ['papyrus'],
	asgore: ['asgore'],
	alphys: ['alphys'],
	sans: ['sans'],
	flowey: ['flowey'],
	toriel: ['toriel'],
	undyne: ['undyne'],
	chara: ['chara'],
	ghost: ['ghost'],
	laugh: ['laugh'],
	knuckles: ['knuckles'],
	tidepod: ['tidepod'],
	threat: ['threat'],
};

module.exports = class UnderTaleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'undertale',
			aliases: [
				'ut',
				'ut-textbox',
				'ut-txb',
				'undertale-textbox',
				'undertale',
				'undertale-quote'
			],
			group: 'edit-image',
			memberName: 'undertale',
			description: 'Sends a text box from undertale with the quote and character of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Capcom',
					url: 'http://www.capcom.com/us/',
					reason: 'Images, Original "Ace Attorney" Game',
					reasonURL: 'http://www.undertale.com/'
				},
				{
					name: 'Enkidulga',
					url: 'https://www.dafont.com/profile.php?user=736583',
					reason: 'Ace Attorney Font',
					reasonURL: 'https://www.dafont.com/undertale.font'
				}
			],
			args: [
				{
					key: 'character',
					prompt: `What character do you want to use? Either ${list(Object.keys(characters), 'or')}.`,
					type: 'string',
					oneOf: Object.values(characters).reduce((a, b) => a.concat(b)),
					parse: character => {
						for (const [id, arr] of Object.entries(characters)) {
							if (!arr.includes(character.toLowerCase())) continue;
							return id;
						}
						return character.toLowerCase();
					}
				},
				{
					key: 'quote',
					prompt: 'What should the character say?',
					type: 'string',
					max: 250
				}
			]
		});
	}

	async run(msg, { character, quote }) {
		const base = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'undertale', `${character}.png`)
		);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '25px Undertale';
		ctx.fillStyle = 'white';
		ctx.textBaseline = 'top';
		ctx.fillText(firstUpperCase(character), 6, 176);
		let text = await wrapText(ctx, quote, 242);
		text = text.length > 5 ? `${text.slice(0, 5).join('\n')}...` : text.join('\n');
		ctx.fillText(text, 166, 24);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: `undertale-${character}.png` }] });
	}
};

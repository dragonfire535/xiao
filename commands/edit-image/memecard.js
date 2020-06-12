const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const { list } = require('../../util/Util');
const path = require('path');
const cards = {
	angry: ['angry'],
	antisalt: ['anti-salt', 'antisalt'],
	ban: ['ban'],
	brick: ['brick'],
	bruh: ['bruh'],
	datboi: ['datboi'],
	doge: ['doge'],
	fail: ['fail'],
	fangirl: ['yoai-fan', 'fangirl', 'yoai-fangirl'],
	game: ['game'],
	idk: ['idk'],
	killedit: ['killed-it', 'killedit'],
	lazar: ['lazer', 'lazar'],
	lurk: ['lurk'],
	nou: ['nou', 'no-u', 'no-you'],
	nudes: ['nudes'],
	peter_griffin: ['peter_griffin', 'peter-griffin', 'peter'],
	pewdiepie: ['pewdiepie'],
	revive: ['revive'],
	rickroll: ['rickroll', 'rick-roll'],
	shai_labeouf: ['shai_labeouf', 'shai-labeouf', 'justdoit', 'just-do-it'],
	stop: ['stop'],
	strip: ['strip'],
	tea: ['tea'],
	thot: ['thot'],
	vaper: ['vape', 'vaper'],
	warning: ['warning', 'warn'],
	wow: ['wow'],
	wtf_dude: ['wtf', 'wtf-dude', 'wtf-bro']
};

module.exports = class MemeCardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'memecard',
			aliases: [
				'memecard',
				'meme-card',
				'play-card',
				'play-meme-card',
				'meme-deck',
				'memedeck'
			],
			group: 'edit-image',
			memberName: 'memecard',
			description: 'Sends a meme yu-gi-oh card of ur choice',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: '✰𝐵𝑟𝑜𝑘𝑒𝑛 𝐵𝑙𝑎𝑐𝑘 𝑠𝑡𝑎𝑟✰#6666',
					reason: 'spicy memes',
				}
			],
			args: [
				{
					key: 'card',
					prompt: `What card do you want to play? Either ${list(Object.keys(cards), 'or')}.`,
					type: 'string',
					oneOf: Object.values(cards).reduce((a, b) => a.concat(b)),
					parse: card => {
						for (const [id, arr] of Object.entries(cards)) {
							if (!arr.includes(card.toLowerCase())) continue;
							return id;
						}
						return card.toLowerCase();
					}
				}
			]
		});
	}

	async run(msg, { card }) {
		const base = await loadImage(
			path.join(__dirname, '..', '..', 'assets', 'images', 'memedeck', `${card}.png`)
		);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: `memedeck-${card}.png` }] });
	}
};

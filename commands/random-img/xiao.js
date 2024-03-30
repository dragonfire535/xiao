const Command = require('../../framework/Command');
const sagiri = require('sagiri');
const { SAUCENAO_KEY } = process.env;
const sagiriClient = sagiri(SAUCENAO_KEY);
const fs = require('fs');
const path = require('path');
const images = fs.readdirSync(path.join(__dirname, '..', '..', 'assets', 'images', 'xiao'));
const sourceRegex = /([A-Z ]+)-?([0-9A-Z]+)?(-[0-9]+)?(\.[A-Z])?/i;

module.exports = class XiaoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'xiao',
			aliases: ['xiao-pai', 'iao'],
			group: 'random-img',
			memberName: 'xiao',
			description: 'Responds with a random image of Xiao Pai.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Marvelous',
					url: 'http://www.marv.jp/',
					reasonURL: 'http://www.runefactory4.com/index1.html',
					reason: 'Images, Original "Rune Factory 4" Game'
				},
				{
					name: 'SauceNAO',
					url: 'https://saucenao.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const image = images[Math.floor(Math.random() * images.length)];
		return msg.say(await this.getSource(image), {
			files: [path.join(__dirname, '..', '..', 'assets', 'images', 'xiao', image)]
		});
	}

	async getSource(img) {
		const source = img.match(sourceRegex);
		const site = source[1];
		if (site === 'official') return 'Official Art';
		let result;
		if (site === 'unknown') result = 'Artist Unknown';
		else if (site === 'deviant') result = `Art by <https://www.deviantart.com/${source[2]}>`;
		else if (site === 'pixiv') result = `Art Source: <https://www.pixiv.net/en/artworks/${source[2]}>`;
		else result = `Art by ${site}`;
		try {
			const data = await this.sauceNao(img);
			if (data && data[0].similarity > 90) {
				result = '';
				const sauce = data[0];
				if (sauce.authorName && sauce.authorUrl) result += `Art by [${sauce.authorName}](<${sauce.authorUrl}>) | `;
				if (sauce.authorName && !sauce.authorUrl) result += `Art by ${sauce.authorName} | `;
				result += `Art Source: <${sauce.url}>`;
			}
		} catch {
			return result;
		}
		return result;
	}

	sauceNao(img) {
		return sagiriClient(path.join(__dirname, '..', '..', 'assets', 'images', 'xiao', img));
	}
};

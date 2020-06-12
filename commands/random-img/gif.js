const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { GIF_ALBUM_ID } = process.env;

module.exports = class GifCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'gif',
			aliases: ['gif'],
			group: 'random-img',
			memberName: 'gif',
			description: 'Responds with a random gif.',
			clientPermissions: ['ATTACH_FILES'],
			albumID: GIF_ALBUM_ID,
			credit: [
				{
					name: 'overtime2005',
					url: 'https://github.com/Overtime2005',
					reason: 'concept/code'
				}
			]
		});
	}

	generateText() {
		return '';
	}
};

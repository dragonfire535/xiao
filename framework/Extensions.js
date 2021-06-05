const { Structures } = require('discord.js');

module.exports = Structures.extend('Message', Message => {
	class CommandMessage extends Message {
		say(content, options) {
			return this.channel.send(content, options);
		}

		embed(embed, options) {
			return this.channel.send('', { embed, ...options });
		}

		code(lang, content, options) {
			return this.channel.send(content, { code: lang, ...options });
		}
	}
	return CommandMessage;
});
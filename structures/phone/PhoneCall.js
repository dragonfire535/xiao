const { shorten, verify } = require('../../util/Util');
const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|app\.com\/invite|\.me)\/([^ ]+)\/?/gi;

module.exports = class PhoneCall {
	constructor(client, origin, recipient) {
		Object.defineProperty(this, 'client', { value: client });

		this.id = `${origin.id}:${recipient.id}`;
		this.origin = origin;
		this.recipient = recipient;
		this.active = false;
		this.timeout = null;
	}

	async start() {
		await this.origin.send(`☎️ Calling **${this.recipient.guild.name}**...`);
		await this.recipient.send(`☎️ Incoming call from **${this.origin.guild.name}**. Pick up?`);
		const validation = await verify(this.recipient, null);
		if (!validation) {
			await this.hangup('declined', validation);
			return this;
		}
		await this.accept();
		return this;
	}

	async accept() {
		this.active = true;
		this.setTimeout();
		await this.origin.send(`☎️ **${this.recipient.guild.name}** picked up! Type \`hang up\` to hang up.`);
		await this.recipient.send(`☎️ Accepted call from **${this.origin.guild.name}**. Type \`hang up\` to hang up.`);
		return this;
	}

	async hangup(nonQuitter, validation) {
		this.active = false;
		clearTimeout(this.timeout);
		this.client.phone.delete(this.id);
		if (nonQuitter === 'time') {
			await this.origin.send('☎️ Call ended due to inactivity.');
			await this.recipient.send('☎️ Call ended due to inactivity.');
		} else if (nonQuitter === 'declined') {
			const originMsg = validation === 0 ? 'didn\'t answer...' : 'declined the call...';
			const recipientMsg = validation === 0 ? 'Sent to voicemail (not really).' : 'Declined the call.';
			await this.origin.send(`☎️ **${this.recipient.guild.name}** ${originMsg}`);
			await this.recipient.send(`☎️ ${recipientMsg}`);
		} else {
			const quitter = nonQuitter.id === this.origin.id ? this.recipient : this.origin;
			await nonQuitter.send(`☎️ **${quitter.guild.name}** hung up.`);
			await quitter.send('☎️ Hung up.');
		}
		return this;
	}

	send(channel, msg, hasText, hasImage, hasEmbed) {
		if (msg.content && msg.content.toLowerCase() === 'hang up') return this.hangup(channel);
		this.setTimeout();
		const attachments = hasImage ? msg.attachments.map(a => a.url).join('\n') : null;
		if (!hasText && hasImage) return channel.send(`☎️ **${msg.author.tag}:**\n${attachments}`);
		if (!hasText && hasEmbed) return channel.send(`☎️ **${msg.author.tag}** sent an embed.`);
		let content = msg.content.replace(inviteRegex, '[redacted invite]');
		content = content.length > 1000 ? `${shorten(content, 1000)} (Message too long)` : content;
		return channel.send(`☎️ **${msg.author.tag}:** ${content}\n${attachments || ''}`.trim());
	}

	setTimeout() {
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.hangup('time'), 60000);
		return this.timeout;
	}
};

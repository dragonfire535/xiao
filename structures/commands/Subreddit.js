const request = require('node-superfetch');
const Command = require('../Command');

module.exports = class SubredditCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.subreddit = info.subreddit;
		this.postType = info.postType ? Array.isArray(info.postType) ? info.postType : [info.postType] : null;
		this.getIcon = info.getIcon || false;
		this.credit.push({
			name: 'Reddit',
			url: 'https://www.reddit.com/',
			reason: 'API',
			reasonURL: 'https://www.reddit.com/dev/api/'
		});
	}

	async run(msg, { subreddit }, fromPattern) {
		if (fromPattern) subreddit = msg.patternMatches[1];
		if (!subreddit) subreddit = typeof this.subreddit === 'function' ? this.subreddit() : this.subreddit;
		try {
			const post = await this.random(subreddit, msg.channel.nsfw);
			if (!post) return msg.reply('Could not find any results.');
			return msg.say(this.generateText(post.post, post.origin, post.icon));
		} catch (err) {
			if (err.status === 403) return msg.say('This subreddit is private.');
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	generateText() {
		throw new Error('The generateText method is required.');
	}

	async random(subreddit, nsfw) {
		let icon = null;
		const { body } = await request
			.get(`https://www.reddit.com/r/${subreddit}/hot.json`)
			.query({ limit: 100 });
		if (!body.data.children.length) return null;
		const posts = body.data.children.filter(post => {
			if (!post.data) return false;
			if (!nsfw && post.data.over_18) return false;
			return (this.postType ? this.postType.includes(post.data.post_hint) : true) && post.data.url && post.data.title;
		});
		if (!posts.length) return null;
		if (this.getIcon) icon = await this.fetchIcon(subreddit);
		return {
			origin: subreddit,
			post: posts[Math.floor(Math.random() * posts.length)].data,
			icon
		};
	}

	async fetchIcon(subreddit) {
		const { body } = await request.get(`https://www.reddit.com/r/${subreddit}/about.json`);
		if (!body.data.icon_img && !body.data.community_icon) return 'https://i.imgur.com/DSBOK0P.png';
		return body.data.icon_img || body.data.community_icon;
	}
};

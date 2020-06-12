const SubredditCommand = require('../../structures/commands/Subreddit');
const { MessageEmbed } = require('discord.js');
const { list } = require('../../util/Util');
const subreddits = require('../../assets/json/leak');

module.exports = class leakCommand extends SubredditCommand {
	constructor(client) {
		super(client, {
			name: 'leak',
			group: 'random-img',
			memberName: 'leak',
			description: 'Responds with a random leak.',
			details: `**Subreddits:** ${subreddits.join(', ')}`,
			clientPermissions: ['ATTACH_FILES'],
			postType: 'image',
			getIcon: true,
			nsfw: true,
			args: [
				{
					key: 'subreddit',
					prompt: `What subreddit do you want to get leaks from? Either ${list(subreddits, 'or')}.`,
					type: 'string',
					oneOf: subreddits,
					default: () => subreddits[Math.floor(Math.random() * subreddits.length)],
					parse: subreddit => subreddit.toLowerCase()
				}
			]
		});
	}

	generateText(post, subreddit, icon) {
		return new MessageEmbed()
			.setColor(3066993)
			.setAuthor(`r/${subreddit}`, icon, `https://www.reddit.com/r/${subreddit}/`)
			.setTitle(post.title)
			.setImage(post.post_hint === 'image' ? post.url : null)
			.setURL(`https://www.reddit.com${post.permalink}`)
			.addFields(
				{ name: 'Sources', value: 'Please join so we can get more nudes' },
				{ name: 'Ella Nude\'s', value: '[Join](https://discord.gg/du2uQbr)', inline: true },
				{ name: 'Maya Nude\'s', value: '[Join](https://discord.gg/uSHMYkF)', inline: true }
			)
			.setFooter(`Provided by datgillyweed#6969`);
	}
};

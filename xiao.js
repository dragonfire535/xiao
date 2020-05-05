require('dotenv').config();
const { XIAO_TOKEN, OWNERS, XIAO_PREFIX, INVITE } = process.env;
const path = require('path');
const Client = require('./structures/Client');
const Discord = require('discord.js')

const client = new Client({
	commandPrefix: XIAO_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableMentions: 'everyone',
	disabledEvents: ['TYPING_START']
});
var helparray = {}
const leaveMsgs = require('./assets/json/leave-messages');

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
		['info', 'Discord Information'],
		['random-res', 'Random Response'],
		['random-img', 'Random Image'],
		['random-seed', 'seeded Randomizers'],
		['single', 'single Response'],
		['auto', 'Automatic Response'],
		['events', 'Events'],
		['search', 'search'],
		['analyze', 'Analyzers'],
		['games-sp', 'single-Player Games'],
		['games-mp', 'Multi-Player Games'],
		['edit-image', 'Image Manipulation'],
		['edit-avatar', 'Avatar Manipulation'],
		['edit-meme', 'Meme Generators'],
		['edit-text', 'Text Manipulation'],
		['edit-number', 'Number Manipulation'],
		['other', 'Other'],
		['roleplay', 'Roleplay'],
		['readme', 'README Generators']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false,
		unknownCommand: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	client.logger.info(`${client.user.tag} | ID: ${client.user.id} | Users: ${client.users.cache.size} | Servers: ${client.guilds.cache.size}/75 | Commands ${client.registry.commands.size}`);
	setTimeout(stat1, 1000)
	function stat1(){
		client.user.setActivity(`Hentai`, {type: 'WATCHING'});
	setTimeout(stat2, 15000)
	}   
	function stat2(){
		client.user.setActivity(`t.help`, {type: 'PLAYING'});
		setTimeout(stat3, 15000)
	}
	function stat3(){ 
		client.user.setActivity(`With Eterna and BMO`, {type: 'PLAYING'});
		setTimeout(stat4, 20000)
	}
	function stat4(){
		client.user.setActivity(`${client.users.cache.size} Users complain about other bots.`, {type: 'LISTENING'});
		setTimeout(stat5, 15000)
	}
	function stat5(){
		client.user.setActivity(`${client.guilds.cache.size} Servers be Idiots`, {type: 'WATCHING'});
		setTimeout(stat6, 15000)
	}
	function stat6(){
		client.user.setActivity(`with my ${client.registry.commands.size} commands`, {type: 'PLAYING'});
		setTimeout(stat7, 15000)
	}
	function stat7(){
		client.user.setActivity(`Meme-Hunting`, {type: 'PLAYING'});
		setTimeout(stat8, 15000)
	}
	function stat8(){
		client.user.setActivity(`LQBTQ (G = Gamer)`, {type: 'PLAYING'});
		setTimeout(stat9, 15000)
	}
	function stat9(){
		client.user.setActivity(`Simp Mode`, {type: 'PLAYING'});
		setTimeout(stat1, 15000)
	}
	if (client.memePoster.id && client.memePoster.token) {
		client.setInterval(() => client.memePoster.post(), client.memePoster.time);
	}
});

client.on('message', async msg => {
	if (!msg.channel.topic || !msg.channel.topic.includes('<Time:phone>')) return;
	if (msg.author.bot || !msg.content) return;
	const origin = client.phone.find(call => call.origin.id === msg.channel.id);
	const recipient = client.phone.find(call => call.recipient.id === msg.channel.id);
	if (!origin && !recipient) return;
	const call = origin || recipient;
	if (!call.active) return;
	try {
		await call.send(origin ? call.recipient : call.origin, msg);
	} catch {
		return; // eslint-disable-line no-useless-return
	}
});

client.on('guildMemberRemove', async member => {
	if (member.id === client.user.id) return null;
	const channel = member.guild.systemChannel;
	if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;
	if (channel.topic && channel.topic.includes('<Time:disable-leave>')) return null;
	try {
		const leaveMsg = leaveMsgs[Math.floor(Math.random() * leaveMsgs.length)];
		await channel.send(leaveMsg.replace(/{{user}}/gi, `**${member.user.tag}**`));
		return null;
	} catch {
		return null;
	}
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('messageReactionAdd', async (messageReaction, user, id) => {

	var helpPageM = helparray[messageReaction.message.id]
    if(!helpPageM) return
if(messageReaction.message.author.id === client.user.id){
    if(user === client.user) return
    var member = messageReaction.message.guild.members.cache.find(member => member.id === user.id)
    if(member.id === helpPageM.id){
    if(member.id === client.user.id)return
    var helpReaction = messageReaction.emoji.name
    switch(helpReaction)
    {
        case('🏠'):
        {
            messageReaction.users.remove(user)
        var config2 = {
            id: helpPageM.id,
            helpPage: 1
        }
        helpPageM = config2
        break;
        }
        case('◀'):
        {
            messageReaction.users.remove(user)
            var config2 = {
                id: helpPageM.id,
                helpPage: helpPageM.helpPage - 1
            }
            helpPageM = config2
            break;
        }
        case('🆗'):
        {
            messageReaction.message.delete().catch(() => {
                return
            })
            break;
        }
        case('▶'):
        {
            messageReaction.users.remove(user)
            var config2 = {
                id: helpPageM.id,
                helpPage: helpPageM.helpPage + 1
            }
            helpPageM = config2
            break;
        }
    }
    helparray[messageReaction.message.id] = helpPageM
    setTimeout(display, 250)
    function display(){
    if(helpPageM.helpPage < 1)
    {
        var config2 = {
            id: helpPageM.id,
            helpPage: 20
        }
        helpPageM = config2
    }
    if(helpPageM.helpPage > 20)
    {
        var config2 = {
            id: helpPageM.id,
            helpPage: 1
        }
        helpPageM = config2
    }
    helparray[messageReaction.message.id] = helpPageM
    switch(helpPageM.helpPage)
    {
        case(1):
        {
			var edited = new Discord.MessageEmbed()

			.setTitle(`Help Page 1 of 20 (Tutorial) (Prefix is t.)`)
			.setColor(0xFF0000)
			.addField('Use ▶', `to move to the next menu`)
			.addField('Use ◀', 'to go back in the menus')
			.addField('Use 🏠', 'to go back to this menu')
			.addField(`Use 🆗`, `to close this`)
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
			.setFooter("Time, Created by Overtime2005#7858")
            messageReaction.message.edit(edited).catch(()=>{return})
            break;
		}
		case(2):
        {
			var edited = new Discord.MessageEmbed()
			.setColor(0xFF0000) 
			.setTitle('Help Page 2 of 20 (Utility) (Prefix is t.)') 
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
			.addField('eval', 'Executes JavaScript code. (Owner-Only)')
			.addField('donate', 'Responds with the bots donation links.')
			.addField('info', 'Responds with detailed bot information.')
			.addField('invite', 'Responds with the bots invite links.')
			.addField('ip', 'Responds with the IP address the bots server is running on. (Owner-Only)')
			.addField('options', 'Responds with a list of server options.')
			.addField('ping', 'Checks the bots ping to the Discord server.')
			.addField('report', 'Reports something to the bot owner(s).')
			.addField('shutdown', 'shuts down the bot. (Owner-Only)')
			.setFooter("Time, Created by Overtime2005#7858")
                messageReaction.message.edit(edited).catch(()=>{return})
            break;
        }
        case(3):
        {
            var edited = new Discord.MessageEmbed()
			.setColor(0xFF0000)
			.setTitle('Help Page 3 of 20 (Discord Information) (Prefix is t.)')  
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
			.addField('avatar', 'Responds with a users avatar.')
			.addField('channel', 'Responds with detailed information on a channel.')
			.addField('emoji-image', 'Responds with an emojis full-scale image.')
			.addField('emoji-list', 'Responds with a list of the servers custom emoji.')
			.addField('emoji', 'Responds with detailed information on an emoji.')
			.addField('first-message', 'Responds with the first message ever sent to a channel.')
			.addField('id', 'Responds with a users ID.')
			.addField('message-source', 'Responds with a codeblock containing a messages contents.')
			.addField('message', 'Responds with detailed information on a message.')
			.addField('role', 'Responds with detailed information on a role.')
			.addField('server', 'Responds with detailed information on the server.')
			.addField('user', 'Responds with detailed information on a user.')
			.setFooter("Time, Created by Overtime2005#7858")
            messageReaction.message.edit(edited).catch(()=>{return})
            break;
        }
        case(4):
        {
            var edited = new Discord.MessageEmbed()
			.setColor(0xFF0000)
			.setTitle('Help Page 4 of 20 (Random Response) (Prefix is t.)')  
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")	
			.addField('8-ball', 'Asks your question to the Magic 8 Ball.')
			.addField('advice', 'Responds with a random bit of advice.')
			.addField('axis-cult', 'Responds with a teaching of the Axis Cult.')
			.addField('cat-fact', 'Responds with a random cat fact.')
			.addField('charlie-charlie', 'Asks your question to Charlie.')
			.addField('choose', 'Chooses between options you provide.')
			.addField('chuck-norris', 'Responds with a random Chuck Norris joke.')
			.addField('coin', 'Flips a coin.')
			.addField('compliment', 'Compliments a user.')
			.addField('dog-fact', 'Responds with a random dog fact.')
			.addField('draw-cards', 'Draws a random hand of playing cards.')
			.addField('fact-core', 'Responds with a random Fact Core quote.')
			.addField('fact', 'Responds with a random fact.')
			.addField('fml', 'Responds with a FML quote. (NSFW)')
			.addField('fortune', 'Responds with a random fortune.')
			.addField('github-zen', 'Responds with a random GitHub design philosophy.')
			.addField('joke', 'Responds with a random joke.')
			.addField('kiss-marry-kill', 'Determines who to kiss, who to marry, and who to kill.')
			.addField('light-novel-title', 'Responds with a randomly generated Light Novel title.')
			.addField('magic-conch', 'Asks your question to the Magic Conch.')
			.addField('name', 'Responds with a random name, with the gender of your choice.')
			.addField('number-fact', 'Responds with a random fact about a specific number.')
			.addField('offspring', 'Determines if your new child will be a boy or a girl.')
			.addField('opinion', 'Determines the opinion on something.')
			.addField('oracle-turret', 'Responds with a random Oracle Turret quote.')
			.addField('pun', 'Responds with a random pun.')
			.addField('quantum-coin', 'Flips a coin that lands on some form of nothing.')
			.addField('quote', 'Responds with a random quote.')
			.addField('random-user', 'Randomly chooses a member of the server.')
			.addField('rate', 'Rates something.')
			.addField('roast', 'Roasts a user.')
			.addField('roll', 'Rolls a dice with a minimummaximum value of your choice.')
			.addField('security-key', 'Responds with a random security key.')
			.addField('shower-thought', 'Responds with a random shower thought, directly from rShowerthoughts.')
			.addField('smw-level', 'Responds with a random Super Mario World level name.')
			.addField('subreddit', 'Responds with a random post from a subreddit.')
			.addField('suggest-command', 'Suggests a random command for you to try.')
			.addField('superpower', 'Responds with a random superpower.')
			.addField('the-onion', 'Responds with a random "The Onion" article.')
			.addField('this-for-that', 'So, basically, its like a bot command for this dumb meme.')
			.addField('time-fact', 'Responds with a random fact about time.')
			.addField('waifu', 'Responds with a randomly generated waifu and backstory.')
			.addField('would-you-rather', 'Responds with a random "Would you rather ...?" question.')
			.setFooter("Time, Created by Overtime2005#7858")
            messageReaction.message.edit(edited).catch(()=>{return})
            break;
        }
        case(5):
        {
            var edited = new Discord.MessageEmbed()
			.setColor(0xFF0000)
			.setTitle('Help Page 5 of 20 (Random Image) (Prefix is t.)')  
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
			.addField('bird', 'Responds with a random image of a bird.')
			.addField('cat', 'Responds with a random cat image.')
			.addField('dog', 'Responds with a random dog image.')
			.addField('duck', 'Responds with a random duck image.')
			.addField('fidget', 'Responds with a random image of Fidget.')
			.addField('fox', 'Responds with a random fox image.')
			.addField('karen', 'Responds with a random image of Karen.')
			.addField('lando', 'Responds with a random image of Lando Calrissian.')
			.addField('light-novel-cover', 'Responds with a randomly generated Light Novel cover. (NSFW)')
			.addField('meme', 'Responds with a random meme.')
			.addField('potato', 'Responds with a random potato image.')
			.addField('shiba', 'Responds with a random image of a Shiba Inu.')
			.addField('xiao', 'Responds with a random image of Xiao Pai.')
			.setFooter("Time, Created by Overtime2005#7858")
            messageReaction.message.edit(edited).catch(()=>{return})
            break;
        }
        case(6):
        {
        var edited = new Discord.MessageEmbed()
        .setColor(0xFF0000)
			.setTitle('Help Page 6 of 20 (Seeded Randomizers) (Prefix is t.)')  
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")	
			.addField('butt', 'Determines a users butt quality.')
			.addField('coolness', 'Determines a users coolness.')
			.addField('dick', 'Determines your dick size. (NSFW)')
			.addField('friendship', 'Determines how good friends two users are.')
			.addField('guess-looks', 'Guesses what a user looks like.')
			.addField('iq', 'Determines a users IQ.')
			.addField('psycho-pass', 'Determines your Crime Coefficient.')
			.addField('ship', 'Ships two users together.')
			.addField('smash-or-pass', 'Determines if a user is worthy of a smash or a pass.')
			.setFooter("Time, Created by Overtime2005#7858")
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(7):
        {
        var edited = new Discord.MessageEmbed()
	.setColor(0xFF0000)
		.setTitle('Help Page 7 of 20 (single Response) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('dark-light', 'Determines whether you use dark or light theme.')
		.addField('eat-pant', 'Eat pant.')
		.addField('eggs-get-laid', 'Sends the ultimate roast.')
		.addField('fly', 'Sends a fake fly that looks surprisngly real.')
		.addField('give-flower', 'Gives Time a flower.')
		.addField('hi', 'Hello.')
		.addField('idiot', 'Responds with the Wikipedia page of an idiot.')
		.addField('isnt-joke', 'Isnt joke...')
		.addField('its-joke', 'Its joke!')
		.addField('just-do-it', 'Sends a link to the "Just Do It!" motivational speech.')
		.addField('lenny', 'Responds with the lenny face.')
		.addField('spam', 'Responds with a picture of Spam.')
		.addField('tableflip', 'Flips a table... With animation!')
		.addField('wynaut', 'Why not? Wynaut?')
		.addField('yoff', 'Posts a picture that truly defines modern art.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(8):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 8 of 20 (Automatic Response) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('can-you-not', 'Can YOU not?')
		.addField('kazuma-kazuma', 'Hai, Kazuma desu.')
		.addField('no-u', 'no u')
		.addField('suicide-hotline', 'Responds with the phone number for the Suicide Hotline.')
		.addField('unflip', 'Unflips a flipped table.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(9):
        {
        var edited = new Discord.MessageEmbed()
			.setColor(0xFF0000)
			.setTitle('Help Page 9 of 20 (Events) (Prefix is t. )')  
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
			.setFooter("Time, Created by Overtime2005#7858")
			.addField('anime-airing', 'Responds with a list of the anime that air today.')
			.addField('apod', 'Responds with todays Astronomy Picture of the Day.')
			.addField('calendar', 'Responds with todays holidays.')
			.addField('days-until', 'Responds with how many days there are until a certain date.')
			.addField('doomsday-clock', 'Responds with the current time of the Doomsday Clock.')
			.addField('friday-the-13th', 'Determines if today is Friday the 13th.')
			.addField('google-doodle', 'Responds with a Google Doodle, either the latest one or a random one from the past.')
			.addField('horoscope', 'Responds with todays horoscope for a specific Zodiac sign.')
			.addField('humble-bundle', 'Responds with the current Humble Bundle.')
			.addField('is-tuesday', 'Determines if today is Tuesday.')
			.addField('iss', 'Responds with where the Internation Space Station currently is.')
			.addField('neko-atsume-password', 'Responds with todays Neko Atsume password.')
			.addField('people-in-space', 'Responds with the people currently in space.')
			.addField('time', 'Responds with the current time in a particular location.')
			.addField('today-in-history', 'Responds with an event that occurred today in history.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(10):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 10 of 20 (search) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('anime', 'Searches AniList for your query, getting anime results.')
		.addField('book', 'Searches Google Books for a book.')
		.addField('bulbapedia', 'Searches Bulbapedia for your query.')
		.addField('character', 'Searches AniList for your query, getting character results.')
		.addField('company', 'Responds with the name and logo of a company.')
		.addField('country', 'Responds with information on a country.')
		.addField('danbooru', 'Responds with an image from Danbooru, with optional query. (NSFW)')
		.addField('define', 'Defines a word.')
		.addField('derpibooru', 'Responds with an image from Derpibooru.')
		.addField('deviantart', 'Responds with an image from a DeviantArt section, with optional query.')
		.addField('flickr', 'Searches Flickr for your query... Maybe. (NSFW)')
		.addField('frinkiac', 'Input a line from the Simpsons to get the episodeseason.')
		.addField('giphy', 'Searches Giphy for your query.')
		.addField('github', 'Responds with information on a GitHub repository.')
		.addField('google-autofill', 'Responds with a list of the Google Autofill results for a particular query.')
		.addField('google', 'Searches Google for your query.')
		.addField('gravatar', 'Responds with the Gravatar for an email.')
		.addField('http-cat', 'Responds with a cat for an HTTP status code.')
		.addField('http-dog', 'Responds with a dog for an HTTP status code.')
		.addField('http-duck', 'Responds with a duck for an HTTP status code.')
		.addField('imgur', 'Searches Imgur for your query.')
		.addField('itunes', 'Searches iTunes for your query.')
		.addField('jisho', 'Defines a word, but with Japanese.')
		.addField('kickstarter', 'Searches Kickstarter for your query.')
		.addField('know-your-meme', 'Searches Know Your Meme for your query.')
		.addField('league-of-legends', 'Responds with information on a League of Legends champion.')
		.addField('lyrics', 'Responds with lyrics to a song.')
		.addField('manga', 'Searches AniList for your query, getting manga results.')
		.addField('map', 'Responds with a map of a specific location.')
		.addField('mayo-clinic', 'Searches Mayo Clinic for your query.')
		.addField('mdn', 'Searches MDN for your query.')
		.addField('movie', 'Searches TMDB for your query, getting movie results.')
		.addField('nasa', 'Searches NASAs image archive for your query.')
		.addField('neopet', 'Responds with the image of a specific Neopet.')
		.addField('neopets-item', 'Responds with information on a specific Neopets item.')
		.addField('npm', 'Responds with information on an NPM package.')
		.addField('osu', 'Responds with information on an osu! user.')
		.addField('paladins', 'Responds with information on a Paladins player.')
		.addField('periodic-table', 'Finds an element on the periodic table.')
		.addField('pokedex', 'Searches the Pokédex for a Pokémon.')
		.addField('recipe', 'Searches for recipes based on your query.')
		.addField('reddit', 'Responds with information on a Reddit user.')
		.addField('right-stuf', 'Searches Right Stuf Anime for your query.')
		.addField('rotten-tomatoes', 'Searches Rotten Tomatoes for your query.')
		.addField('rule', 'Responds with a rule of the internet.')
		.addField('rule34', 'Responds with an image from rule34.xx, with optional query.')
		.addField('safebooru', 'Responds with an image from Safebooru, with optional query.')
		.addField('stack-overflow', 'Searches Stack Overflow for your query.')
		.addField('steam', 'Searches Steam for your query.')
		.addField('stocks', 'Responds with the current stocks for a company.')
		.addField('tenor', 'Searches Tenor for your query.')
		.addField('tumblr', 'Responds with information on a Tumblr blog.')
		.addField('tv-show', 'Searches TMDB for your query, getting TV show results.')
		.addField('twitter', 'Responds with information on a Twitter user.')
		.addField('urban', 'Defines a word, but with Urban Dictionary. (NSFW)')
		.addField('usps-tracking', 'Gets tracking information for a package shipped via USPS.')
		.addField('vocadb', 'Searches VocaDB for your query.')
		.addField('wattpad', 'Searches Wattpad for your query.')
		.addField('weather', 'Responds with weather information for a specific location.')
		.addField('wikia', 'Searches a specific Wikia wiki for your query.')
		.addField('wikihow', 'Searches Wikihow for your query.')
		.addField('wikipedia', 'Searches Wikipedia for your query.')
		.addField('xkcd', 'Responds with an XKCD comic, either todays, a random one, or a specific one.')
		.addField('youtube', 'Searches YouTube for your query.')
		.addField('yu-gi-oh', 'Responds with info on a Yu-Gi-Oh! card.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(11):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 11 of 20 (Analyzers) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('age', 'Responds with how old someone born in a certain year is.')
		.addField('birthstone', 'Responds with the Birthstone for a month.')
		.addField('character-count', 'Responds with the character count of text.')
		.addField('chinese-zodiac', 'Responds with the Chinese Zodiac Sign for the given year.')
		.addField('face', 'Determines the race, gender, and age of a face.')
		.addField('gender', 'Determines the gender of a name.')
		.addField('has-transparency', 'Determines if an image has transparency in it.')
		.addField('read-qr-code', 'Reads a QR Code.')
		.addField('scrabble-score', 'Responds with the scrabble score of a word.')
		.addField('severe-toxicity', 'Determines the toxicity of text, but less sensitive to milder language.')
		.addField('toxicity', 'Determines the toxicity of text.')
		.addField('what-anime', 'Determines what anime a screenshot is from.')
		.addField('zodiac-sign', 'Responds with the Zodiac Sign for the given month and day.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(12):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
			.setTitle('Help Page 12 of 20 (single-Player Games) (Prefix is t. )')  
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
			.setFooter("Time, Created by Overtime2005#7858")
			.addField('blackjack', 'Play a game of blackjack.')
			.addField('box-choosing', 'Do you believe that there are choices in life? Taken from Higurashi Chapter 4.')
			.addField('bubble-wrap', 'Pop some bubble wrap.')
			.addField('captcha', 'Try to guess what the captcha says.')
			.addField('chance', 'Attempt to win with a 1 in 1000 (or your choice) chance of winning.')
			.addField('doors', 'Open the right door, and you win the money! Make the wrong choice, and you get the fire!')
			.addField('fishy', 'Go fishing.')
			.addField('google-feud', 'Attempt to determine the top suggestions for a Google search.')
			.addField('hangman', 'Prevent a man from being hanged by guessing a word as fast as you can.')
			.addField('horse-race', 'Bet on the fastest horse in a 6-horse race.')
			.addField('hunger-games', 'Simulate a Hunger Games match with up to 24 tributes.')
			.addField('lottery', 'Attempt to win the lottery with 6 numbers.')
			.addField('mad-libs', 'Choose words that fill in the blanks to create a crazy story!')
			.addField('math-quiz', 'See how fast you can answer a math problem in a given time limit.')
			.addField('quiz', 'Answer a quiz question.')
			.addField('rock-paper-scissors', 'Play Rock-Paper-Scissors.')
			.addField('roulette', 'Play a game of roulette.')
			.addField('slots', 'Play a game of slots.')
			.addField('sorting-hat', 'Take a quiz to determine your Hogwarts house.')
			.addField('typing-test', 'See how fast you can type a sentence in a given time limit.')
			.addField('whos-that-pokemon', 'Guess who that Pokémon is.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(13):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 13 of 20 (Multi-Player Games) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('balloon-pop', 'Dont let yourself be the last one to pump the balloon before it pops!')
		.addField('battle', 'Engage in a turn-based battle against another user or the AI.')
		.addField('connect-four', 'Play a game of Connect Four with another user.')
		.addField('dots-and-boxes', 'Play a game of Dots and Boxes with another user.')
		.addField('emoji-emoji-revolution', 'Can you type arrow emoji faster than anyone else has ever typed them before?')
		.addField('guesspionage', 'Tests your knowledge of humans as you guess how people responded to poll questions.')
		.addField('gunfight', 'Engage in a western gunfight against another user. High noon.')
		.addField('lie-swatter', 'Players are given a fact and must quickly decide if its True or a Lie.')
		.addField('pick-a-number', 'Two players pick a number between 1 and 10. Whoevers closer wins.')
		.addField('quiz-duel', 'Answer a series of quiz questions against an opponent.')
		.addField('russian-roulette', 'Who will pull the trigger and die first?')
		.addField('tic-tac-toe', 'Play a game of tic-tac-toe with another user.')
		.addField('word-chain', 'Try to come up with words that start with the last letter of your opponents word.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
        }
		case(14):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 14 of 20 (Image Manipulation) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('ace-attorney', 'Sends a text box from Ace Attorney with the quote and character of your choice.')
		.addField('achievement', 'Sends a Minecraft achievement with the text of your choice.')
		.addField('adorable', 'Creates an adorable avatar based on the text you provide.')
		.addField('apple-engraving', 'Engraves the text of your choice onto an Apple product.')
		.addField('approved', 'Draws an "approved" stamp over an image or a users avatar.')
		.addField('axis-cult-sign-up', 'Sends an Axis Cult Sign-Up sheet for you. Join today!')
		.addField('brazzers', 'Draws an image with the Brazzers logo in the corner. (NSFW)')
		.addField('certificate', 'Sends a certificate of excellence with the name and reason of your choice.')
		.addField('circle', 'Draws an image or a users avatar as a circle.')
		.addField('color', 'Sends an image of the color you choose.')
		.addField('contrast', 'Draws an image or a users avatar but with contrast.')
		.addField('create-qr-code', 'Converts text to a QR Code.')
		.addField('dexter', 'Draws an image or a users avatar over the screen of Dexter from Pokémon.')
		.addField('distort', 'Draws an image or a users avatar but distorted.')
		.addField('fire', 'Draws a fiery border over an image or a users avatar.')
		.addField('frame', 'Draws a frame around an image or a users avatar.')
		.addField('ghost', 'Draws an image or a users avatar but with a ghost-like transparency.')
		.addField('glass-shatter', 'Draws an image or a users avatar with a glass shatter in front of it.')
		.addField('glitch', 'Draws an image or a users avatar but glitched.')
		.addField('greyscale', 'Draws an image or a users avatar in greyscale.')
		.addField('hollywood-star', 'Sends a Hollywood Walk of Fame star with the name of your choice.')
		.addField('ifunny', 'Draws an image with the iFunny logo.')
		.addField('invert', 'Draws an image or a users avatar but inverted.')
		.addField('jeopardy-question', 'Sends a Jeopardy Question with the text of your choice.')
		.addField('minecraft-skin', 'Sends the Minecraft skin for a user.')
		.addField('mirror', 'Draws an image or a users avatar but mirrored on the XY axis (or both).')
		.addField('needs-more-jpeg', 'Draws an image or a users avatar as a low quality JPEG.')
		.addField('newspaper', 'Creates a fake newspaper with the headline and body of your choice.')
		.addField('pixelize', 'Draws an image or a users avatar pixelized.')
		.addField('pokemon-fusion', 'Fuses two Generation I Pokémon together.')
		.addField('police-tape', 'Draws police tape over an image or a users avatar.')
		.addField('rainbow', 'Draws a rainbow over an image or a users avatar.')
		.addField('rejected', 'Draws a "rejected" stamp over an image or a users avatar.')
		.addField('robohash', 'Creates a robot based on the text you provide.')
		.addField('sepia', 'Draws an image or a users avatar in sepia.')
		.addField('shields-io-badge', 'Creates a badge from shields.io.')
		.addField('silhouette', 'Draws a silhouette of an image or a users avatar.')
		.addField('square', 'Draws an image or a users avatar as a square.')
		.addField('squish', 'Draws an image or a user/s avatar but squished across the X or Y axis.')
		.addField('tint', 'Draws an image or a user/s avatar but tinted a specific color.')
		.addField('zero-dialogue', 'Sends a text box from Megaman Zero with the quote of your choice.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(15):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 15 of 20 (Avatar Manipulation) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('avatar-fusion', 'Draws a a users avatar over a users avatar.')
		.addField('bob-ross', 'Draws a users avatar over Bob Ross canvas.')
		.addField('hat', 'Draws a hat over a users avatar.')
		.addField('he-lives-in-you', 'Draws a users avatar over Simba from The Lion Kings reflection.')
		.addField('hearts', 'Draws hearts around a users avatar.')
		.addField('i-have-the-power', 'Draws a users avatar over He-Mans face.')
		.addField('look-what-karen-have', 'Draws a users avatar over Karens piece of paper.')
		.addField('rip', 'Draws a users avatar over a gravestone.')
		.addField('sip', 'Draws a users avatar sipping tea.')
		.addField('status-button', 'Creates a Discord status button from c99.nl.')
		.addField('steam-card', 'Draws a users avatar on a Steam Trading Card.')
		.addField('steam-now-playing-classic', 'Draws a users avatar over a Steam "now playing" notification (old skin).')
		.addField('steam-now-playing', 'Draws a users avatar over a Steam "now playing" notification.')
		.addField('triggered', 'Draws a users avatar over the "Triggered" meme.')
		.addField('wanted', 'Draws a users avatar over a wanted poster.')
		.addField('yu-gi-oh-token', 'Draws a users avatar over a blank Yu-Gi-Oh! Token card.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
        }
		case(16):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 16 of 20 (Meme Generators) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('3000-years', 'Draws an image or a users avatar over Pokémons "Its been 3000 years" meme.')
		.addField('alert', 'Sends a "alert" with text of your choice.')
		.addField('bart-chalkboard', 'Sends a "Bart Chalkboard" meme with the text of your choice.')
		.addField('be-like-bill', 'Sends a "Be Like Bill" meme with the name of your choice.')
		.addField('beautiful', 'Draws a users avatar over Gravity Falls "Oh, this? This is beautiful." meme.')
		.addField('butterfly', 'Sends a "two butterflys" meme with the butterfly, man and text of your choice.')
		.addField('button', 'Sends a "two buttons" meme with the buttons of your choice.')
		.addField('catch', 'Catch users, revealing who is something.')
		.addField('challenger', 'Draws an image or a users avatar over Smash Bros "Challenger Approaching" screen.')
		.addField('cursed-sponge', 'Sends a cursed sponge duplicated however many times you want.')
		.addField('dear-liberals', 'Sends a "Dear Liberals" meme with words of your choice.')
		.addField('demotivational', 'Draws an image or a users avatar and the text you specify as a demotivational poster.')
		.addField('distracted-boyfriend', 'Draws three users avatars over the "Distracted Boyfriend" meme.')
		.addField('drakeposting', 'Draws two users avatars over the "Drakeposting" meme.')
		.addField('food-broke', 'Draws a users avatar over the "Food Broke" meme.')
		.addField('genie-rules', 'Sends a "There are 4 rules" meme with the text of your choice.')
		.addField('girl-worth-fighting-for', 'Draws an image or a users avatar as the object of Lings affection.')
		.addField('gru-plan', 'Sends a Grus Plan meme with steps of your choice.')
		.addField('illegal', 'Makes President Trump make your text illegal.')
		.addField('kyon-gun', 'Draws an image or a users avatar behind Kyon shooting a gun.')
		.addField('lisa-presentation', 'Sends a "Lisa Presentation" meme with the presentation of your choice.')
		.addField('look-at-this-photograph', 'Draws an image or a users avatar over Nickelbacks photograph.')
		.addField('meme-gen', 'Sends a meme with the text and background of your choice.')
		.addField('new-password', 'Sends a "Weak Password/Strong Password" meme with the passwords of your choice.')
		.addField('nike-ad', 'Sends a "Believe in Something" Nike Ad meme with the text of your choice.')
		.addField('plankton-plan', 'Sends a Planktons Plan meme with steps of your choice.')
		.addField('skyrim-skill', 'Sends a "Skyrim Skill" meme with the skill and image of your choice.')
		.addField('pog', 'Sends a pogchamp duplicated however many times you want.')
		.addField('sora-selfie', 'Draws an image or a users avatar behind Sora taking a selfie.')
		.addField('sos', 'Sends a "Esther Verkests Help Sign" comic with the text of your choice.')
		.addField('spongebob-burn', 'Sends a "Spongebob Throwing Something into a Fire" meme with words of your choice.')
		.addField('thug-life', 'Draws "Thug Life" over an image or a users avatar.')
		.addField('to-be-continued', 'Draws an image with the "To Be Continued..." arrow.')
		.addField('trumpbill', 'Makes President Trump make your text on a bill')
		.addField('ultimate-tattoo', 'Draws an image or a users avatar as "The Ultimate Tattoo".')
		.addField('vietnam-flashbacks', 'Edits Vietnam flashbacks behind an image or a users avatar.')
		.addField('worthless', 'Draws an image or a users avatar over Gravity Falls "This is worthless." meme.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
        }
		case(17):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
			.setTitle('Help Page 17 of 20 (Text Manipulation) (Prefix is t. )')  
			.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
			.setFooter("Time, Created by Overtime2005#7858")
			.addField('base64', 'Converts text to/from Base64.')
			.addField('binary', 'Converts text to binary.')
			.addField('braille', 'Converts text to braille.')
			.addField('brony-speak', 'Converts text to brony speak.')
			.addField('clap', 'Sends 👏 text 👏 like 👏 this.')
			.addField('cow-say', 'Makes a cow say your text.')
			.addField('cursive', 'Converts text to cursive.')
			.addField('dvorak', 'Converts text to Dvorak encoding.')
			.addField('embed', 'Sends text in an embed.')
			.addField('emojify', 'Converts text to emoji form.')
			.addField('fancy', 'Converts text to fancy letters.')
			.addField('hex', 'Converts text to hex.')
			.addField('latlmes', 'Creates a Latlmes fake link that redirects to a rickroll.')
			.addField('lmgtfy', 'Creates a LMGTFY link with the query you provide.')
			.addField('lolcat', 'Converts text to lolcat.')
			.addField('lowercase', 'Converts text to lowercase.')
			.addField('md5', 'Creates a hash of text with the MD5 algorithm.')
			.addField('mocking', 'SenDs TexT lIkE ThiS.')
			.addField('morse', 'Converts text to morse code.')
			.addField('nobody-name', 'Converts a name into the Organization XIII style.')
			.addField('owo', 'OwO.')
			.addField('pig-latin', 'Converts text to pig latin.')
			.addField('pirate', 'Converts text to pirate.')
			.addField('repeat', 'Repeat text over and over and over and over (etc).')
			.addField('reverse', 'Reverses text.')
			.addField('say', 'Make me say what you want, master.')
			.addField('sha-1', 'Creates a hash of text with the SHA-1 algorithm.')
			.addField('sha-256', 'Creates a hash of text with the SHA-256 algorithm.')
			.addField('ship-name', 'Creates a ship name from two names.')
			.addField('shuffle', 'Shuffles text.')
			.addField('snake-speak', 'Convertsssss text to sssssnake ssssspeak.')
			.addField('spoiler-letter', 'Sends text with each and every character as an individual spoiler.')
			.addField('superscript', 'Converts text to tiny text.')
			.addField('tebahpla', 'Reverses the alphabet of text.')
			.addField('temmie', 'Converts text to Temmie speak.')
			.addField('translate', 'Translates text to a specific language.')
			.addField('unspoiler', 'Removes all spoilers from a message.')
			.addField('uppercase', 'Converts text to uppercase.')
			.addField('upside-down', 'Flips text upside-down.')
			.addField('url-decode', 'Decodes URL characters to regular characters.')
			.addField('url-encode', 'Encodes text to URL-friendly characters.')
			.addField('webhook', 'Posts a message to the webhook defined in the bot owners `process.env`. (Owner-Only)')
			.addField('yoda', 'Converts text to Yoda speak.')
			.addField('zalgo', 'Converts text to zalgo.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(18):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 18 of 20 (Number Manipulation) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('currency', 'Converts currency from one currency to another.')
		.addField('final-grade', 'Determines the grade you need to make on your final to get your desired course grade.')
		.addField('grade', 'Determines your grade on an assignment on an 100-point scale.')
		.addField('gravity', 'Determines weight on another planet.')
		.addField('math', 'Evaluates a math expression.')
		.addField('prime', 'Determines if a number is a prime number.')
		.addField('roman', 'Converts a number to roman numerals.')
		.addField('scientific-notation', 'Converts a number to scientific notation.')
		.addField('tax', 'Determines the total cost of something plus tax.')
		.addField('units', 'Converts units to/from other units.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
        }
		case(19):
        {
        var edited = new Discord.MessageEmbed()
		.setColor(0xFF0000)
		.setTitle('Help Page 19 of 20 (Other) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('cleverbot', 'Talk to Cleverbot. (Owner-Only)')
		.addField('phone-book', 'Looks up phone-enabled servers.')
		.addField('phone', 'Starts a phone call with a random server.')
		.addField('portal-send', 'Send a message to a portal channel.')
		.addField('prune', 'Deletes up to 99 messages from the current channel.')
		.addField('rename-all', 'Renames every member of the server. (Owner-Only)')
		.addField('strawpoll', 'Generates a Strawpoll with the options you provide.')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}
		case(20):
        {
        var edited = new Discord.MessageEmbed()
		.setTitle('Help Page # of # (README Generators) (Prefix is t. )')  
		.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
		.setFooter("Time, Created by Overtime2005#7858")
		.addField('generate-commands', 'Generates the commands list for Times README. (Owner-Only)')
		.addField('generate-credit', 'Generates the credit list for Times README. (Owner-Only)')
		.addField('generate-process-env', 'Generates a backup list of Times `process.env`. (Owner-Only)')
        messageReaction.message.edit(edited).catch(()=>{return})
        break;
		}








	}
}
	}
}
})

client.on('error', err => client.logger.error(err));

client.on("message", async (msg) =>{
	if(msg.content === "t.help")
                {
                    msg.delete()
                    var helpmenu = new Discord.MessageEmbed()
					.setTitle(`Help Page 1 of 20 (Tutorial) (Prefix is t.)`)
					.setColor(0xFF0000)
					.addField('Use ▶', `to move to the next menu`)
					.addField('Use ◀', 'to go back in the menus')
					.addField('Use 🏠', 'to go back to this menu')
					.addField(`Use 🆗`, `to close this`)
					.setThumbnail("https://cwcsrnovel.files.wordpress.com/2012/06/clock_animated.gif")
					.setFooter("Time, Created by Overtime2005#7858")
                    msg.channel.send(helpmenu).then(sentmsg => {
                    
                        var config2 = {
                            id: msg.member.id,
                            helpPage: 1
                        }
                        helparray[sentmsg.id] = config2
                        //console.log(helparray[sentmsg.id])
                        //console.log(sentmsg.id)
        
                        sentmsg.react('\◀')
                        setTimeout(arrow, 500)
                        function arrow(){
                        sentmsg.react('\🏠')}
                        setTimeout(arrow2, 1000)
                        function arrow2(){
                        sentmsg.react('\▶')}
                        setTimeout(ok, 1500)
                        function ok(){
                        sentmsg.react('\🆗')}
                    }).catch(()=>{
                        return
                    })
				}
			})
			

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(TIME_TOKEN);


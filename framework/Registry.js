const Collection = require('@discordjs/collection');
const fs = require('fs');
const path = require('path');
const Group = require('./Group');

module.exports = class Registry {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.commands = new Collection();
		this.groups = new Collection();
		this.types = new Collection();
	}

	findCommands(query) {
		query = query.toLowerCase();
		return this.commands.filter(command => command.name === query || command.aliases.includes(query));
	}

	registerCommand(command) {
		this.commands.set(command.name, command);
		return this;
	}

	registerCommandsIn(dir) {
		const groups = fs.readdirSync(dir);
		for (const group of groups) {
			const commands = fs.readdirSync(path.join(dir, group));
			for (const command of commands) {
				if (!command.endsWith('.js')) continue;
				const Required = require(path.join(dir, group, command));
				this.registerCommand(new Required(this.client));
			}
		}
		return this;
	}

	findGroups(query) {
		query = query.toLowerCase();
		return this.groups.filter(group => group.id === query || group.name.toLowerCase() === query);
	}

	registerGroup(group) {
		this.groups.set(group.id, group);
		return this;
	}

	registerGroups(groups) {
		for (const [id, name] of groups) {
			const group = new Group(this.client, id, name);
			this.registerGroup(group);
		}
		return this;
	}

	registerType(type) {
		this.types.set(type.id, type);
		return this;
	}

	registerTypesIn(dir) {
		const types = fs.readdirSync(dir);
		for (const type of types) {
			if (!type.endsWith('.js')) continue;
			const Required = require(path.join(dir, type));
			this.registerType(new Required(this.client));
		}
		return this;
	}

	registerDefaultTypes() {
		return this.registerTypesIn(path.join(__dirname, 'types'));
	}
};
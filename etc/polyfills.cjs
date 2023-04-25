let Eris = require('eris')

// Why .cjs? Because in ESM eris exports properties as const
// and consts can't access prototype, so we are using require()

// .tag property
Object.defineProperty(Eris.User.prototype, 'tag', {
	get() { return `${this.username}#${this.discriminator}` }
})
Object.defineProperty(Eris.Member.prototype, 'tag', {
	get() { return `${this.username}#${this.discriminator}` }
})

// ephemeral functions
Eris.CommandInteraction.prototype.createEphemeral = function (content, file) {
	if (typeof content == 'object')
		content.flags = 64
	else content = {
		content: content,
		flags: 64,
	}
	this.createMessage(content, file)
}
Eris.CommandInteraction.prototype.deferEphemeral = async function () {
	await this.defer(64)
}

// Simplify embed sending
Eris.CommandInteraction.prototype.createEmbed = function(embed) {
	if (embed.toJSON) embed = embed.toJSON()
	this.createMessage({embed})
}


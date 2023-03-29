module.exports = {
	private: true,
	options: [
		{ type: 'string',
			name: 'code',
			required: true,
		}
	],
	run: async (C, msg, owner) => {
		await msg.defer(ephemeral)
		try {
			const result = eval(msg.args[0].value)
			msg.createMessage({content: `\`\`\`js\n// ${msg.loc.succ} ✅\n${result}\`\`\``, flags: ephemeral})
		} catch (err) {
			msg.createMessage({content: `\`\`\`js\n// ${msg.loc.err} ❎\n${err}\`\`\``, flags: ephemeral})
		}
	}
}


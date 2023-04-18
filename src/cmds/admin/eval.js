export default {
	private: true,
	options: [
		{ type: 'string',
			name: 'code',
			required: true,
		},
		{ type: 'boolean',
			name: 'avail'
		}
	],
	run: async (C, msg, owner) => {
		let {code, avail} = msg.args
		if (avail)
			await msg.defer()
		else await msg.deferEphemeral()
		try {
			const result = eval(code)
			msg.createMessage(`\`\`\`js\n// ${msg.loc.succ} ✅\n${result}\`\`\``)
		} catch (err) {
			msg.createMessage(`\`\`\`js\n// ${msg.loc.err} ❎\n${err}\`\`\``)
		}
	}
}


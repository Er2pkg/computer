export default {
	private: true,
	options: [
		{ type: 'string',
			name: 'code',
			required: true,
		}
	],
	run: async (C, msg, owner) => {
		await msg.deferEphemeral()
		try {
			const result = eval(msg.args[0].value)
			msg.createEphemeral(`\`\`\`js\n// ${msg.loc.succ} ✅\n${result}\`\`\``)
		} catch (err) {
			msg.createEphemeral(`\`\`\`js\n// ${msg.loc.err} ❎\n${err}\`\`\``)
		}
	}
}


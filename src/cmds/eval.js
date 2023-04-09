export default {
	private: true,
	options: [
		{ type: 'string',
			name: 'code',
			required: true,
		},
		{ type: 'boolean',
			name: 'public'
		}
	],
	run: async (C, msg, owner) => {
		let code = msg.args.find(i => i.name == 'code').value
		let pub = msg.args.find(i => i.name == 'public')?.value
		await msg[pub ? 'defer' : 'deferEphemeral']()
		try {
			const result = eval(code)
			msg.createMessage(`\`\`\`js\n// ${msg.loc.succ} ✅\n${result}\`\`\``)
		} catch (err) {
			msg.createMessage(`\`\`\`js\n// ${msg.loc.err} ❎\n${err}\`\`\``)
		}
	}
}


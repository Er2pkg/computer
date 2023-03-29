module.exports = {
	private: true,
	options: [
		{ type: 'string',
			name: 'code',
			required: true,
		}
	],
	run: async (C, msg) => {
		await msg.defer(ephemeral)
		let result
		try {
			result = require('child_process')
				.execSync(msg.args[0].value)
				.toString('utf8')
		} catch (err) { result = err }
		msg.createMessage({content: `\`\`\`sh\n${result}\`\`\``, flags: ephemeral})
	}
}


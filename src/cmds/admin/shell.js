import {execSync} from 'node:child_process'

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
	run: async (C, msg) => {
		let {code, avail} = msg.args
		if (avail)
			await msg.defer()
		else await msg.deferEphemeral()
		try {
			const result = execSync(code).toString('utf8')
			msg.createEphemeral(`\`\`\`sh\n# ${msg.loc.succ} ✅\n${result}\`\`\``)
		} catch (err) {
			msg.createMessage(`\`\`\`sh\n# ${msg.loc.err} ❎\n${err}\`\`\``)
		}
	}
}


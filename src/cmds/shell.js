import {execSync} from 'node:child_process'

export default {
	private: true,
	options: [
		{ type: 'string',
			name: 'code',
			required: true,
		}
	],
	run: async (C, msg) => {
		await msg.deferEphemeral()
		try {
			let result = execSync(msg.args[0].value).toString('utf8')
			msg.createEphemeral(`\`\`\`sh\n${result}\`\`\``)
		} catch (err) {
			msg.createEphemeral(`\`\`\`\n${err}\`\`\``)
		}
	}
}


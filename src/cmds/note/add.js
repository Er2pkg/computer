export default {
	options: [
		{ type: 'string',
			max_length: 2000,
			required: true,
			name: 'text'
		},
		{ type: 'string',
			max_length: 20,
			name: 'short'
		}
	],
	run: async (C, msg) => {
		let db = await C.models.User.findOne({id: msg.user.id}).exec()
		if (!db) db = await C.models.User.create({id: msg.user.id})
		let notes = db.notes

		let text = msg.args.text
		let name = msg.args.short || text.slice(0, 10) + '...'
		let id = notes.length + 1
		notes.push({name, text})
		await db.save()
		msg.createEphemeral(msg.loc.created +' '+ id)
	}
}


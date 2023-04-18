export default {
	options: [
		{ type: 'integer',
			required: true,
			name: 'id'
		},
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

		let {id, text} = msg.args
		let name = msg.args.short || text.slice(0, 10) + '...'
		let note = notes[id - 1]
		if (!note) return msg.createEphemeral(msg.loc.missing)
		note.name = name
		note.text = text
		await db.save()
		msg.createEphemeral(msg.loc.updated +' '+ id)
	}
}


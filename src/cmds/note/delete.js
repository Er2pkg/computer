export default {
	options: [
		{ type: 'integer',
			required: true,
			name: 'id'
		}
	],
	run: async (C, msg) => {
		let db = await C.models.User.findOne({id: msg.user.id}).exec()
		if (!db) db = await C.models.User.create({id: msg.user.id})
		let notes = db.notes

		let id = msg.args.id
		let note = notes[id - 1]
		if (!note) return msg.createEphemeral(msg.loc.missing)
		notes.splice(id - 1, 1)
		await db.save()
		msg.createEphemeral(msg.loc.deleted +' '+ id)
	}
}


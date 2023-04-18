export default {
	run: async (C, msg) => {
		let db = await C.models.User.findOne({id: msg.user.id}).exec()
		if (!db) db = await C.models.User.create({id: msg.user.id})
		let notes = db.notes

		if (notes.length < 1) return msg.createEphemeral(msg.loc.nothing)
		msg.createEphemeral(notes.map((i, k) => `${k+1} (${i.name})`).join('\n'))
	}
}


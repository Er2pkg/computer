export default {
	run: async (C, msg) => {
		let db = await C.models.User.findOne({id: msg.user.id}).exec()
		if (!db) db = await C.models.User.create({id: msg.user.id})

		db.notes = []
		await db.save()
		msg.createEphemeral(msg.loc.deleted +' '+ id)
	}
}


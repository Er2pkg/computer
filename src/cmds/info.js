module.exports = {
	run: async (C, msg) =>
		msg.createMessage({embed: C.info(C, msg.locale)})
}


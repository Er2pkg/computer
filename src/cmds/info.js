module.exports = {
	run: (C, msg) =>
		msg.createMessage({embed: C.info(C, msg.locale)})
}


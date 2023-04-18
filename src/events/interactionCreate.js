let parseOpts = opt => {
	let res = {}
	for (let o of opt)
		if (o.options)
			res[o.name] = parseOpts(o.options)
		else res[o.name] = o.value
	return res
}
export default (C, api, intr) => {
	if (intr.type != 2) return
	if (!intr.user) intr.user = intr.member.user

	let cmd, args = {}
	let cmdn = intr.data.name
	let opts = intr.data.options
	if (opts && opts[0].type == 1) {
		cmd = C.cmds[cmdn +'/'+ opts[0].name]
		args = parseOpts(opts[0].options)
	} else {
		cmd = C.cmds[cmdn]
		args = parseOpts(opts || [])
	}
	let owner = intr.user.id == C.config.owner
	let l = intr.locale

	if (!cmd)
		intr.createEphemeral(C.locale.get('error', 'inv_cmd', l))
	else if (typeof cmd.run != 'function')
		intr.createEphemeral(C.locale.get('error', 'cmd_run', l))
	else if (cmd.private && !owner)
		intr.createEphemeral(C.locale.get('error', 'adm_cmd', l))
	else {
		C.stats.uses++
		intr.args = args
		intr.loc = C.locale.get('cmds', cmdn, l)
		cmd.run(C, intr, owner)
		.catch(err => {
			console.log(err)
			api.getDMChannel(C.config.owner)
				.then(ch => ch.createMessage({content: err}))
			intr.createEphemeral(C.locale.get('error', 'not_suc', l))
		})
	}
}


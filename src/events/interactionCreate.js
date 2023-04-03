module.exports = (C, api, interaction) => {
	switch(interaction.type) {
	case 2:
		if (!interaction.user) interaction.user = interaction.member.user

		let cmd = C.cmds[interaction.data.name]
		let owner = interaction.user.id == C.config.owner
		let l = interaction.locale

		if (!cmd)
			interaction.createMessage({content: C.locale.get('error', 'inv_cmd', l), flags: ephemeral})
		else if (typeof cmd.run != 'function')
			interaction.createMessage({content: C.locale.get('error', 'cmd_run', l), flags: ephemeral})
		else if (cmd.private && !owner)
			interaction.createMessage({content: C.locale.get('error', 'adm_cmd', l), flags: ephemeral})
		else {
			interaction.args = interaction.data.options || []
			interaction.loc = C.locale.get('cmds', interaction.data.name, l)
			cmd.run(C, interaction, owner)
			.catch(err => {
				console.log(err)
				api.getDMChannel(C.config.owner)
					.then(ch => ch.createMessage({content: err}))
				interaction.createMessage({content: C.locale.get('error', 'not_suc', l), flags: ephemeral})
			})
		}
		break
	}
}


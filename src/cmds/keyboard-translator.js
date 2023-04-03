const eng = "qwertyuiop[]asdfghjkl;'zxcvbnm,./"
const rus = "йцукенгшщзхъфывапролджэячсмитьбю."

module.exports = {
	messagecmd: true,
	run: async (C, msg) => {
		msg.data.resolved.messages.forEach(m => {
			if (!m.content.length)
				return msg.createMessage({content: C.locale.get('error', 'req_err', msg.locale), flags: ephemeral})
			let cont = m.content
				.split('')
				.map(i => {
					let l = i.toLowerCase()
					let low = i == l
					if (l == 'ё') return low ? 't' : 'T'
					let iEng = eng.indexOf(l), iRu = rus.indexOf(l)
					if (iEng > -1) return low ? rus[iEng] : rus[iEng].toUpperCase()
					if (iRu  > -1) return low ? eng[iRu ] : eng[iRu ].toUpperCase()
					return i
				})
				.join('')
				.replace(/(http:\/\/|https:\/\/)?discord(\.com\/invite|.\w{2}\/\w{3,})/gi, '[INVITE]')
			msg.createMessage(cont)
		})
	}
}


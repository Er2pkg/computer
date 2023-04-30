import Embed from '../../etc/Embed.js'
import rgbcolor from 'rgbcolor'

export default  {
	options: [
		{ type: 'string',
			name: 'color',
			required: true
		}
	],
	run: async (C, msg) => {
		const col = new rgbcolor(msg.args.color.toLowerCase())
		msg.createEmbed(new Embed()
			.author((col.ok ? msg.loc.iscol : msg.loc.isntcol) +' '+ msg.args.color, C.api.user.dynamicAvatarURL('webp'))
			.thumbnail(`http://singlecolorimage.com/get/${col.ok ? col.toHex().toString().slice(1) : '2C2F33'}/100x100`)
			.color(col.ok ? col.toHex() : '2C2F33')
			.field('HEX', col.ok ? col.toHex() : msg.loc.isntcol)
			.field('RGB', col.ok ? col.toRGB() : msg.loc.isntcol)
			.field('RGBA', col.ok ? col.toRGBA() : msg.loc.isntcol)
		)
	}
}


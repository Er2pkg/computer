import weather from 'openweathermap'
import Embed from '../../etc/Embed.js'

weather.defaults({units: 'metric', mode: 'json', appid: process.env.TokenWeather})
delete process.env.TokenWeather

let units = 'ºC'

export default {
	options: [
		{ type: 'string',
			name: 'location',
			required: true
		}
	],
	run: async (C, msg) => {
		weather.now({q: encodeURIComponent(msg.args.location), lang: msg.locale.split('_')[0]}, (err, json) => {
			if (err || json?.cod != 200) {
				if (json?.message)
					msg.createEphemeral(C.locale.get('error', 'req_err', msg.locale) +': '+ json.message)
				else
					msg.createEphemeral(C.locale.get('error', 'req_err', msg.locale))
				console.log(err, json)
				return
			}
			console.log(json)
			msg.createEmbed(new Embed()
				.title(`**${json.name}** (${json.coord.lon}, ${json.coord.lat})`)
				.description(json.weather[0].description)
				.thumbnail(json.weather[0].iconUrl)
				.footer(msg.loc.cid + json.id)
				.timestamp()
				.field(msg.loc.temp,
					`${json.main.temp + units}\n`
					+ `${msg.loc.feels}: ${json.main.feels_like + units}\n`
					+ `${msg.loc.range}: ${json.main.temp_min} — ${json.main.temp_max} ${units}\n`
				)
				.field(msg.loc.humidity, json.main.humidity + '%')
			)
		})
	}
}


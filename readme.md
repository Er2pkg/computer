# Computer bot

This is an open-source Discord bot (this code base was initially written in Lua for Telegram).

# Setup

To start this bot, you need to have some environment variables:

- TokenBot: Discord token for bot

- TokenMongoDB: Address to mongodb connection (looks like mongodb+srv://user:password@server)

- TokenWeather: OpenWeatherMap token for /weather command

- BETA: Internal variable for testing purpose bot, main difference is that it does not update stats message defined in config.js file

After that, you can start this bot just with node .

If you have an error about missing token, maybe you need to `export` them

To simplify this process, you can create start.sh file which is ignored by git.

# History

This bot was created in 2019 and named ЭВМ for new Discord server with USSR thematic.

Firstly, bot was private and then became publically available. After some time, it was renamed into Computer.

It was dead in 2021 because of my attempt to leave Discord (this is impossible as you can think)

In 2023 it was reborn in this repository.


const { Bot } = require('@dlghq/dialog-bot-sdk');
const getWeather = require('./weatherApi.js');

const bot = new Bot({
    endpoints: ['wss://ws1.coopintl.com'],
    username: 'extestbot',
    password: 'ghXhc5dq8Fs5gr',
});

const cities = [
    {
        id: '1',
        name: 'Moscow',
        countryCode: 'ru'
    },
    {
        id: '2',
        name: 'Berlin',
        countryCode: 'de'
    },
    {
        id: '3',
        name: 'London',
        countryCode: 'uk'
    }
]

async function run() {

    bot.onInteractiveEvent(async event => {
        const id = event.id;
        const user = event.ref.peer;
        if (id === 'select') {
            const cityName = cities.filter(x => x.id === event.value).map(x => x.name).toString()
            const countryCode = cities.filter(x => x.id === event.value).map(x => x.countryCode).toString()

            const weather = await getWeather.finalWeather(cityName, countryCode)
            await bot.sendTextMessage(user, weather);
        }
    })

    bot.onMessage(async(peer, message) => {
        const uid = await bot.getUid();

        if (message.content.type === 'text') {
            await bot.sendInteractiveMessage(peer, 'I will tell the weather', [{
                description: 'Choose city',
                actions: [{
                    id: `select`,
                    widget: {
                        type: 'select',
                        label: 'city',
                        options: cities.map(city => {
                            return {
                                label: city.name,
                                value: String(city.id)
                            }
                        })
                    }
                }]
            }]);
        }
    });
}


bot.onError((error) => {
    console.error(error);
    process.exit(1);
});
run().catch(e => console.log(e))
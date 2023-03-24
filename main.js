// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})
const TelegramBot = require('node-telegram-bot-api');
const chatId = ''
const token = ''
const bot = new TelegramBot(token, {polling: true})
// Блок кода, который нужен для исправления ошибки с CORS
fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})
bot.setMyCommands([{command: '/sum', description: 'Вывести общее количество участников'},{command: '/sum2', description: 'Вывести общее количество участников'}])
bot.onText(/\/sum/, (msg, match) => {
    console.log(msg)
});

// Создание маршрута для get запроса
fastify.get('/', async function (request, reply) {
    reply.send({ hello: 'world' })
    await bot.sendMessage(chatId,`hello`)
})

// Создание маршрута для post запроса
fastify.post('/post', async function (request, reply) {
    console.log(`Тело запроса: `,JSON.stringify(request.body))
    reply.send(request.body)

})

// Создание запроса с использование path параметров
fastify.get('/:id',function (request, reply) {
    console.log(`Path параметры, переданные в запросе: `,JSON.stringify(request.params))
    reply.send(request.params)
})

// Создание запроса с использованием query параметров
fastify.get('/query',function (request, reply) {
    console.log(`Query параметры, переданные в запросе`, JSON.stringify(request.query))
    reply.send(request.query)
})

// Запускаем сервер на порту 3000
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
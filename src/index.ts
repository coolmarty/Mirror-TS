import {Client, Intents} from 'discord.js';
import {Bot} from './bot';


let options = { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES]};
let token = 'OTE1MDg3MDE5OTE3NTg2NDMy.YaWfMw.R_Jsmn2Z5e6WSk78KyYV3D8paJE';
let test_server = '735178009526665227';
let bot = new Bot(token, new Client(options), 'debug', test_server);

async function start() {
    await bot.start();
    bot.logger.info('another test');
}

start();
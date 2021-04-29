import got from "got";
import * as bots from "./bots";
import * as conversations from "./conversations";
import * as departments from "./departments";
import * as messages from "./messages";
import * as reactive from "./reactive";
import * as spaces from "./spaces";
import * as users from "./users";
import Config from 'config';

const appkey=Config.keys.kakaoWork.bot;

export const client = got.extend({
	prefixUrl: 'https://api.kakaowork.com',
	headers:{
        Authorization:`Bearer ${appkey}`
    },
});

export default {
    conversations,
    bots,
    departments,
    messages,
    reactive,
    spaces,
    users
}
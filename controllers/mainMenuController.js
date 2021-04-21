const libKakaoWork = require('../libs/kakaoWork');
const mainMenuView = require('../views/mainMenuView');

module.exports = async function mainMenuController(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(mainMenuView(message.conversation_id))
}
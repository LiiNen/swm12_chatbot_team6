// routes/index.js
const express = require('express');
const router = express.Router();
const libKakaoWork = require('../libs/kakaoWork');

const mainMenuView = require('../views/mainMenuView');
const mainMenuController = require('../controllers/mainMenuController');
const mentoringListController = require('../controllers/mentoringListController');
menuList = ['menu1', 'menu2', 'menu3', 'menu4'];

//챗봇 시작
router.get('/', async (req, res, next) => {
	// const users = await libKakaoWork.getUserList(); // 구성원 전체에게 챗봇 보내기
	/* 0번째 구성원(김정훈)에게 챗봇 보내기 */
	/* 김정훈, 오창환, 임연수, 박찬규, 이병곤 순서로 인덱싱되어있음 */
	users = await libKakaoWork.getUserList();
	users = [users[0]];
	const conversations = await Promise.all(
		users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
	);
  
  const messages = await Promise.all([
    conversations.map((conversation) => libKakaoWork.sendMessage(mainMenuView(conversation.id))),
  ]);

  // 응답값은 자유롭게 작성하셔도 됩니다.
  res.json({
    users,
    conversations,
    messages,
  });
});

async function unsupportedSubmitActionController(req) {
  const { message, action_name } = req.body
  console.log(`unsupported submit_action ${action_name}}`)
  await libKakaoWork.sendMessage({
    conversationId: message.conversation_id,
    text: '콜백 에러',
    blocks: [
      {
        type: 'text',
        text: `지원되지 않는 콜백 타입 ${type} 입니다.`,
      },
    ]
  });
}
async function mentoringListBtn(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(mentoringListController(message.conversation_id))
}
async function menu2Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}
async function menu3Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}
async function menu4Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}

async function handleSubmitAction(req) {
  console.log('handleSubmitAction');
  const { action_name } = req.body;
  console.log('action_name', action_name);
  const submitActionHandler = {
    'home': mainMenuController,
		'mentoring_list_btn': mentoringListBtn,
		'menu2': menu2Controller,
		'menu3': menu3Controller,
		'menu4': menu4Controller,
		'': unsupportedSubmitActionController
  }
  if (!(action_name in submitActionHandler))
    action_name = '';
  await submitActionHandler[action_name](req);
}

async function handleUnsupportedCallback({message, type}) {
  console.log(`unsupported callback type ${type}`)
  await libKakaoWork.sendMessage({
    conversationId: message.conversation_id,
    text: '콜백 에러',
    blocks: [
      {
        type: 'text',
        text: `지원되지 않는 콜백 타입 ${type} 입니다.`,
      },
    ]
  });
}


async function handleSubmission(req) {
  const {message, action_time, actions, value} = req.body;
  console.log('handleSubmissions');
  await libKakaoWork.sendMessage({
    conversationId: message.conversation_id,
    text: '설문조사에 응해주셔서 감사합니다!',
    blocks: [
      {
        type: 'text',
        text: '설문조사에 응해주셔서 감사합니다! 🎁',
        markdown: true,
      },
      {
        type: 'text',
        text: '*답변 내용*',
        markdown: true,
      },
      {
        type: 'description',
        term: '평점',
        content: {
          type: 'text',
          text: actions.rating,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '바라는 점',
        content: {
        type: 'text',
          text: actions.wanted,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '시간',
        content: {
          type: 'text',
          text: action_time,
          markdown: false,
        },
        accent: true,
      },
    ],	
  });
}

// routes/index.js
router.post('/callback', async (req, res, next) => {
  console.log('/callback called');
  const { message, type, actions, action_time, action_name, value } = req.body;
  console.log(req.body);
  const callbackHandler = {
		'submission': handleSubmission,
    'submit_action': handleSubmitAction,
  }
  if (type in callbackHandler)
    callbackHandler[type](req);
  else
    handleUnsupportedCallback(req);

  res.json({ result: true });
});

module.exports = router;
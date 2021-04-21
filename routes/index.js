// routes/index.js
const express = require('express');
const router = express.Router();

const libKakaoWork = require('../libs/kakaoWork');

function mainMenuView(conversationId) {
  const menuItems = [['메뉴1', 'menu1'], ['메뉴2', 'menu2'], ['메뉴3', 'menu3'], ['메뉴4', 'menu4']]
  .map(([menuName, action_name]) => ({
    type: 'button',
	action_type: 'submit_action',
	action_name,
	text: menuName,
	style: 'default'
  }));

  return {
    conversationId,
    text: '소마 멘토링 ',
    blocks: [
      {
        type: 'header',
        text: '소마 멘토링 봇',
        style: 'blue',
      },
      {
        type: 'text',
        text: '메뉴를 선택해주세요!',
        markdown: true,
      },
	  ...menuItems,
      {type: 'button', action_type: 'call_modal', value: 'cafe_survey', text: '설문 참여하기', style: 'default'}
    ],
  }
}

function menu1View(conversationId) {
  return {
    conversationId,
    text: '메뉴1!',
    blocks: [
	  {
        type: 'header',
        text: '소마 멘토링 봇',
        style: 'blue',
      },
      {
        type: 'text',
        text: `메뉴1!`,
        markdown: true,
      },
	  {
        type: 'button',
     	action_type: 'submit_action',
    	action_name: 'home',
	    text: '홈으로',
	    style: 'default'
      },
	  	  {
        type: 'button',
     	action_type: 'submit_action',
    	action_name: 'menu_item',
	    text: '다음 메뉴',
	    style: 'default'
      }
    ]	
  };
}

//get
router.get('/', async (req, res, next) => {
  const users = await libKakaoWork.getUserList();
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

//post
// routes/index.js
router.post('/request', async (req, res, next) => {
  console.log('/request called');
  const { message, value } = req.body;
  console.log(req.body);

  switch (value) {
    case 'cafe_survey':
      // 설문조사용 모달 전송
      return res.json({
        view: {
          title: '설문조사',
          accept: '설문조사 전송하기',
          decline: '취소',
		  action_name: 'cafe_survey_results',
          value: 'cafe_survey_results',
          blocks: [
            {
              type: 'label',
              text: '카페 평점을 알려주세요',
              markdown: false,
            },
            {
              type: 'select',
              name: 'rating',
              required: true,
              options: [
                {
                  text: '1점',
                  value: '1',
                },
                {
                  text: '2점',
                  value: '2',
                },
                {
                  text: '3점',
                  value: '3',
                },
                {
                  text: '4점',
                  value: '4',
                },
                {
                  text: '5점',
                  value: '5',
                },
              ],
              placeholder: '평점',
            },
            {
              type: 'label',
              text: '바라는 점이 있다면 알려주세요!',
              markdown: false,
            },
            {
              type: 'input',
              name: 'wanted',
              required: false,
              placeholder: 'ex) 와플을 팔면 좋겠습니다',
            },
          ],
        },
      });
      break;
    default:
  }

  res.json({});
});

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
/*
async function handleMenuItem({message, menuItemId}) {

  if (!(menuItemId in menuItemHandler))
    menuItemId = 'home'
  await libKakaoWork.sendMessage(menuItemHandler[menuItemId](message.conversation_id))
}
*/

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

async function mainMenuController(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(mainMenuView(message.conversation_id))
}

async function menu1Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}

async function handleSubmitAction(req) {
  console.log('handleSubmitAction');
  const { action_name } = req.body;
  const submitActionHandler = {
    'home': mainMenuController,
	'menu1': menu1Controller,
	'menu2': menu1Controller,
	'menu3': menu1Controller,
	'menu4': menu1Controller,
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
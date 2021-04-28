// routes/index.js
const express = require('express');
const router = express.Router();
const libKakaoWork = require('../libs/kakaoWork');

const mainMenuView = require('../views/mainMenuView');
const menu2View = require('../views/menu2View');
const mainMenuController = require('../controllers/mainMenuController');
const mentoringListController = require('../controllers/mentoringListController');
const callenderController = require('../controllers/callenderController');

//챗봇 시작
mentoring_index = -1;
mentoring_json = [];

function mentoringDataQuery() {
	const Mentoring = require('../database/scheme/Mentoring').default;
	mentoring_query = Mentoring.find()
		.select('index title applyStartDate applyEndDate applyOpended eventStartTime mentor').sort({index: 'desc'});
	mentoring_query.exec().then((x)=>{mentoring_json = [...x]});
}
mentoringDataQuery();

router.get('/', async (req, res, next) => {
	// const users = await libKakaoWork.getUserList(); // 구성원 전체에게 챗봇 보내기
	/* 0번째 구성원(김정훈)에게 챗봇 보내기 */
	/* 김정훈, 오창환, 임연수, 박찬규, 이병곤 순서로 인덱싱되어있음 */
	users = await libKakaoWork.getUserList();
	users = [users[0], users[2]];
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
	console.log("message Send in menu2Controller");
	console.log(menu2View);
  await libKakaoWork.sendMessage(menu2View(message.conversation_id))
}
async function menu3Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}
async function menu4Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}
async function callenderBtn(req) {
	const { message } = req.body;
	await libKakaoWork.sendMessage(callenderController(message.conversation_id, req.body))
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
		'': unsupportedSubmitActionController,
		'mentoring_open': callenderBtn
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


// 알림 신청 모달 베이스라인 예제코드
// 모달은 request로 오는듯
router.post('/request', async (req, res, next) => {
  const { message, value } = req.body;

  switch (value) {
    case 'subscribe_btn':
      // 설문조사용 모달 전송
      return res.json({
        view: {
          title: '설문조사',
          accept: '설문조사 전송하기',
          decline: '취소',
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
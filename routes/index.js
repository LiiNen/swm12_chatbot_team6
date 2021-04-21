// routes/index.js
const express = require('express');
const router = express.Router();
const libKakaoWork = require('../libs/kakaoWork');

const mainMenuView = require('../views/mainMenuView');
const mainMenuController = require('../controllers/mainMenuController');
menuList = ['menu1', 'menu2', 'menu3', 'menu4'];

mentoringtitle = ['[자유멘토링] 4/24(토) 20:00부터 - 프로젝트 기획 아이디어 브레인스토밍 with 10년차 소마 멘토', '[멘토특강] 2021년 4월 25일(일) 15:00 VAR/AI 및 지정프로젝트 설명, 상담회', '[멘토특강] Technical Writing - 개론&각론, 실습포함, 2021년 5월 1일(토) 12:00~16:00', '[멘토특강] DB Modeling & SQL - #2 - 2021년 5월 3일(월) 18:30~22:30', '[자유멘토링] 프로젝트 아이디어 도출/기획검증 - 2021년 5월 1일(토) 17:00~21:00'];
mentoringowner = ['김수현', '이민경', '김준범', '김준범', '김준범'];
mentoringurl = ['https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=525&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=523&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=516&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=517&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=518&menuNo=200046'];
mentoringdate = ['2021.04.24', '2021.04.28', '2021.05.01', '2021.05.03', '2021.05.01']
var tempMentoringData = new Array();
for(i=0;i<5;i++){
	tempMentoringData.push({});
	tempMentoringData[i]['id'] = i;
	tempMentoringData[i]['title'] = mentoringtitle[i];
	tempMentoringData[i]['owner'] = mentoringowner[i];
	tempMentoringData[i]['url'] = mentoringurl[i];
	tempMentoringData[i]['date'] = mentoringdate[i];
}
console.log(tempMentoringData);
function menu1View(conversationId) {
	const tempMentoring = tempMentoringData
	.flatMap((mentoring_object) => ([{
		type: 'text',
		text: `[${mentoring_object['title']}](${mentoring_object['url']})`,
		markdown: true,
	},
	{
		type: 'description',
		term: '멘토명',
		content: {
			type: 'text',
			text: mentoring_object['owner'],
			markdown: false
		},
		accent: true
	},
	{
		type: 'description',
		term: '특강일',
		content: {
			type: 'text',
			text: mentoring_object['date'],
			markdown: false
		},
		accent: true
	},
	{
		type: 'divider'
	}]));
  return {
		conversationId,
		text: '메뉴1!',
		blocks: [
			{
				type: 'header',
				text: '최근 올라온 멘토링 리스트',
				style: 'blue',
			},
			...tempMentoring,
			{
				type: 'action',
				elements: [
					{
						type: 'button',
						action_type: 'submit_action',
						action_name: 'home',
						value: 'home',
						text: '홈으로',
						style: 'default'
					},
					{
						type: 'button',
						action_type: 'submit_action',
						action_name: 'next_menu',
						value: 'next_menu',
						text: '다음',
						style: 'default'
					}
				]
			}
		]	
	};
}

//get
router.get('/', async (req, res, next) => {
	// const users = await libKakaoWork.getUserList(); // 구성원 전체에게 챗봇 보내기
	/* 0번째 구성원(김정훈)에게 챗봇 보내기 */
	/* 김정훈, 오창환, 임연수, 박찬규, 이병곤 순서로 인덱싱되어있음 */
	users = await libKakaoWork.getUserList();
	users = [users[0];
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


async function menu1Controller(req) {
  console.log('menu1Controller');
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}

async function handleSubmitAction(req) {
  console.log('handleSubmitAction');
  const { action_name } = req.body;
  console.log('action_name', action_name);
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
// routes/index.js
const express = require('express');
const router = express.Router();
const libKakaoWork = require('../libs/kakaoWork');

const mainMenuView = require('../views/mainMenuView');
//const alamView = require('../views/alamView');
const mainMenuController = require('../controllers/mainMenuController');
const mentoringListView = require('../views/mentoringListView');
const callenderView = require('../views/callenderView');
const deletedListView = require('../views/deletedListView');

//챗봇 시작
mentoring_index = -1;
mentoring_json = [];
deleted_index = -1;
deleted_json = [];

function mentoringDataQuery() {
	const Mentoring = require('../database/scheme/Mentoring').default;
	mentoring_query = Mentoring.find()
		.select('index title applyStartDate applyEndDate applyOpended eventStartTime mentor').sort({index: 'desc'});
	mentoring_query.exec().then((x)=>{mentoring_json = [...x]});
	deleted_query = Mentoring.find().where('deleted').in([true]).sort({index: 'desc'}).select('index title');
	deleted_query.exec().then((x)=>{deleted_json = [...x]});
}
mentoringDataQuery();

router.get('/', async (req, res, next) => {
	// const users = await libKakaoWork.getUserList(); // 구성원 전체에게 챗봇 보내기
	/* 0번째 구성원(김정훈)에게 챗봇 보내기 */
	/* 김정훈, 오창환, 임연수, 박찬규, 이병곤 순서로 인덱싱되어있음 */
	users = await libKakaoWork.getUserList();
	users = [users[0], users[1]];
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
  await libKakaoWork.sendMessage(mentoringListView(message.conversation_id))
}
async function callenderBtn(req) {
	const { message } = req.body;
	await libKakaoWork.sendMessage(callenderView(message.conversation_id, req.body))
}

async function menu2Controller(req) {
  const { message } = req.body;
	console.log("message Send in menu2Controller");
}
async function menu3Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}
async function menu4Controller(req) {
  const { message } = req.body;
  await libKakaoWork.sendMessage(menu1View(message.conversation_id))
}
async function deletedListBtn(req) {
	const { message } = req.body;
  await libKakaoWork.sendMessage(deletedListView(message.conversation_id))
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
		'mentoring_open': callenderBtn,
		'deleted_list_btn': deletedListBtn
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
					"title": "키워드 등록",
					"accept": "확인",
					"decline": "취소",
					"value": "{request_modal의 응답으로 전송한 value 값}",
					
					"blocks": [
					{
						"type": "label",
						"text": "키워드를 입력해주세요\n",
						"markdown": true
					},
					{
						"type": "input",
						"name": "keyword",
						"required": false,
						"placeholder": "ex) FE, blockchain, ..."
					},
					{
						"type": "label",
						"text": "\n\n작성하신 내용은 쉼표(,)로 구분되어 DB에 저장됩니다. 해당 키워드가 포함된 게시글이 올라오면, 멘토링 헬퍼가 알려드리겠습니다.\n\n이미 키워드를 입력한 적이 있으시다면\n1. 새로 입력한 키워드로 덮어씌웁니다.\n2. 빈칸일 경우 알림 구독을 취소합니다.",
						"markdown": true
					}
					]
        },
      });
      break;
    default:
  }

  res.json({});
});

// routes/index.js
// const SubscriberManager = require('../controllers/SubscriberManager');
// const subscriberManager = new SubscriberManager();

router.post('/callback', async (req, res, next) => {
  console.log('/callback called');
  const { message, type, actions, action_time, action_name, value } = req.body;
  console.log(req.body);
	//subscriberManager.add(message.user_id, actions);
	
	// actions.keyword의 경우 modal 이외의 버튼을 눌렀을 때는 없는 값입니다! 예외처리 부탁드려요!
	// console.log("user이름 : ", message.user_id);
	// console.log("user설정 : ", actions.keyword);
	
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
// routes/index.js
const express = require('express');
const router = express.Router();
const libKakaoWork = require('../libs/kakaoWork');

const mainMenuView = require('../views/mainMenuView');
//const alamView = require('../views/alamView');
const mainMenuController = require('../controllers/mainMenuController');
const mentoringListView = require('../views/mentoringListView');
const mentoringListAlertView = require('../views/mentoringListAlertView');
const callenderView = require('../views/callenderView');
const deletedListView = require('../views/deletedListView');

const Mentoring = require('../database/scheme/Mentoring').default;

//챗봇 시작

router.post('/chatbot', mainMenuController.mainMenuInit);
router.get('/', mainMenuController.mainMenuInit);

mentoring_index = -1;
mentoring_json = [];
deleted_index = -1;
deleted_json = [];

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
async function mentoringDataQuery() {
	mentoring_json = await Mentoring.find()
		.select('index title applyStartDate applyEndDate applyOpended eventStartTime mentor').sort({index: 'desc'});
	deleted_json = await Mentoring.find().where('deleted').in([true]).sort({index: 'desc'}).select('index title');
}
async function mentoringListBtn(req) {
  const { message } = req.body;
	await mentoringDataQuery();
  await libKakaoWork.sendMessage(mentoringListView(message.conversation_id))
}
async function mentoringListBtnReturn(req) {
  mentoring_index -= 2;
	if (mentoring_index <= -1) {
		const { message } = req.body;
  	await libKakaoWork.sendMessage(mentoringListAlertView(message.conversation_id))
	}
	else{
		const { message } = req.body;
  	await libKakaoWork.sendMessage(mentoringListView(message.conversation_id))
	}
}
async function callenderBtn(req) {
	const { message } = req.body;
	await libKakaoWork.sendMessage(callenderView(message.conversation_id, req.body))
}
async function deletedListBtn(req) {
	const { message } = req.body;
	await mentoringDataQuery();
  await libKakaoWork.sendMessage(deletedListView(message.conversation_id))
}

async function handleSubmitAction(req) {
  console.log('handleSubmitAction');
  const { action_name } = req.body;
  console.log('action_name', action_name);
  const submitActionHandler = {
    'home': mainMenuController.mainMenuController,
		'mentoring_list_btn': mentoringListBtn,
		'mentoring_list_btn_return': mentoringListBtnReturn,
		'mentoring_open': callenderBtn,
		'deleted_list_btn': deletedListBtn,
		'': unsupportedSubmitActionController,
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
  const {message, action_time, actions, value, react_user_id} = req.body;
	
	keyword_list = [] // 띄어쓰기 없는 채로 db에 넣기
	if (actions.keyword != null) {
		keyword_list = actions.keyword.replace(/\s/g,'').split(',');
	}
	
	const User = require('../database/scheme/User').default;
	await User.updateOne({worksID:String(react_user_id)},
		{worksID: String(react_user_id), notiKeyword: keyword_list},
		{upsert:true,setDefaultsOnInsert:true})

	if (actions.keyword == null) {
		await libKakaoWork.sendMessage({
			conversationId: message.conversation_id,
			text: '알림 서비스가 취소되었습니다!',
			blocks: [
				{
					type: 'header',
					text: '멘토링 키워드 알림 취소',
					style: 'red'
				},
				{
					type: 'text',
					text: '알림 서비스가 취소되었습니다.\n이용해주셔서 감사합니다😊',
					markdown: true,
				},
				{
					type: 'button',
					action_type: 'submit_action',
					action_name: 'home',
					value: 'home',
					text: '멘토링 헬퍼 부르기',
					style: 'default'
				}
			],
		});
	}
	else {
		await libKakaoWork.sendMessage({
			conversationId: message.conversation_id,
			text: '알림 신청이 완료되었습니다!',
			blocks: [
				{
					type: 'header',
					text: '멘토링 키워드 등록 완료',
					style: 'blue'
				},
				{
					type: 'text',
					text: '등록된 키워드는 아래와 같습니다.\n게시글 업로드시 알려드리겠습니다😊',
					markdown: true,
				},
				{
					type: 'description',
					term: '키워드',
					content: {
						type: 'text',
						text: actions.keyword,
						markdown: false,
					},
					accent: true,
				},
				{
					type: 'button',
					action_type: 'submit_action',
					action_name: 'home',
					value: 'home',
					text: '멘토링 헬퍼 부르기',
					style: 'default'
				}
			],
		});
	}
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
						"text": "알림 받으실 키워드를 입력해주세요\n작성하신 내용은 쉼표(,)를 바탕으로 구분되어 DB에 저장됩니다. 키워드에 공백은 구분하지 않습니다. \n추후 키워드가 제목 혹은 내용에 포함된 멘토링이 올라온다면, 멘토링 헬퍼가 알려드리겠습니다😊\n",
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
						"text": "\n이미 키워드를 입력한 적이 있으시다면\n1. 새로 입력한 키워드로 덮어씌워지게 됩니다.\n2. 입력한 내용이 없다면 구독을 취소합니다.\n\n잦은 알림으로 인한 업무 방해를 방지하기 위해\n5분마다 새로운 게시글을 확인해서 알림을 드립니다\n", // 크롤러 주의사항
						"markdown": true
					},
					{
						"type": "label",
						"text": "\n저희 서비스는 '관심분야'에 초점을 두어 제목/내용에 대한 키워드 알림만을 제공합니다. 만약 모든 알림이 필요하시면 0,시 등 보편적으로 글에 포함되는 문자를 추가해주세요.\n",
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
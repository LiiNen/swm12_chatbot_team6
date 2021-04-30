const libKakaoWork = require('../libs/kakaoWork');
const mainMenuView = require('../views/mainMenuView');
const Mentoring = require('../database/scheme/Mentoring').default;


async function mentoringDataQuery() {
	mentoring_json = await Mentoring.find()
		.select('index title applyStartDate applyEndDate applyOpended eventStartTime mentor').sort({index: 'desc'});
	deleted_json = await Mentoring.find().where('deleted').in([true]).sort({index: 'desc'}).select('index title');
}

async function mainMenuController(req) {
  const { message } = req.body;
  await mentoringDataQuery()
  await libKakaoWork.sendMessage(mainMenuView(message.conversation_id))
}

async function mainMenuInit(req, res, next) {
	await mentoringDataQuery()
	users = await libKakaoWork.getUserList();
	users_data = await libKakaoWork.getUserListFirst();
	users = users_data['users'];
	cursor = users_data['cursor'];
	while(cursor) {
		temp_data = await libKakaoWork.getUserListCursor({cursor: cursor});
		cursor = temp_data['cursor'];
		users = [...users, ...temp_data['users']];
	}
	for(var i = 0; i < users.length; i++) {
		console.log(users[i].id);
	}
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
}
module.exports ={
	mainMenuController,
	mainMenuInit
}
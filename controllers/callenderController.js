// index title applyStartDate applyEndDate applyOpended eventStartTime mentor
module.exports = function callenderController(conversationId, responsebody) {
	console.log('-----');
	response_json = JSON.parse(responsebody.value);
	console.log(responsebody.value);
	console.log(response_json['index']);
	return {
		conversationId,
		text: '구글 캘린더 바로가기.',
		blocks: [
			{
				type: 'header',
				text: '구글 캘린더에 일정 추가하기',
				style: 'blue',
			},
			{
				type: 'text',
				text: `멘토링을 조회하셨네요! 조회한 멘토링을 간편하게 구글 캘린더에 등록해보세요.\n날짜, 내용이 자동으로 입력됩니다.\n\n[지금 구글 캘린더에 추가하시겠어요?](${'https://www.google.com/'})`,
				markdown: true
			},
			{
				type: 'button',
				action_type: 'submit_action',
				action_name: 'home',
				value: 'home',
				text: '홈으로 돌아가기',
				style: 'default'
			}
			// {
			// 	type: 'button',
			// 	action_type: 'submit_action',
			// 	action_name: 'home',
			// 	value: 'home',
			// 	text: '구글 캘린더 일정 등록',
			// 	style: 'default'
			// }
		]	
	};
}
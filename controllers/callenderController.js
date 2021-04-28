module.exports = function callenderController(conversationId) {
	return {
		conversationId,
		text: '멘토링 목록 조회를 마쳤습니다.',
		blocks: [
			{
				type: 'header',
				text: '구글 캘린더에 일정 추가하기',
				style: 'blue',
			},
			{
				type: 'text',
				text: '멘토링을 조회하셨네요! 지금 바로 구글 캘린더에 추가하시겠어요?\n날짜, 내용이 자동으로 등록됩니다.',
				markdown: true
			},
			{
				type: 'button',
				action_type: 'submit_action',
				action_name: 'home',
				value: 'home',
				text: '구글 캘린더 일정 등록',
				style: 'default'
			}
		]	
	};
}
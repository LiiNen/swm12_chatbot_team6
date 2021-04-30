module.exports = function deletedListAlertView(conversationId) {
  return {
		conversationId,
		text: '잘못된 접근입니다!',
		blocks: [
			{
				type: "header",
				text: "잘못된 접근입니다.",
				style: "red"
			},
			{
				type: 'text',
				text: '죄송합니다. 첫 페이지의 이전 버튼의 기능은 작동하지 않습니다.',
				markdown: true
			},
			{
				type: 'button',
				action_type: 'submit_action',
				action_name: 'home',
				value: 'home',
				text: '멘토링 헬퍼 부르기',
				style: 'default'
			}
		]	
	};
}
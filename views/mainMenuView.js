module.exports = function mainMenuView(conversationId) {
	
	mentoring_index = -1; // menu1 재접근시 처음부터 볼수 있도록 홈으로 돌아올 시 다시 -1로 초기화
	deleted_index = -1;
	
	const menuItems = [['멘토링 목록', 'mentoring_list_btn', '취소된 멘토링', 'deleted_list_btn']]
	.map(([menuName1, action_name1, menuName2, action_name2]) => ({
	type: 'action',
	elements: [
		{
			type: 'button',
			action_type: 'submit_action',
			action_name: action_name1,
			value: action_name1,
			text: menuName1,
			style: 'default'
		},
		{
			type: 'button',
			action_type: 'submit_action',
			action_name: action_name2,
			value: action_name2,
			text: menuName2,
			style: 'default'
		}
	]
	}));

  return {
    conversationId,
    text: '멘토링 신청 도와줘! 멘토링 헬퍼😎',
    blocks: [
      {
        type: 'image_link',
        url: 'https://raw.githubusercontent.com/LiiNen/swm12_chatbot_team6/main/service_img/logo_made.png'
      },
      {
        type: 'text',
        text: '안녕하세요, 멘토링 헬퍼입니다😀\n예비 연수기간 중, 멘토링 조회 및 신청을 도와주는 \'멘토링 헬퍼\'입니다.\n듣고싶은 멘토링, 놓치지 마세요!',
        markdown: true,
      },
	  ...menuItems,
      {
				type: 'button',
				action_type: 'call_modal',
				value: 'subscribe_btn',
				text: '멘토링 알림 신청하기',
				style: 'default'
			}
    ],
  }
}

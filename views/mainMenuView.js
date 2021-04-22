module.exports = function mainMenuView(conversationId) {
	mentoring_index = -1; // menu1 재접근시 처음부터 볼수 있도록 홈으로 돌아올 시 다시 -1로 초기화
	const menuItems = [['멘토링 목록', 'menu1', '멘토링 일정', 'menu2'], ['알림설정', 'menu3', '맛집..?', 'menu4']]
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

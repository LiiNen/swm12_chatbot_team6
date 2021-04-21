module.exports = function mainMenuView(conversationId) {
  const menuItems = [['메뉴1', 'menu1'], ['메뉴2', 'menu2'], ['메뉴3', 'menu3'], ['메뉴4', 'menu4']]
  .map(([menuName, action_name]) => ({
    type: 'button',
	action_type: 'submit_action',
	action_name,
	value: action_name,
	text: menuName,
	style: 'default'
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

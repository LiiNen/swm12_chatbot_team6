function textReduction(title) {
	title = title.replace(/~/g, '〜');
	if (title.length > 73) {
		title = title.substr(0, 70) + ' ...';
	}
	return title;
}

const mentoring_url = 'https://swmaestro.org/sw/mypage/mentoLec/view.do?menuNo=200046&qustnrSn='
module.exports = function alamView(conversationId, mentoringInfo) {
  return {
    conversationId,
		text: "새로운 강의 알림",
		blocks: [
			{
				type: "header",
				text: "등록한 키워드의 강의가 올라왔습니다!",
				style: "blue"
			},
			{
				type: 'text',
				text: `[${textReduction(mentoringInfo['title'])}](${mentoring_url}${String(mentoringInfo['index'])})`,
				markdown: true,
			},
			{
				type: 'description',
				term: '멘토명',
				content: {
					type: 'text',
					text: mentoringInfo['mentor'],
					markdown: false
				},
				accent: true
			},
			{
				type: 'description',
				term: '일자',
				content: {
					type: 'text',
					text: dateFormatter(mentoringInfo['eventStartTime']),
					markdown: false
				},
				accent: true
			},
			{
				type: 'button',
				action_type: 'submit_action',
				action_name: 'mentoring_open',
				value: JSON.stringify(mentoringInfo),
				text: '구글 캘린더에 일정 추가하기',
				style: 'default'
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
  }
}

function dateFormatter(date) {
	date_month = date.getMonth()+1;
	if (date_month < 10) date_month = '0' + date_month;
	date_date = date.getDate();
	if (date_date < 10) date_date = '0' + date_date;
	return `${date.getFullYear()}/${date_month}/${date_date}`;
}
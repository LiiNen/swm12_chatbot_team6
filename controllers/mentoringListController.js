// index title applyStartDate applyEndDate applyOpended eventStartTime mentor

function dateFormatter(date) {
	date_month = date.getMonth()+1;
	if (date_month < 10) date_month = '0' + date_month;
	date_date = date.getDate();
	if (date_date < 10) date_date = '0' + date_date;
	return `${date.getFullYear()}/${date_month}/${date_date}`;
}

function textReduction(title) {
	if (title.length > 80) {
		title = title.substr(0, 75) + ' ...';
	}
	return title;
}

module.exports = function mentoringListController(conversationId) {
	mentoring_index++;
	// 멘토링 리스트 전부 탐색한 이후
	mentoring_json_slice = mentoring_json.slice(mentoring_index*5, (mentoring_index+1)*5);
	if (mentoring_json_slice.length == 0){
		return {
			conversationId,
			text: '멘토링 목록 조회를 마쳤습니다.',
			blocks: [
				{
					type: 'header',
					text: '조회를 완료했습니다.',
					style: 'blue',
				},
				{
					type: 'text',
					text: '모든 멘토링을 조회했습니다.\n더 이상 조회 가능한 멘토링이 없습니다.',
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
			]	
		};
	}
	const mentoring_url = 'https://swmaestro.org/sw/mypage/mentoLec/view.do?menuNo=200046&qustnrSn='
	const mentoringBlock = mentoring_json_slice.flatMap((mentoring_object) => ([{
		type: 'text',
		text: `[${textReduction(mentoring_object['title'])}](${mentoring_url}${String(mentoring_object['index'])})`,
		markdown: true,
	},
	// {
	// 	type: 'description',
	// 	term: '멘토명',
	// 	content: {
	// 		type: 'text',
	// 		text: mentoring_object['mentor'],
	// 		markdown: false
	// 	},
	// 	accent: true
	// },
	{
		type: 'description',
		term: '일자',
		content: {
			type: 'text',
			text: dateFormatter(mentoring_object['eventStartTime']),
			markdown: false
		},
		accent: true
	},
  {
		type: 'button',
		action_type: 'submit_action',
		action_name: 'mentoring_open',
		value: String(mentoring_object['index']),
		text: '자세히 보기',
		style: 'default'
	},
	{
		type: 'divider'
	}]));
  return {
		conversationId,
		text: '멘토링 목록 조회 결과입니다.',
		blocks: [
			...mentoringBlock,
			{
				type: 'action',
				elements: [
					{
						type: 'button',
						action_type: 'submit_action',
						action_name: 'home',
						value: 'home',
						text: '홈으로',
						style: 'default'
					},
					{
						type: 'button',
						action_type: 'submit_action',
						action_name: 'mentoring_list_btn',
						value: 'mentoringListBtn',
						text: '다음',
						style: 'default'
					}
				]
			}
		]	
	};
}

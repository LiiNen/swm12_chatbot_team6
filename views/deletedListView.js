// index, title

function textReduction(title) {
	title = title.replace(/~/g, '〜');
	if (title.length > 73) {
		title = title.substr(0, 70) + ' ...';
	}
	return title;
}

module.exports = function deletedListView(conversationId) {
	deleted_index++;
	// 멘토링 리스트 전부 탐색한 이후
	deleted_json_slice = deleted_json.slice(deleted_index*5, (deleted_index+1)*5);
	if (deleted_json_slice.length == 0){
		return {
			conversationId,
			text: '취소된 멘토링 조회',
			blocks: [
				{
					type: 'header',
					text: '조회를 완료했습니다.',
					style: 'blue',
				},
				{
					type: 'text',
					text: '모든 취소된 멘토링을 조회했습니다.\n더 이상 조회 가능한 멘토링이 없습니다.',
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
	deletedBlock = deleted_json_slice.flatMap((deleted_object) => ([{
		type: 'text',
		text: `[${textReduction(deleted_object['title'])}](${mentoring_url}${String(deleted_object['index'])})`,
		markdown: true,
	},
	{
		type: 'divider'
	}]));
	deletedBlock.pop();
  return {
		conversationId,
		text: '취소된 멘토링 조회 결과입니다.',
		blocks: [
			{
				type: "header",
				text: "일정 취소된 멘토링 목록",
				style: "red"
			},
			{
				type: 'text',
				text: '최근 취소된 멘토링의 제목입니다.\n링크에서 상세 정보를 확인 가능합니다.',
				markdown: true
			},
			...deletedBlock,
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
						action_name: 'deleted_list_btn',
						value: 'deleted_list_btnListBtn',
						text: '다음',
						style: 'default'
					}
				]
			}
		]	
	};
}

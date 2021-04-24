mentoring_title = ['[자유멘토링] 4/24(토) 20:00부터 - 프로젝트 기획 아이디어 브레인스토밍 with 10년차 소마 멘토', '[멘토특강] 2021년 4월 25일(일) 15:00 VAR/AI 및 지정프로젝트 설명, 상담회', '[멘토특강] Technical Writing - 개론&각론, 실습포함, 2021년 5월 1일(토) 12:00~16:00', '[멘토특강] DB Modeling & SQL - #2 - 2021년 5월 3일(월) 18:30~22:30', '[자유멘토링] 프로젝트 아이디어 도출/기획검증 - 2021년 5월 1일(토) 17:00~21:00'];
mentoring_owner = ['김수현', '이민경', '김준범', '김준범', '김준범'];
mentoring_url = ['https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=525&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=523&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=516&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=517&menuNo=200046', 'https://swmaestro.org/sw/mypage/mentoLec/view.do?qustnrSn=518&menuNo=200046'];
mentoring_date = ['2021.04.24', '2021.04.28', '2021.05.01', '2021.05.03', '2021.05.01'];
var temp_mentoring_data = new Array();
for(i=0;i<5;i++){
	temp_mentoring_data.push({});
	temp_mentoring_data[i]['id'] = i;
	temp_mentoring_data[i]['title'] = mentoring_title[i];
	temp_mentoring_data[i]['owner'] = mentoring_owner[i];
	temp_mentoring_data[i]['url'] = mentoring_url[i];
	temp_mentoring_data[i]['date'] = mentoring_date[i];
}
for(i=0;i<5;i++){
	temp_mentoring_data.push({});
	temp_mentoring_data[5+i]['id'] = 4-i;
	temp_mentoring_data[5+i]['title'] = mentoring_title[4-i];
	temp_mentoring_data[5+i]['owner'] = mentoring_owner[4-i];
	temp_mentoring_data[5+i]['url'] = mentoring_url[4-i];
	temp_mentoring_data[5+i]['date'] = mentoring_date[4-i];
}


module.exports = function mentoringListController(conversationId) {
	mentoring_index++;
	console.log('tmi: ', mentoring_index);
	// 멘토링 리스트 전부 탐색한 이후
	temp_mentoring_data_slice = temp_mentoring_data.slice(mentoring_index*5, (mentoring_index+1)*5);
	if (temp_mentoring_data_slice.length == 0){
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
	
	const mentoringBlock = temp_mentoring_data_slice.flatMap((mentoring_object) => ([{
		type: 'text',
		text: `[${mentoring_object['title']}](${mentoring_object['url']})`,
		markdown: true,
	},
	{
		type: 'description',
		term: '멘토명',
		content: {
			type: 'text',
			text: mentoring_object['owner'],
			markdown: false
		},
		accent: true
	},
	{
		type: 'description',
		term: '일자',
		content: {
			type: 'text',
			text: `${mentoring_object['date']}(0000.00.00)`,
			markdown: false
		},
		accent: true
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

// index title applyStartDate applyEndDate applyOpended eventStartTime mentor

function dateFormatterForCalendar(input) {
	var date = new Date(input);
	date_month = date.getMonth()+1;
	if (date_month < 10) date_month = '0' + date_month;
	date_date = date.getDate();
	if (date_date < 10) date_date = '0' + date_date;
	return `${date.getFullYear()}${date_month}${date_date}`;
}

function makeTime(obj){
	var res = "";
	if(obj.endDay == "") 
		res = obj.startDay + "T" + "000000" + "/" + obj.startDay+ "T" + "235959" ;
	else if(obj.startTime == "")
		res = obj.startDay + "/" + obj.endDay;
	else if (obj.endTime == "")
		res = obj.startDay + "T" + obj.startTime +"/" + obj.endDay + "T" + "240000" + "";
	else
		res = obj.startDay + "T" + obj.startTime +"/" + obj.endDay + "T" + obj.endTime + "";
	return res;
}


function makeUrl(obj){
	var res = "https://calendar.google.com/calendar/render?";
	res += "action=TEMPLATE";
	res += "&text=" + encodeURI(obj.titlecal);
	res += "&dates=" + makeTime(obj);
	res += "&details=" + encodeURI(obj.contents);
	if(obj.location == "")
		res += "&location=" + "Korea";
	else
		res += "&location=" + obj.location;
	
	return res;
}


module.exports = function callenderView(conversationId, responsebody) {
	console.log('-----');
	response_json = JSON.parse(responsebody.value);
	
	var calendarObj = {titlecal : "",startDay: "", startTime: "",endDay: "",endTime: "",contents: "",location: ""}
	calendarObj.titlecal = response_json['title'];
	calendarObj.startDay = dateFormatterForCalendar(response_json['eventStartTime']);
	calendarObj.startTime = "" ;
	calendarObj.endDay = "";
	calendarObj.endTime = "";
	calendarObj.contents = "시간을 확인해 주세요!";
	
	var url = makeUrl(calendarObj);
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
				text: `멘토링을 조회하셨네요! 조회한 멘토링을 간편하게 구글 캘린더에 등록해보세요.\n날짜, 내용이 자동으로 입력됩니다.\n\n [지금 구글 캘린더에 추가하시겠어요?](${String(url)}) `,
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
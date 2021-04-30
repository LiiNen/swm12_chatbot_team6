// index title applyStartDate applyEndDate applyOpended eventStartTime mentor
var fs= require('fs');


function writeLog(log){
	fs.readFile('./chanLog.txt','utf8',function(err,data){
		var logdata = data;
		logdata += log + '\n';
		fs.writeFile('./chanLog.txt',logdata,'utf8',function(err,data){});
	});
}

function dateFormatterForCalendar(input) {
	var date = new Date(input);
	date_month = date.getMonth()+1;
	if (date_month < 10) date_month = '0' + date_month;
	date_date = date.getDate();
	if (date_date < 10) date_date = '0' + date_date;
	return `${date.getFullYear()}${date_month}${date_date}`;
}

function textReductionForCalendar(title) {
	if (title.length > 400) {
		title = title.substr(0, 400);
	}
	return title;
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
	res += "&text=" + (obj.titlecal);
	res += "&dates=" + makeTime(obj);
	res += "&details=" + (obj.contents);
	if(obj.location == "")
		res += "&location=" + "Korea";
	else
		res += "&location=" + obj.location;
	
	res = res.replace(/,/gi,"");
	res = res.replace(/~/gi,"");
	res = res.replace(/\(/gi,"<");
	res = res.replace(/\)/gi,">");
	res = res.replace(/\[/gi,"");
	res = res.replace(/\]/gi,"");
	res = res.replace(/\{/gi,"");
	res = res.replace(/\}/gi,"");
	res = res.replace(/\s/gi,"_");
	//res = dateFormatterForCalendar(res);
	return res;
}


module.exports = function callenderView(conversationId, responsebody) {
	console.log('-----');
	
	response_json = JSON.parse(responsebody.value);
	
	var calendarObj = {titlecal : "",startDay: "", startTime: "",endDay: "",endTime: "",contents: "",location: ""}
	calendarObj.titlecal = textReductionForCalendar(response_json['title']);
	calendarObj.startDay = dateFormatterForCalendar(response_json['eventStartTime']);
	calendarObj.startTime = "" ;
	calendarObj.endDay = "";
	calendarObj.endTime = "";
	calendarObj.contents = "";//response_json['title'];
	console.log(calendarObj);
	var url = makeUrl(calendarObj);
	console.log(url);
	writeLog(url);
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
				text: `멘토링을 신청하셨나요? 조회한 멘토링을 간편하게 구글 캘린더에 등록해보세요!\n제목, 날짜는 저희가 입력해드려요😆`,
				markdown: true
			},
			{
				type: 'text',
				text: `[지금 구글 캘린더에 추가하시겠어요?](${url})`,
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
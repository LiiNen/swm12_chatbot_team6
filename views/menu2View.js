module.exports = function menu2View(conversationId) {
	console.log(conversationId);
  return {
    conversationId,
    
		"text": "Push alarm message",
		"blocks": [
			{
				"type": "header",
				"text": "Google Calendar",
				"style": "red"
			},
			{
				"type": "text",
				"text": "**구글 캘린더 [바로가기](https://calendar.google.com/calendar)**",
				"markdown": true
			}
		]
  }
}

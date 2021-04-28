class SubscriberManager{
	subscriberList;
	
	//subscriberKeywordList;
	constructor(){
		if(!SubscriberManager.instance){
			this.subscriberList = new Map();
	
			SubscriberManager.instance = this;
		}
		return SubscriberManager.instance;
	}
	
	add(user, keyword){
		console.log("Add Subscriber : ",user);
		console.log(keyword);
		this.subscriberList.set(user, keyword);
		console.log("Current Subscriber -")
		console.log(this.subscriberList);
		
	}
	
	send(){
		
	}
}
module.exports = SubscriberManager;
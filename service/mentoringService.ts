import Queue from 'bull';
import Mentoring from '../database/scheme/Mentoring';
import User from '../database/scheme/User';
import kakaoiapi from '../kakaoiapi';

const keywordQueue=Queue('keyword querying queue')
const notiSendQueue=Queue('notification send queue')

const libKakaoWork = require('../libs/kakaoWork');
const alamView = require('../views/alamView');

function intersect(a, b) {
  var setB = new Set(b);
  return [...new Set(a)].filter(x => setB.has(x));
}

keywordQueue.process(async function(job, done){

  const mentoringInfo = await Mentoring.findById(job.data)

  const {keywords} = (await User.aggregate()
    .project({ notiKeyword: true })
    .unwind({ path: "$notiKeyword" })
    .group({
      _id: null,
      keyword: {
        $addToSet: "$notiKeyword"
      }
    }))[0] as {keywords:string[]}

  job.progress(50);

  const existKeywords=keywords.filter((v,i,a)=>mentoringInfo.content.includes(v)||mentoringInfo.title.includes(v))
  job.progress(60);
  const subscribers = await User.find({
    notiKeyword: {$in:existKeywords},
    $expr:{
      $gt:[
        { $size: { $setIntersection: ['$notiKeyword', existKeywords] } },
        2
      ]
    }
  })
  job.progress(70);

  await notiSendQueue.addBulk(subscribers.map((v,i,a)=>{
    return {data:{
      uid:v._id,
      trgkeywords:intersect(existKeywords,v.notiKeyword),
      mentoring:mentoringInfo._id
    }}
  }))

  done();
});

notiSendQueue.process(async function(job, done){
  const userInfo = await User.findById(job.data.uid)
  const triggeredwords = job.data.trgkeywords as string[]
  const mentoringInfo = await Mentoring.findById(job.data.mentoring)

  // plz write send code here
<<<<<<< HEAD
	console.log(userInfo);
	console.log(triggeredwords);
	console.log(mentoringInfo);
	libKakaoWork.sendMessage(alamView(userInfo));
	
	const conversation = await libKakaoWork.openConversations({ userId: userInfo })
	await libKakaoWork.sendMessage(alamView(conversation.id, mentoringInfo));
	//await libKakaoWork.sendMessage(alamView());

  done();
=======
  const conver_room = await kakaoiapi.conversations.open(Number.parseInt(userInfo.worksID))
  await kakaoiapi.messages.send(conver_room.id,mentoringInfo.title+"!!!! wa!!!!")
  done()
>>>>>>> 043483d881bfb113e5f7c52377b69eb2dcc15f65
});

export {
  keywordQueue,
  notiSendQueue
}
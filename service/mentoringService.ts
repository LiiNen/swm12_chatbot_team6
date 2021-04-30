import Queue from 'bull';
import Mentoring from '../database/scheme/Mentoring';
import User from '../database/scheme/User';
import kakaoiapi from '../kakaoiapi';

const keywordQueue=Queue('keyword-querying-queue')
// const notiSendQueue=Queue('notification-send-queue')

const libKakaoWork = require('../libs/kakaoWork');
const alamView = require('../views/alamView');

function intersect(a, b) {
  var setB = new Set(b);
  return [...new Set(a)].filter(x => setB.has(x));
}

keywordQueue.process(async function(job, done){
  const mentoringInfo = await Mentoring.findById(job.data.id)

  const {keywords} = (await User.aggregate()
    .project({ notiKeyword: true })
    .unwind({ path: "$notiKeyword" })
    .group({
      _id: null,
      keywords: {
        $addToSet: "$notiKeyword"
      }
    }))[0] as {keywords:string[]}

  const existKeywords=keywords.filter((v,i,a)=>(mentoringInfo.content??"").includes(v)||mentoringInfo.title.replace(/\s/g,'').includes(v))
  job.progress(60);
  const subscribers = await User.find({
	  $expr:{
		  $gt:[
			  { 
				  $size: 
				  { 
					  $setIntersection: ['$notiKeyword', existKeywords] }
			  },
			  0]
	  }
  })
  subscribers.forEach(async(v,i,a)=>{
	  const trgke=intersect(existKeywords,v.notiKeyword).sort().reverse()
	  
  const conver_room = await kakaoiapi.conversations.open(Number.parseInt(v.worksID))
	  let prvtext=`${trgke[0]} 외 ${trgke.length-1}개 키워드가 해당되는 강좌가 올라왔습니다!`
	  if(trgke.length==1)prvtext=`${trgke[0]} 키워드가 해당되는 강좌가 올라왔습니다!`
  await kakaoiapi.messages.send(conver_room.id,prvtext,alamView(conver_room.id,mentoringInfo).blocks);
  })
//  await notiSendQueue.addBulk(resii)
  done()
});

// notiSendQueue.process(async function(job, done){
//   const userInfo = await User.findById(job.data.uid)
//   const triggeredwords = job.data.trgkeywords as string[]
//   const mentoringInfo = await Mentoring.findById(job.data.mentoring)
// console.log("TINOTINOTI")
//   // plz write send code here
//   const conver_room = await kakaoiapi.conversations.open(Number.parseInt(userInfo.worksID))
// console.log("TINOTINOTI2")
//   await kakaoiapi.messages.send(conver_room.id,mentoringInfo.title+"!!!! wa!!!!",alamView(conver_room.id,mentoringInfo).blocks);
//   done()
// });

keywordQueue.on('completed', function(job, result) {
  console.log(`Job ${job.data.id} completed!`);
  job.remove();
});

// notiSendQueue.on('failed', function(job, err){
//   console.log(`Failed!`,err);
// })
// notiSendQueue.on('stalled', function(job){
//   console.log('Stalled!');
//   // A job has been marked as stalled. This is useful for debugging job
//   // workers that crash or pause the event loop.
// })
// notiSendQueue.on('error', function(error) {
//   console.log(error)
// })
// notiSendQueue.on('completed', function(job, result) {
//   console.log(`Send ${job.id} completed! Result: ${result.messages.user_id}`);
//   job.remove();
// });

keywordQueue.obliterate({ force: true });
// notiSendQueue.obliterate({ force: true });


export {
  keywordQueue,
  // notiSendQueue
}
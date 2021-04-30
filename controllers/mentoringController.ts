import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import Mentoring, { IMentoring, IMentoringSchema } from '../database/scheme/Mentoring';
import { keywordQueue } from '../service/mentoringService';

export class Controller {
  async create(
    req: Request<unknown, unknown, IMentoring|IMentoring[]>,
    res: Response
  ): Promise<void> {
    // let result={duplicated:[],created:[]}
    let lii:IMentoring[]=[]
    if(Array.isArray(req.body)){
      lii=req.body;
    }else{
      lii=[req.body]
    }   
    lii.forEach(async (v,i,a)=>{
      const res=await Mentoring.findOne({index: v.index});
      if(res==null){
        const doc = (new Mentoring(v));
        doc.save();
		console.log("In Post ", doc.id);
        const job = await keywordQueue.add({id:doc.id});
	  // console.log("In Post ", job);
      }else{
        await Mentoring.updateOne({index: v.index}, v);
      }
      
    })
    res.status(200).end()    
  }

  async read(
    req: Request< unknown, FilterQuery<IMentoringSchema>, unknown>,
    res: Response
  ): Promise<void> {
    const qre = await Mentoring.find(req.query);
    res.json(qre).end();    
  }

  async update(
    req: Request<unknown, unknown, IMentoring|IMentoring[]>,
    res: Response
  ): Promise<void> {
    let lii:IMentoring[]=[]
    if(Array.isArray(req.body)){
      lii=req.body;
    }else{
      lii=[req.body]
    }   
    lii.forEach((v,i,a)=>{
      Mentoring.findOneAndUpdate({index:v.index},v);
    })
    res.status(200).end()
  }

  async delete(
    req: Request<unknown, unknown, {index:number}>,
    res: Response
  ): Promise<void> {
    await Mentoring.deleteOne({"index":req.body.index});
    res.status(200).end()
  }

}

export default new Controller();
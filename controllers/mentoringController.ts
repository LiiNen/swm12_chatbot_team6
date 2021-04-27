import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import Mentoring, { IMentoring, IMentoringSchema } from '../database/scheme/Mentoring';

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
      await Mentoring.updateOne({index: v.index}, v, {upsert: true, setDefaultsOnInsert: true});
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
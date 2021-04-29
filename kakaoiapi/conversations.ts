import got from 'got';
import {ApiError,User} from './types';
import {client} from './index';
import {Conversation} from './types';

export async function open(user_id?:number,user_ids?:number[]){
    let data={}
    if(user_id!=null && typeof user_id !== "undefined"){
        data["user_id"]=user_id
    }
    if (user_ids!=null && typeof user_ids !== "undefined"){
        data["user_ids"]=user_ids
    }
    const {body} = await client.post("v1/conversations.open",{
        json:data,
        responseType:"json"
    })
    const realbody=body as {
        success:boolean,
        conversation?:Conversation,
        error?:ApiError
    };
    if(realbody.success){
        return realbody.conversation;
    }else{
        throw realbody.error;
    }
    // throw new Error("Both parameter is empty")
}
export async function list(appkey:string,limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}
export async function users(appkey:string,limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}
export async function invite(appkey:string,limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}
export async function kick(appkey:string,limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}

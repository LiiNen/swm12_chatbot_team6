
import {client} from './index';
import { ApiError, Message } from './types';

export async function send(conversation_id:string,text:string,blocks?:Object[]){
    const data ={
        conversation_id,text
    }
    if(blocks)data["blocks"]=blocks;
    const {body} = await client.post("v1/messages.send",{
        json:data,
        responseType:"json"
    })
    const realbody=body as {
        success:boolean,
        message?:Message,
        error?:ApiError
    };
    if(realbody.success){
        return realbody.message;
    }else{
        throw realbody.error;
    }
}
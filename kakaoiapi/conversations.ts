import got from 'got';
import {ApiError,User} from './types';


const conversations = {
    async open(appkey:string,user_id?:number,user_ids?:number[]){
        if(user_id!=null && typeof user_id !== "undefined"){
            
        }
        else if (user_ids!=null && typeof user_ids !== "undefined"){
    
        }
        throw new Error("Not Implemented")
    },
    async list(appkey:string,limit?:string,cursor?:string){
        throw new Error("Not Implemented")
    },
    async users(appkey:string,limit?:string,cursor?:string){
        throw new Error("Not Implemented")
    },
    async invite(appkey:string,limit?:string,cursor?:string){
        throw new Error("Not Implemented")
    },
    async kick(appkey:string,limit?:string,cursor?:string){
        throw new Error("Not Implemented")
    }
}


export default conversations;
import got from 'got';
import {ApiError,User} from './types';

export async function info(appkey:string,user_id:string){
    const {body} = await got.get("https://api.kakaowork.com/v1/users.info",{
        headers:{
            Authorization:"Bearer "+appkey
        },
        searchParams:{
            user_id:user_id
        },
        responseType:"json"
    })
    const realbody=body as {
        success:boolean,
        user?:User,
        error?:ApiError
    };
    if(realbody.success){
        return realbody.user;
    }else{
        throw realbody.error;
    }
}
export async function find_by_email(appkey:string,email:string){
    const {body} = await got.get("https://api.kakaowork.com/v1/users.find_by_email",{
        headers:{
            Authorization:"Bearer "+appkey
        },
        searchParams:{
            email:email
        },
        responseType:"json"
    })
    const realbody=body as {
        success:boolean,
        user?:User,
        error?:ApiError
    };
    if(realbody.success){
        return realbody.user;
    }else{
        throw realbody.error;
    }
}
export async function find_by_phone_number(appkey:string,phone_number:string){
    const {body} = await got.get("https://api.kakaowork.com/v1/users.find_by_phone_number",{
        headers:{
            Authorization:"Bearer "+appkey
        },
        searchParams:{
            phone_number:phone_number
        },
        responseType:"json"
    })
    const realbody=body as {
        success:boolean,
        user?:User,
        error?:ApiError
    };
    if(realbody.success){
        return realbody.user;
    }else{
        throw realbody.error;
    }
}
export async function list(appkey:string,limit?:string,cursor?:string){
    const {body} = await got.get("https://api.kakaowork.com/v1/users.list",{
        headers:{
            Authorization:"Bearer "+appkey
        },
        searchParams:{
            limit:limit,
            cursor:cursor
        },
        responseType:"json"
    })
    const realbody=body as {
        success:boolean,
        users?:User[],
        cursor?:string,
        error?:ApiError
    };
    if(realbody.success){
        return {users:realbody.users,cursor:cursor};
    }else{
        throw realbody.error;
    }
}
export async function set_work_time(appkey:string,limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}
export async function set_vacation_time(appkey:string,limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}

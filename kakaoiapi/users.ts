import got from 'got';
import {ApiError,User} from './types';
import {client} from './index';

export async function info(user_id:string){
    const {body} = await client.get("v1/users.info",{
        searchParams:{
            user_id
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
export async function find_by_email(email:string){
    const {body} = await client.get("v1/users.find_by_email",{
        searchParams:{
            email
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
export async function find_by_phone_number(phone_number:string){
    const {body} = await client.get("v1/users.find_by_phone_number",{
        searchParams:{
            phone_number
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
export async function list(limit?:string,cursor?:string){
    const {body} = await client.get("v1/users.list",{
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
export async function set_work_time(limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}
export async function set_vacation_time(limit?:string,cursor?:string){
    throw new Error("Not Implemented")
}

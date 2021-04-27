import {
  Model,
  Document,
  Schema,
  model
} from 'mongoose';
import { ObjectID } from 'bson';
import { IMentoring } from './Mentoring';

export interface IUser {
  worksID: string;
  email?: string;
  notiKeyword: string[];
  appliedMentoring: (IMentoring|ObjectID|string)[];
}

export const UserSchema: Schema = new Schema({
  worksID: { type: String, require: true },
  email: { type: String },
  notiKeyword: { 
    type: [{ type: String }],
    default: []
  },
  appliedMentoring: { 
    type: [{ type: Schema.Types.ObjectId, ref: 'Mentoring' }],
    default: []
  }
});

/**
 * @description User 스키마에 대한 메서드 ( document )
 */
export interface IUserSchema extends IUser, Document {
}

/**
 * @description User 모델에 대한 정적 메서드 ( collection )
 */
export interface IUserModel extends Model < IUserSchema > {
}

export default model<IUserSchema>('User', UserSchema) as IUserModel;
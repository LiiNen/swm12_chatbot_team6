import {
  Model,
  Document,
  Schema,
  model,
  HookNextFunction,
  Aggregate,
} from 'mongoose';
import {
  ObjectID
} from 'bson';
import { IUser } from './User';

export interface IMentoring {
  /**
   * qustnrSn 입니다
   */
  index: number;
  title: string;
  applyStartDate:Date;
  applyEndDate:Date;
  /**
   * 마감되면 false입니다.
   */
  applyOpened:boolean;
  /**
   * 글이 지워지면 true입니다.
   */
  deleted:boolean;
  applicants?:({applicant:ObjectID|IUser|string, apply_time:Date})[];
  /**
   * may bigger than applicants' length
   */
  applicantNum: number;
  maxApplicantNum?: number;
  eventStartTime: Date;
  /**
   * 특강 시간이 알려져있을때 eventEndTime값이 존재 합니다.
   * 날짜만 알려져 있다면 eventEndTime은 없고 eventStartTime의 날짜값만 신뢰합니다.
   */
  eventEndTime?: Date;
  mentor: string;
  content: string;
  /**
   * 특강의 등록일 입니다. 날짜값만 신뢰합니다.
   */
  createdTime:Date;
}

export const MentoringSchema: Schema = new Schema({
  index: { type: Number, required: true, index: true },
  title: { type: String, required: true },
  applyStartDate: { type: Date, required: true },
  applyEndDate: { type: Date, required: true },
  applyOpened: { type: Boolean, required: true },
  deleted: { type: Boolean, default: false },
  eventStartTime: { type: Date, required: true },
  eventEndTime: { type: Date, required: false },
  applicants: { type: Array, required: false },
  applicantNum: { type: Number, required: true },
  maxApplicantNum: { type: Number, required: false },
  mentor: { type: String, required: true },
  createdTime:  { type: Date, required: false },
});

const TESTUSER_NAME = process.env.TESTUSER_NAME || 'testuser';
const TOKEN_EXPIRATION = Number(process.env.TOKEN_EXPIRATION) || 600000;

/**
 * @description Mentoring 스키마에 대한 메서드 ( document )
 */
export interface IMentoringSchema extends IMentoring, Document {}

/**
 * @description Mentoring 모델에 대한 정적 메서드 ( collection )
 */
export interface IMentoringModel extends Model<IMentoringSchema> {}

export default model <IMentoringSchema> ('Mentoring', MentoringSchema) as IMentoringModel;
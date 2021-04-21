import mongoose from 'mongoose';
import Log from '../util/Log';
import DBHelper from './DBHelper';
/**
 * @description Mongo DB 관리 클래스
 */
class MongoDBHelper extends DBHelper<mongoose.Connection> {
  private db: mongoose.Connection;

  public readonly env: string = process.env.NODE_ENV || 'development'; // 개발 환경
  public readonly dbUri: string =
    process.env.DB_URI ||
    process.env.MONGODB_URI ||
    'mongodb://localhost/NEM-TEMPLATE-V2'; // DB URL
  /**
   * @description MongoDB 활성화
   * @param {string}url MongoDB URL
   */
  public init(url?: string): void {
    this.db = mongoose.connection;
    // 접속 실패 시
    this.db.on('error', () => {
      Log.e('Mongo DB connected fail');
      Log.e('Server stop');
      this.isDatabaseConnect = false;
      process.exit();
    });
    // 접속 성공 시
    this.db.once('open', () => {
      Log.c('Mongo DB connected');
      this.isDatabaseConnect = true;
    });

    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(url || this.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  /**
   * @description DB 객체 반환
   * @returns {mongoose.Connection} DB 객체
   */
  public getDB(): mongoose.Connection {
    return this.db;
  }
}
export default new MongoDBHelper();
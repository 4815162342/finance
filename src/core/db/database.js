import Database from './';
import {databaseSchemas} from './constants';

const db = new Database(databaseSchemas[0]);

export default db;
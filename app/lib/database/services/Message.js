import database from '..';
import { MESSAGES_TABLE } from '../model/Message';

const getCollection = db => db.get(MESSAGES_TABLE);

export const getMessageById = async messageId => {
	const db = database.active;
	const messageCollection = getCollection(db);
	try {
		const result = await messageCollection.find(messageId);
		return result;
	} catch (error) {
		return null;
	}
};

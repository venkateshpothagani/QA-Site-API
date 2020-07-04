import { Document } from 'mongoose';
import { downvote } from '../controllers/info/question.controller';

export const documentFormatter = (document: Document) => {
	return {
		...document.toJSON(),
		upvotes: document.toJSON().upvotes.length,
		downvotes: document.toJSON().downvotes.length,
	};
};

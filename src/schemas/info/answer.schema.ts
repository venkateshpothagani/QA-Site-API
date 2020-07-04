import { Schema, model } from 'mongoose';
import { User } from '../auth/user.schema';
import { Question } from './question.schema';

const AnswerSchema: Schema = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true, ref: User },
	questionId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: Question,
	},
	username: { type: String, required: true },
	date: { type: Date, required: true },
	description: { type: String, required: true },
	upvotes: [Schema.Types.ObjectId],
	downvotes: [Schema.Types.ObjectId],
});

export const Answer = model('Answer', AnswerSchema);

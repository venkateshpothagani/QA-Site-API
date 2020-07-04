import { Schema, model } from 'mongoose';
import { User } from '../auth/user.schema';

const QuestionSchema: Schema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: User,
	},
	username: { type: String, required: true },
	date: { type: Date, required: true },
	upvotes: [Schema.Types.ObjectId],
	downvotes: [Schema.Types.ObjectId],
});

export const Question = model('Question', QuestionSchema);

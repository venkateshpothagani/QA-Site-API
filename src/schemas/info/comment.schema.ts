import { Schema, model } from 'mongoose';
import { User } from '../auth/user.schema';

const CommentSchema: Schema = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true, ref: User },
	targetId: { type: Schema.Types.ObjectId, required: true },
	username: { type: String, required: true },
	date: { type: String, required: true },
	description: { type: String, required: true },
	upvotes: [Schema.Types.ObjectId],
	downvotes: [Schema.Types.ObjectId],
});

export const Comments = model('Comments', CommentSchema);

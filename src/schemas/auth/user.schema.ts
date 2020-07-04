import { Schema, model } from 'mongoose';

const UserSchema: Schema = new Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	date: { type: Date, required: true },
	dob: { type: Date, required: true },
	age: {
		year: { type: Number, required: true },
		month: { type: Number, required: true },
		day: { type: Number, required: true },
	},
});

export const User = model('User', UserSchema);

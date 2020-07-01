import * as mongoose from 'mongoose';

// TODO Add more optional fields eg:- DOB, Age, Gender ....
const UserSchema: mongoose.Schema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export const User = mongoose.model('User', UserSchema);

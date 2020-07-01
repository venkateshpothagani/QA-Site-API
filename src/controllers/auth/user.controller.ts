import express from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../../schemas/auth/user.schema';
import { UserModel } from '../../models/User.model';
import mongoose from 'mongoose';

interface UpdateOneResult {
	nModified: number;
	n: number;
	ok: number;
}

// User signup
export const signup = async (req: express.Request, res: express.Response) => {
	if (!req.body.username || !req.body.password || !req.body.email) {
		res.status(400).json({
			message: 'Bad Request',
			data: 'Failed to get data from request body.',
		});
	}
	try {
		// Creates hash value to password
		const hash: string = await encrypt(req.body.password);

		const userData: UserModel = {
			username: req.body.username,
			email: req.body.email,
			password: hash,
		};

		// Create new instance to Model by user data to its contructor to database
		const document = await new User(userData).save();
		console.log(document);
		res.status(201).json({
			message: 'Account Created',
			data: {
				username: document.toJSON().username,
				email: document.toJSON().email,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
			data: error,
		});
	}
};

// User signin
export const signin = async (req: express.Request, res: express.Response) => {
	if (!req.body.username || !req.body.password) {
		res.status(400).json({
			message: 'Bad Request',
			data: 'Failed to get data from request body.',
		});
	}
	try {
		const document = await User.findOne({ username: req.body.username });
		if (document) {
			const validUser: boolean = await bcrypt.compare(
				req.body.password,
				document.toJSON().password
			);
			if (validUser) {
				const token = jwt.sign(
					{
						email: document.toJSON().email,
						username: document.toJSON().username,
						userId: document.toJSON()._id,
					},
					'very_long_super_secret_key',
					{
						expiresIn: '1h',
					}
				);

				res.status(200).json({
					message: 'User Logged in',
					data: {
						token: token,
						username: document.toJSON().username,
					},
				});
			} else {
				res.status(401).json({
					message: 'Authentication Failed',
					data: { message: 'Wrong Password' }, // TODO Remove message from data in response
				});
			}
		} else {
			res.status(401).json({
				message: 'Authentication Failed',
				data: { message: 'Invalid Username' }, // TODO Remove message from data in response
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
			data: error,
		});
	}
};

// Update the user email
export const updateEmail = async (
	req: express.Request,
	res: express.Response
) => {
	if (!req.body.newValue || !req.body.username) {
		res.status(400).json({
			message: 'Bad Request',
			data: 'Failed to get email from request body.',
		});
	} else {
		try {
			const username = req.body.username;
			const email = req.body.newValue;
			const result = await User.updateOne(
				{ username: username },
				{ email: email }
			);
			response(res, result);
		} catch (error) {
			res.status(500).json({
				message: 'Internal Server Error',
				data: { message: 'Unknown Error Occured' },
			});
		}
	}
};

// Update the user password
export const updatePassword = async (
	req: express.Request,
	res: express.Response
) => {
	if (!req.body.newValue || !req.body.username) {
		res.status(400).json({
			message: 'Bad Request',
			data: 'Failed to get password from request body.',
		});
	} else {
		try {
			const password = await encrypt(req.body.newValue);
			const username = req.body.username;
			const result = await User.updateOne(
				{ username: username },
				{ password: password }
			);
			response(res, result);
		} catch (error) {
			res.status(500).json({
				message: 'Internal Server Error',
				data: error,
			});
		}
	}
};

// Update the user username
export const updateUsername = async (
	req: express.Request,
	res: express.Response
) => {
	if (!req.body.newValue || !req.body.username) {
		res.status(400).json({
			message: 'Bad Request',
			data: 'Failed to get username from request body.',
		});
	} else {
		try {
			const newUsername: string = req.body.newValue;
			const username: string = req.body.username;
			const result = await User.updateOne(
				{ username: username },
				{ username: newUsername }
			);

			response(res, result);
		} catch (error) {
			res.status(500).json({
				message: 'Internal Server Error',
				data: error,
			});
		}
	}
};

// Email for frontend validation to avoid duplicate emails
export const checkEmail = async (
	req: express.Request,
	res: express.Response
) => {
	if (!req.body.email) {
		res.status(400).json({
			message: 'Bad Request',
			data: 'Failed to get email from request body.',
		});
	}
	try {
		const result: mongoose.Document | null = await User.findOne({
			email: req.body.email,
		});
		// if result is null means that the email isn't present in DB
		if (result) {
			res.status(200).json({
				message: 'Email Already Exists',
				data: { isValid: false },
			});
		} else {
			res.status(200).json({
				message: 'Valid Email',
				data: { isValid: true },
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
			data: error,
		});
	}
};

// Username for frontend validation to avoid duplicate usernames
export const checkUsername = async (
	req: express.Request,
	res: express.Response
) => {
	if (!req.body.username) {
		res.status(400).json({
			message: 'Bad Request',
			data: 'Failed to get username from request body.',
		});
	}

	try {
		const result: mongoose.Document | null = await User.findOne({
			username: req.body.username,
		});
		// if result is null means that the email isn't present in DB
		if (result) {
			res.status(200).json({
				message: 'Username Already Exists',
				data: { isValid: false },
			});
		} else {
			res.status(200).json({
				message: 'Valid Email',
				data: { isValid: true },
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
			data: error,
		});
	}
};

// Utility functions
const response = (res: express.Response, result: UpdateOneResult) => {
	if (result.nModified) {
		res.status(200).json({
			message: 'Value Successfully Updated',
			data: { status: 1 },
		});
	} else if (result.n) {
		res.status(200).json({
			message: "Value wasn't updated ",
			data: { status: -1 },
		});
	} else {
		res.status(401).json({
			message: 'Not Authorized to Update',
			data: { status: 0 },
		});
	}
};

const encrypt = (password: string) => {
	return bcrypt.hash(password, 10);
};

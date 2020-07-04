import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../../schemas/auth/user.schema';
import * as error from '../../utilities/response';
import * as code from '../../utilities/status-code';
import { calculateAge } from '../../utilities/age-calculator';

const ENCRYPTION_ROUNDS: number = 10;

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description To create a account for user
 */
export const signup = async (req: Request, res: Response) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const dob = req.body.dob; // MM-DD-YYYY
	const age = calculateAge(dob);

	if (!username || !password || !email || !dob) {
		return error.badRequestError(res);
	}

	try {
		// Creates hash value to password
		const hash: string = await bcrypt.hash(password, ENCRYPTION_ROUNDS);

		const userData = {
			username: username,
			email: email,
			password: hash,
			date: new Date(),
			dob: dob,
			age: { ...age },
		};

		const document = await new User(userData).save();

		return res.status(code.CREATED).json({
			message: 'Account Created',
			data: {
				...document.toJSON(),
				password: '********',
			},
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description Signin
 */
export const signin = async (req: Request, res: Response) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return error.badRequestError(res);
	}
	try {
		const document = await User.findOne({ username: username });

		if (document) {
			const validUser: boolean = await bcrypt.compare(
				password,
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

				return res.status(code.OK).json({
					message: 'User Logged in',
					data: {
						token: token,
						username: document.toJSON().username,
						userId: document.toJSON()._id,
					},
				});
			}

			return res.status(code.UNAUTHORIZED).json({
				message: 'Authentication Failed',
			});
		}

		return res.status(code.UNAUTHORIZED).json({
			message: 'Authentication Failed',
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description Update user email
 */
export const updateEmail = async (req: Request, res: Response) => {
	const id = req.body.userId; // From JWT Token
	const email = req.body.newEmail; // From client

	if (!email || !id) {
		return error.badRequestError(res);
	}

	try {
		const document = await User.findByIdAndUpdate(id, { email: email });

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Email Updated',
			data: {
				previous: {
					...document.toJSON(),
					password: '********',
				},
				updated: {
					...(await User.findById(id))?.toJSON(),
					password: '********',
				},
			},
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description Update password
 */
export const updatePassword = async (req: Request, res: Response) => {
	const id = req.body.userId; // From JWT Token
	const password = req.body.newPassword; // From client

	if (!password || !id) {
		return error.badRequestError(res);
	}

	try {
		const hash = await bcrypt.hash(password, ENCRYPTION_ROUNDS);
		const document = await User.findByIdAndUpdate(id, {
			password: hash,
		});

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Password Updated',
			data: {
				previous: {
					...document.toJSON(),
					password: '********',
				},
				updated: {
					...(await User.findById(id))?.toJSON(),
					password: '********',
				},
			},
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description Update user date of birth
 */
export const updateDOB = async (req: Request, res: Response) => {
	const id = req.body.userId; // From JWT Token
	const dob = req.body.newDOB; // From client

	if (!id || !dob) {
		return error.badRequestError(res);
	}

	try {
		const age = { ...calculateAge(dob) };
		const document = await User.findByIdAndUpdate(id, {
			dob: dob,
			age: age,
		});

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'DOB Updated',
			data: {
				previous: {
					...document.toJSON(),
					password: '********',
				},
				updated: {
					...(await User.findById(id))?.toJSON(),
					password: '********',
				},
			},
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description To update username
 */
export const updateUsername = async (req: Request, res: Response) => {
	const id = req.body.userId; // From JWT Token
	const username = req.body.newUsername; // From client

	if (!id || !username) {
		return error.badRequestError(res);
	}

	try {
		const document = await User.findByIdAndUpdate(id, {
			username: username,
		});

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Username Updated',
			data: {
				previous: {
					...document.toJSON(),
					password: '********',
				},
				updated: {
					...(await User.findById(id))?.toJSON(),
					password: '********',
				},
			},
		});
	} catch (err) {
		error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description To remove user account and Authentication is required
 */
export const remove = async (req: Request, res: Response) => {
	/**
	 * userId from extracted from JWT Token
	 */
	const id = req.body.userId;
	if (!id) {
		return error.badRequestError(res);
	}

	try {
		const document = await User.findByIdAndDelete(id);

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Deleted',
			data: {
				...document.toJSON(),
				password: '********',
			},
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description update all user details at once
 */
export const updateProfile = async (req: Request, res: Response) => {
	const id = req.body.UserId;
	const username = req.body.newUsername;
	const email = req.body.newEmail;
	const dob = req.body.newDOB;

	if (!username || !email || !dob || !id) {
		return error.badRequestError(res);
	}

	try {
		const oldDocument = await User.findByIdAndUpdate(id, {
			username: username,
			email: email,
			dob: dob,
		});

		const newDocument = await User.findById(id);

		if (!oldDocument || !newDocument) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Profile Updated',
			data: {
				previous: oldDocument,
				updated: newDocument,
			},
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description Email for frontend validation to avoid duplicate emails
 */
export const checkEmail = async (req: Request, res: Response) => {
	const email = req.body.email;

	if (!email) {
		return error.badRequestError(res);
	}

	try {
		const document = await User.findOne({ email: email });
		// if document is null means that the email isn't present in DB
		if (document) {
			return res.status(code.OK).json({
				message: 'Email Already Exists',
				data: { isValid: false },
			});
		}

		return res.status(code.OK).json({
			message: 'Valid Email',
			data: { isValid: true },
		});
	} catch (err) {
		error.internalServerError(res, err);
	}
};

/**
 *
 * @param req express.Request
 * @param res express.Response
 * @description Username for frontend validation to avoid duplicate usernames
 */
export const checkUsername = async (req: Request, res: Response) => {
	const username = req.body.username;

	if (!username) {
		return error.badRequestError(res);
	}

	try {
		const document = await User.findOne({ username: username });
		// if document is null means that the username isn't present in DB
		if (document) {
			return res.status(200).json({
				message: 'Username Already Exists',
				data: { isValid: false },
			});
		}

		return res.status(200).json({
			message: 'Valid Username',
			data: { isValid: true },
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

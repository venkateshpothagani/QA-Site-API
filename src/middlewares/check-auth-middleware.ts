import express from 'express';
import * as jwt from 'jsonwebtoken';

interface DecodedData {
	email: string;
	username: string;
	userId: string;
	iat: string;
	exp: string;
}

export const checkAuth = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (!req.headers.authorization) {
		feedback(res, 401, 'You are not Authenticated');
	} else {
		try {
			const token = req.headers.authorization.split(' ')[1];
			if (token) {
				const decodedData = jwt.verify(
					token,
					'very_long_super_secret_key'
				) as DecodedData;
				req.body = { ...req.body,  ...decodedData };
				next();
			} else {
				feedback(res, 401, 'Invalid Token');
			}
		} catch (error) {
			feedback(res, 401, 'You are not Authenticated');
		}
	}
};

// Utility function
const feedback = (res: express.Response, code: number, message: string) => {
	res.status(code).json({
		message: message,
		data: { message: message },
	});
};

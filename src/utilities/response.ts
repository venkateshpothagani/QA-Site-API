import { Response } from 'express';
import * as code from './status-code';

export const badRequestError = (res: Response) => {
	return res.status(code.BAD_REQUEST).json({
		message: 'Bad Request Error',
		error: { message: 'Failed to get data from request body.' },
	});
};

export const notFoundError = (res: Response) => {
	return res.status(code.NOT_FOUND).json({
		message: 'Not Found Error',
		error: { message: 'No Document Found Given Id' },
	});
};

export const internalServerError = (res: Response, error: any) => {
	return res.status(code.INTERNAL_SERVER_ERROR).json({
		message: 'Internal Server Error',
		error: { message: error },
	});
};

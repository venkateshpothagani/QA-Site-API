import { Request, Response } from 'express';
import { documentFormatter } from '../../utilities/formatter';
import { Answer } from '../../schemas/info/answer.schema';
import { downvoteController } from './shared/downvote.controller';
import { upvoteController } from './shared/upvote.controller';
import * as error from '../../utilities/response';
import * as code from '../../utilities/status-code';

/**
 * 
 * @param req express.Request
 * 
 * From JWT - userId, username
 * 
 * From Client - questionId, description
 * 
 * @param res express.Response
 * 
 * @description 
 */
export const create = async (req: Request, res: Response) => {
	const userId = req.body.userId;
	const questionId = req.body.id;
	const username = req.body.username;
	const description = req.body.description;

	if (!userId || !questionId || !description || !username) {
		return error.badRequestError(res);
	}

	const data = {
		userId: userId,
		questionId: questionId,
		description: description,
		username: username,
		date: new Date(),
		upvotes: [],
		downvotes: [],
	};

	try {
		const document = await new Answer(data).save();

		return res.status(code.CREATED).json({
			message: 'Answer Added',
			data: documentFormatter(document),
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 * req contains id parameter (question id)
 */
export const getAll = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return error.badRequestError(res);
	}
	try {
		const documents = await Answer.find({ questionId: id });

		const result = documents.map((document) => {
			return documentFormatter(document);
		});

		return res.status(code.OK).json({
			message: 'Answers Fetched',
			data: result,
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 * req body contains id parameter (user id)
 */
export const getUserAll = async (req: Request, res: Response) => {
	const id = req.body.userId;

	if (!id) {
		return error.badRequestError(res);
	}

	try {
		const documents = await Answer.find({ userId: id });

		const result = documents.map((document) => {
			return documentFormatter(document);
		});

		return res.status(code.OK).json({
			message: 'Answers Fetched',
			data: result,
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 * req contains id parameter (answer id)
 */
export const getOne = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return error.badRequestError(res);
	}

	try {
		const document = await Answer.findById(id);

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Answer Fetched',
			data: documentFormatter(document),
		});
	} catch (err) {
		error.internalServerError(res, err);
	}
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 * req contains id parameter (question id)
 * 
 * req body contains description
 */
export const update = async (req: Request, res: Response) => {
	const id = req.body.id;
	const newDescription = req.body.description;

	if (!id || !newDescription) {
		return error.badRequestError(res);
	}

	try {
		const document = await Answer.findByIdAndUpdate(id, {
			description: newDescription,
		});

		const currentDocument = await Answer.findById(id);

		if (!document || !currentDocument) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Updated',
			data: {
				previous: documentFormatter(document),
				current: documentFormatter(currentDocument),
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
 * 
 * req contains id parameter (answer id)
 */
export const remove = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		error.badRequestError(res);
	}

	try {
		const document = await Answer.findByIdAndDelete(id);

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Deleted',
			data: documentFormatter(document),
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 */
export const upvote = async (req: Request, res: Response) => {
	return upvoteController(req, res, Answer);
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 */
export const downvote = async (req: Request, res: Response) => {
	return downvoteController(req, res, Answer);
};

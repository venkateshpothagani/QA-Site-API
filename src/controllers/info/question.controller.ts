import { Request, Response } from 'express';
import { Question } from '../../schemas/info/question.schema';
import { documentFormatter } from '../../utilities/formatter';
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
 * From Client - title, description
 * 
 * @param res express.Response
 */
export const create = async (req: Request, res: Response) => {
	const title = req.body.title;
	const description = req.body.description;
	const userId = req.body.userId;
	const username = req.body.username;

	if (title && description && userId && username) {
		const data = {
			title: title,
			description: description,
			userId: userId,
			username: username,
			date: new Date(),
			upvotes: [],
			downvotes: [],
		};

		try {
			const document = await new Question(data).save();

			return res.status(code.CREATED).json({
				message: 'Question Added',
				data: documentFormatter(document),
			});
		} catch (err) {
			return error.internalServerError(res, err);
		}
	}

	return error.badRequestError(res);
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 */
export const getAll = async (req: Request, res: Response) => {
	try {
		const documents = await Question.find({});

		const result = documents.map((document) => {
			return documentFormatter(document);
		});

		return res.status(code.OK).json({
			message: 'Questions Fetched',
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
		const documents = await Question.find({ userId: id });

		const result = documents.map((document) => {
			return documentFormatter(document);
		});

		return res.status(code.OK).json({
			message: 'Questions Fetched',
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
 * req contains id parameter (question id)
 */
export const getOne = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return error.badRequestError(res);
	}

	try {
		const document = await Question.findById(id);

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Question Fetched',
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
 * req contains id parameter (question)
 * 
 * req body contains title and description
 * 
 */
export const update = async (req: Request, res: Response) => {
	const id = req.body.featureId;
	const newTitle = req.body.title;
	const newDescription = req.body.description;

	if (!id || !newDescription || !newTitle) {
		return error.badRequestError(res);
	}

	try {
		const document = await Question.findByIdAndUpdate(id, {
			title: newTitle,
			description: newDescription,
		});

		const currentDocument = await Question.findById(id);

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
 * req contains id parameter (question id)
 */
export const remove = async (req: Request, res: Response) => {
	const id = req.body.featureId;

	if (!id) {
		return error.badRequestError(res);
	}

	try {
		const document = await Question.findByIdAndDelete(id);
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
	return upvoteController(req, res, Question);
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 */
export const downvote = async (req: Request, res: Response) => {
	return downvoteController(req, res, Question);
};

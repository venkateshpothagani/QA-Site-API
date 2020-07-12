import { Response, Request } from 'express';
import { documentFormatter } from '../../utilities/formatter';
import { Comments } from '../../schemas/info/comment.schema';
import { upvoteController } from './shared/upvote.controller';
import { downvoteController } from './shared/downvote.controller';
import * as error from '../../utilities/response';
import * as code from '../../utilities/status-code';

/**
 * 
 * @param req express.Request
 * 		
 * userId - From JWT Token
 * 
 * username - From JWT Token
 * 		
 * targetId - From Client (question or answer id)
 * 
 * description - From Client 
 * 
 * @param res express.Response
 * 
 */
export const create = async (req: Request, res: Response) => {
	const userId = req.body.userId;
	const targetId = req.body.id;
	const description = req.body.description;
	const username = req.body.username;

	if (!userId || !targetId || !description || !username) {
		return error.badRequestError(res);
	}

	const data = {
		userId: userId,
		targetId: targetId,
		username: username,
		description: description,
		date: new Date(),
		upvotes: [],
		downvotes: [],
	};

	try {
		const document = await new Comments(data).save();

		return res.status(code.CREATED).json({
			message: 'Comment Added',
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
 * req contains id parameter (question/answer id)
 */
export const getAll = async (req: Request, res: Response) => {
	const targetId = req.params.id;

	if (!targetId) {
		return error.badRequestError(res);
	}

	try {
		const documents = await Comments.find({ targetId: targetId });

		const result = documents.map((document) => {
			return documentFormatter(document);
		});

		return res.status(code.OK).json({
			message: 'Comments Fetched',
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
 * @description Fetches all comments of an user (userId can be taken JWT Auth Token)
 */
export const getUserAll = async (req: Request, res: Response) => {
	const userId = req.body.userId;

	if (!userId) {
		return error.badRequestError(res);
	}
	try {
		const documents = await Comments.find({ userId: userId });

		const result = documents.map((document) => {
			return documentFormatter(document);
		});

		return res.status(code.OK).json({
			message: 'Comments Fetched',
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
 * req contains id parameter (comment id)
 */
export const getOne = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		error.badRequestError(res);
	}

	try {
		const document = await Comments.findById(id);

		if (!document) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Comment Fetched',
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
 * req contains id parameter (comment id)
 * 
 * req body contains description of new comment
 */
export const update = async (req: Request, res: Response) => {
	const id = req.body.id;
	const description = req.body.description;

	if (!id || !description) {
		return error.badRequestError(res);
	}

	try {
		const document = await Comments.findByIdAndUpdate(id, {
			description: description,
		});

		const currentDocument = await Comments.findById(id);
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
 * req contains id parameter (comment id)
 */
export const remove = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return error.badRequestError(res);
	}
	
	try {
		const document = await Comments.findByIdAndDelete(id);

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
	return upvoteController(req, res, Comments);
};

/**
 * 
 * @param req express.Request
 * @param res express.Response
 * 
 */
export const downvote = async (req: Request, res: Response) => {
	return downvoteController(req, res, Comments);
};

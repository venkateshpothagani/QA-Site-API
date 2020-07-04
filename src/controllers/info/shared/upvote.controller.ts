import { Model, Document } from 'mongoose';
import { Request, Response } from 'express';
import { documentFormatter } from '../../../utilities/formatter';
import * as error from '../../../utilities/response';
import * as code from '../../../utilities/status-code';

/**
 * 
 * @param req express.Request
 * 
 * From JWT - userId
 * 
 * From Client - featureId
 * 
 * @param res express.Response
 * @param model express.Model
 */
export const upvoteController = async (
	req: Request,
	res: Response,
	model: Model<Document, {}>
) => {
	const id = req.body.featureId;
	const userId = req.body.userId;

	if (!id || !userId) {
		return error.badRequestError(res);
	}

	try {
		// Push id to upvote array
		// First check the id is duplicate or not
		// If it's duplicate remove from array (Removing Upvote)
		// Otherwise add id to array (Adding Upvote)

		const document = await model.findById(id);

		if (!document) {
			return error.notFoundError(res);
		}

		const upvotes: Array<object> = document.toJSON().upvotes;

		const isDuplicate = upvotes.find((upvote) => upvote == userId);

		if (!isDuplicate) {
			const document = await model.findByIdAndUpdate(id, {
				$push: {
					upvotes: userId,
				},
			});

			const currentDocument = await model.findById(id);

			if (!document || !currentDocument) {
				return error.notFoundError(res);
			}

			return res.status(code.OK).json({
				message: 'Upvote Added',
				data: {
					status: 1,
					previous: documentFormatter(document),
					current: documentFormatter(currentDocument),
				},
			});
		}

		const removeDocument = await model.findByIdAndUpdate(id, {
			$pull: {
				upvotes: userId,
			},
		});

		const currentDocument = await model.findById(id);

		if (!removeDocument || !currentDocument) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Upvote Removed',
			data: {
				status: -1,
				previous: documentFormatter(removeDocument),
				current: documentFormatter(currentDocument),
			},
		});
	} catch (err) {
		return error.internalServerError(res, err);
	}
};

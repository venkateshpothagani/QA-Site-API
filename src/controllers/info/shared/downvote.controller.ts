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
export const downvoteController = async (
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
		// Push id to downvote array
		// First check the id is duplicate or not
		// If it's duplicate remove from array (Remove Downvote)
		// Otherwise add id to array (Adding Upvote)

		const document = await model.findById(id);

		if (!document) {
			return error.notFoundError(res);
		}

		const downvotes: Array<string> = document.toJSON().downvotes;

		const isDuplicate = downvotes.find((downvote) => downvote == userId);

		if (!isDuplicate) {
			const document = await model.findByIdAndUpdate(id, {
				$push: {
					downvotes: userId,
				},
			});

			const currentDocument = await model.findById(id);

			if (!document || !currentDocument) {
				return error.notFoundError(res);
			}

			return res.status(code.OK).json({
				message: 'Downvote Added',
				data: {
					status: 1,
					previous: documentFormatter(document),
					current: documentFormatter(currentDocument),
				},
			});
		}

		const removeDocument = await model.findByIdAndUpdate(id, {
			$pull: {
				downvotes: userId,
			},
		});

		const currentDocument = await model.findById(id);

		if (!removeDocument || !currentDocument) {
			return error.notFoundError(res);
		}

		return res.status(code.OK).json({
			message: 'Downvote Removed',
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

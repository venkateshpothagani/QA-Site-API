import { Question } from '../schemas/info/question.schema';
import { Answer } from '../schemas/info/answer.schema';
import { Comments } from '../schemas/info/comment.schema';

enum Badge {
	bronze = 100,
	silver = 200,
	gold = 400,
	platinum = 700,
	diamond = 1100,
	master = 1600,
	predator = 2500,
}

let temp = Badge.predator

export const userActivity = async (username: string) => {
	const questionCount = await Question.find({
		username: username,
	}).count();
	const answerCount = await Answer.find({
		username: username,
	}).count();
	const commentCount = await Comments.find({
		username: username,
	}).count();

	return {
		questions: questionCount,
		answers: answerCount,
		comments: commentCount,
	};
};

export const currentBadge = (score: {
	questions: number;
	answers: number;
	comments: number;
}) => {
	const points =
		2 * score.comments +
		5 * score.questions +
		10 * score.answers;

    
};

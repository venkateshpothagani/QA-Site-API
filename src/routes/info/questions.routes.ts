import express from 'express';
import * as question from '../../controllers/info/question.controller';
import { checkAuth } from '../../middlewares/check-auth-middleware';

export const routes: express.Router = express.Router();

// Creates a questions
// Authentication Required
routes.post('/create', checkAuth, question.create);

// Gets all or few questions at a time
routes.get('/get-all', question.getAll);

// Gets all or few questions of a user
// Authentication Required
routes.get('/get-user-all', checkAuth, question.getUserAll);

// Get a question
routes.get('/get-one/:id', question.getOne);

// Update Question
// Authentication Required
routes.patch('/update', checkAuth, question.update);

// Delete a Question
// Authentication Required
routes.delete('/remove', checkAuth, question.remove);

// Adds a upvote
// Authentication Required
routes.post('/upvote', checkAuth, question.upvote);

// Adds a downvote
// Authentication Required
routes.post('/downvote', checkAuth, question.downvote);

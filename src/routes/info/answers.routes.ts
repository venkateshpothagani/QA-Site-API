import express from 'express';
import * as answer from '../../controllers/info/answer.controller';
import { checkAuth } from '../../middlewares/check-auth-middleware';

export const routes: express.Router = express.Router();

// Creates a answer
// Authentication Required
routes.post('/create', checkAuth, answer.create);

// Gets all or few answers at a time
routes.get('/get-all/:id', answer.getAll);

// Authentication Required
routes.get('/get-user-all', checkAuth, answer.getUserAll);

// Get a answer
routes.get('/get-one/:id', answer.getOne);

// Update answer
// Authentication Required
routes.patch('/update', checkAuth, answer.update);

// Delete a answer
// Authentication Required
routes.delete('/remove', checkAuth, answer.remove);

// Adds a upvote
// Authentication Required
routes.post('/upvote', checkAuth, answer.upvote);

// Adds a downvote
// Authentication Required
routes.post('/downvote', checkAuth, answer.downvote);

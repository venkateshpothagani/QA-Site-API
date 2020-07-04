import express from 'express';
import * as comment from '../../controllers/info/comment.controller';
import { checkAuth } from '../../middlewares/check-auth-middleware';

export const routes: express.Router = express.Router();

// Creates a comment
// Authentication Required
routes.post('/create', checkAuth, comment.create);

// Gets all or few comments at a time
routes.get('/get-all/:id', comment.getAll);

// Gets all or few comments at a time
// Authentication Required
routes.get('/get-user-all', checkAuth, comment.getUserAll);

// Get a comment
routes.get('/get-one/:id', comment.getOne);

// Update comment
// Authentication Required
routes.patch('/update', checkAuth, comment.update);

// Delete comment
// Authentication Required
routes.delete('/remove', checkAuth, comment.remove);
// Adds a upvote
// Authentication Required
routes.post('/upvote', checkAuth, comment.upvote);

// Adds a downvote
// Authentication Required
routes.post('/downvote', checkAuth, comment.downvote);
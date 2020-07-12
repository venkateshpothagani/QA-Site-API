import express from 'express';
import * as user from '../../controllers/auth/user.controller';
import { checkAuth } from '../../middlewares/check-auth-middleware';

export const routes: express.Router = express.Router();

// User signup
routes.post('/signup', user.signup);

// User signin
routes.post('/signin', user.signin);

// Email for frontend validation to avoid duplicate emails
routes.post('/check-email', user.checkEmail);

// Username for frontend validation to avoid duplicate usernames
routes.post('/check-username', user.checkUsername);

// Update the user email
routes.post('/update-email', checkAuth, user.updateEmail);

// Update the user password when user is signin
routes.post('/update-password', checkAuth, user.updatePassword);

// Update the user username when user is signin
routes.post('/update-username', checkAuth, user.updateUsername);

//  Update the user dob when user is authenticated
routes.post('/update-dob', checkAuth, user.updateDOB);

// Deletes the user when user is authenticated
routes.delete('/remove', checkAuth, user.remove);

// to send user details
routes.get('/profile/:username', user.getProfile);

// updates profile
routes.patch('/update-profile', checkAuth, user.updateProfile);

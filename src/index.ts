import express, { response } from 'express';
import mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import { cors } from './middlewares/cors.middleware';
import { routes as userRoutes } from './routes/auth/user.routes';
import { routes as questionRoutes } from './routes/info/questions.routes';
import { routes as answerRoutes } from './routes/info/answers.routes';
import { routes as commentRoutes } from './routes/info/comments.routes';

const PORT = process.env.PORT || 3000;
const app: express.Application = express();

mongoose
	.connect('mongodb://localhost:27017/QA-API', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((response) => {
		console.log('Connected');
	})
	.catch((error) => {
		console.log('Failed to connect ', error);
	});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors);

app.use('/api/auth', userRoutes);
app.use('/api/info/question', questionRoutes);
app.use('/api/info/answer', answerRoutes);
app.use('/api/info/comment', commentRoutes);

app.listen(PORT, () => {
	console.log('Server is running on ', PORT);
});

export interface UserModel {
    username: string;
    email: string;
    password?: string;
    questionsCount?: number;
    answersCount?: number;
    commentsCount?: number;
}
import express from 'express';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import { createQuestion, deleteQuestion, getQuestion } from '../controllers/questionController.js';
const router = express.Router();

//create new question -- admin
router.route('/createquestion').post(isAuthenticated, authorizeAdmin, createQuestion);
//delete question -- admin
router.route('/deletequestion/:id').delete(isAuthenticated, authorizeAdmin, deleteQuestion);
//get question -- admin 
router.route('/question').get(getQuestion);


export default router;
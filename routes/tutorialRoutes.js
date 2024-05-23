import express from 'express';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import { createTutorial, deleteTutorial, getSingleTutorial, getTutorial } from '../controllers/tutorialController.js';
const router = express.Router();

//create new tutorial -- admin
router.route('/createtutorial').post(isAuthenticated, authorizeAdmin, createTutorial);
//delete tutorial -- admin
router.route('/deletetutorial/:id').delete(isAuthenticated, authorizeAdmin, deleteTutorial);
//get tutorial -- admin 
router.route('/tutorial').get(getTutorial);
// Route to get a single tutorial by ID
router.route('/singletutorial/:id').get(isAuthenticated, authorizeAdmin, getSingleTutorial);


export default router;
import express from 'express';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import { createTutorial, deleteTutorial, getSingleTutorial, getTutorial, updateTutorial } from '../controllers/tutorialController.js';
const router = express.Router();

//create new tutorial -- admin
router.route('/createtutorial').post(isAuthenticated, authorizeAdmin, createTutorial);
//delete tutorial -- admin
router.route('/deletetutorial/:id').delete(isAuthenticated, authorizeAdmin, deleteTutorial);
//get tutorial -- admin 
router.route('/tutorial').get(getTutorial);
// Get single tutorial by ID
router.route('/tutorial/:id').get(getSingleTutorial);
// Route to get a update tutorial by ID
router.route('/tutorial/:id').put(isAuthenticated, updateTutorial);
// Delete tutorial -- admin
router.route('/tutorial/:id').delete(isAuthenticated, authorizeAdmin, deleteTutorial);


export default router;

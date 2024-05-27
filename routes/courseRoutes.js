import express from 'express';
import { addLecture, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from '../controllers/courseController.js';
import singleUpload from '../middlewares/multer.js';
import { authorizeAdmin, authorizeSubscribers, isAuthenticated } from '../middlewares/auth.js';
import { courseAccessMiddleware } from '../middlewares/courseAccess.js';
const router = express.Router();


//get all courses without lecture
router.route('/courses').get(getAllCourses);
//create new course -- admin
router.route('/createcourse').post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);
//add lecture // delete course  //get course details
router.route('/course/:id').get(isAuthenticated, authorizeSubscribers, courseAccessMiddleware, getCourseLectures)
.post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
.delete(isAuthenticated, authorizeAdmin, deleteCourse);
//delete lecture
router.route('/lecture').delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router;
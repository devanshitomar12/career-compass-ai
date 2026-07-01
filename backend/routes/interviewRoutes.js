import express from 'express';
import {
  getInterviewExperiences,
  createInterviewExperience,
  updateInterviewExperience,
  deleteInterviewExperience,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getInterviewExperiences).post(createInterviewExperience);
router.route('/:id').put(updateInterviewExperience).delete(deleteInterviewExperience);

export default router;

import express from 'express';
import { analyzeSkillGap, getAvailableRoles } from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/analyze', protect, analyzeSkillGap);
router.get('/roles', getAvailableRoles);

export default router;

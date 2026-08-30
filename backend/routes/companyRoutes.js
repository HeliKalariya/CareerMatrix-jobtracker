import express from 'express';
import protect from '../middleware/auth.js';
import { createCompany, deleteCompany, getCompanies, updateCompany } from '../controllers/companyController.js';

const router = express.Router();
router.use(protect);
router.route('/').get(getCompanies).post(createCompany);
router.route('/:id').put(updateCompany).delete(deleteCompany);

export default router;

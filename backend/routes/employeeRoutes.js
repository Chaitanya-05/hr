import express from 'express';
import { createEmployee, updateEmployee, getEmployees } from '../controllers/employeeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, createEmployee).get(protect, admin, getEmployees);
router.route('/:id').put(protect, admin, updateEmployee);

export default router;

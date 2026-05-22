import { Router } from 'express';
import { AdminController } from '../controllers/admin';
import { checkRole } from '../lib/auth/checkRole';

const router = Router();
const adminController = new AdminController();

// Middleware to protect admin routes
const adminAuthMiddleware = (req, res, next) => {
    const userRole = req.session.user.role; // Assuming user role is stored in session
    if (!checkRole(userRole, ['SUPER_ADMIN', 'ADMIN'])) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
};

// Route to list all admins
router.get('/admins', adminAuthMiddleware, adminController.listAdmins);

// Route to create a new admin
router.post('/create-admin', adminAuthMiddleware, adminController.createAdmin);

// Route to delete an admin
router.delete('/admins/:id', adminAuthMiddleware, adminController.deleteAdmin);

// Route to update an admin's role
router.put('/admins/:id', adminAuthMiddleware, adminController.updateAdminRole);

export default router;
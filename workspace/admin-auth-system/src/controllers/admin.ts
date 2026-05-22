import { Request, Response } from 'express';
import User from '../models/User';
import checkRole from '../lib/auth/checkRole';

class AdminController {
    // List all admin users
    async listAdmins(req: Request, res: Response) {
        if (!checkRole(req.user.role, ['SUPER_ADMIN', 'ADMIN'])) {
            return res.status(403).send('Unauthorized');
        }
        const admins = await User.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } });
        res.json(admins);
    }

    // Create a new admin
    async createAdmin(req: Request, res: Response) {
        if (!checkRole(req.user.role, ['SUPER_ADMIN'])) {
            return res.status(403).send('Unauthorized');
        }
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: await User.hashPassword(password),
            role
        });
        await newUser.save();
        res.status(201).json(newUser);
    }

    // Delete an admin
    async deleteAdmin(req: Request, res: Response) {
        if (!checkRole(req.user.role, ['SUPER_ADMIN'])) {
            return res.status(403).send('Unauthorized');
        }
        const adminId = req.params.id;
        if (adminId === req.user.id) {
            return res.status(400).send('Cannot delete self');
        }
        await User.findByIdAndDelete(adminId);
        res.status(204).send();
    }

    // Update an admin's role
    async updateAdmin(req: Request, res: Response) {
        if (!checkRole(req.user.role, ['SUPER_ADMIN'])) {
            return res.status(403).send('Unauthorized');
        }
        const adminId = req.params.id;
        const { role } = req.body;
        await User.findByIdAndUpdate(adminId, { role });
        res.status(200).send('Admin role updated');
    }
}

export default new AdminController();
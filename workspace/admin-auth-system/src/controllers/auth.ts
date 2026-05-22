import { Request, Response } from 'express';
import { User } from '../models/User';
import { createSession } from '../lib/session'; // Assuming there's a session management utility
import { normalizeEmail } from '../lib/utils'; // Assuming there's a utility for email normalization

export class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        // Normalize email
        const normalizedEmail = normalizeEmail(email);

        // Find user by normalized email
        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !user.verifyPassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create session
        const session = createSession(user);

        // Set session in response (e.g., in a cookie or session store)
        req.session = session;

        // Redirect based on role
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
            return res.redirect('/admin/dashboard');
        } else if (user.role === 'USER') {
            return res.redirect('/dashboard');
        }

        return res.status(403).json({ message: 'Unauthorized' });
    }
}
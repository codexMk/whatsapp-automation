export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
}

export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export function hashPassword(password: string): string {
    // Implement password hashing logic here
    return password; // Placeholder for actual hashed password
}
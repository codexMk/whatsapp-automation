# Admin Auth System

## Overview
The Admin Auth System is a role-based authentication and management system designed to provide secure access to admin functionalities. It supports multiple user roles, including SUPER_ADMIN, ADMIN, and USER, with specific permissions for each role.

## Features
- Role-based routing and access control
- Admin management functionalities (create, update, delete admins)
- Secure authentication and session management
- Multi-tenant logic for user data visibility

## Project Structure
```
admin-auth-system
├── src
│   ├── controllers
│   │   ├── admin.ts        # Admin-related functionalities
│   │   └── auth.ts         # Authentication functionalities
│   ├── lib
│   │   └── auth
│   │       └── checkRole.ts # Role checking utility
│   ├── models
│   │   └── User.ts         # User model definition
│   ├── routes
│   │   ├── admin.ts        # Admin routes
│   │   └── auth.ts         # Authentication routes
│   └── app.ts              # Main application entry point
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd admin-auth-system
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```

## Usage
- Access the application through the designated URL.
- Use the login endpoint to authenticate users.
- Admin functionalities are accessible only to users with the SUPER_ADMIN or ADMIN roles.

## Security
Ensure that all sensitive operations are protected and that unauthorized access is blocked. Regularly review and update the permission system to maintain security standards.
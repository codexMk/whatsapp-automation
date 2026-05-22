# Instructions to setup PostgreSQL backend with Node.js, Express, and pg

1. Install dependencies:
   npm install express pg dotenv

2. Set up environment variables:
   - Copy .env.example to .env
   - Fill in your PostgreSQL credentials

3. Create users table:
   - Run the SQL in users-table.sql using a tool like psql or PgAdmin:
     psql -U your_db_user -d your_db_name -f users-table.sql

4. Start the server:
   node server.js

5. API Endpoints:
   - GET    /users         → List all users
   - GET    /users/:id     → Get user by id
   - POST   /users         → Create user (JSON: { name, email })
   - PUT    /users/:id     → Update user (JSON: { name, email })
   - DELETE /users/:id     → Delete user

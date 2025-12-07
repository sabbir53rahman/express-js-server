Project Name: Vehicle Rental System

Live URL:(https://server-with-experss.vercel.app/)

---

## Project Overview
A backend API for managing vehicle rentals, handling:

- Vehicles: Manage inventory with availability tracking  
- Customers: Manage accounts and profiles and show there booked vehicles info 
- Bookings: Handle rentals, returns, and total cost calculation  
- Authentication: Role-based access control (Admin & Customer)  

---

##  Technology Stack
- Node.js + TypeScript  
- Express.js  
- PostgreSQL  
- bcrypt (password hashing)  
- JSON Web Token (JWT) authentication

##  Setup & Usage
1. Clone the repo: `git clone <repo-url>`  
2. Install dependencies: `npm install`  
3. Setup `.env` with DB and JWT configs  
4. Run migrations (if any)  
5. Start server: `npm run dev`  
6. Access API at `https://server-with-experss.vercel.app/api/v1/`  

env:
PORT=5000

CONNECTION_STR=postgresql://username:password@localhost:5432/vehiclerentaldb?sslmode=disable

JWT_SECRET="your_jwt_secret_here"
---

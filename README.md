# 📚 BookNest - Book Sharing Platform

BookNest is a full-stack web application that allows users to share physical books and PDF resources within a community. It features authentication, book listings, borrowing requests, and a personalized dashboard.

## ✨ Features

### 👤 Comprehensive User Dashboard

- **Dynamic Metric Cards**: Quick real-time overview displaying:
  - **Total Shared Books**: Count of books contributed by the user.
  - **Pending Requests**: Count of active borrow requests waiting for admin decision.
  - **Borrowed Books**: Count of currently approved and active borrowed books.

- **Sidebar Navigation**:
  - 🏠 **Dashboard Overview**: Quick statistics and platform activity summary.
  - 📚 **Shared Books (My Books)**: Manage, edit, or remove books you have uploaded/shared.
  - 📬 **Borrow Requests**: Track status of all your sent borrow requests (`Pending`, `Approved`, `Rejected`).
  - 📖 **Borrowed Books**: Access full details and content/PDFs for all approved borrowed books.
  - ➕ **Add Book**: Form to publish new physical or digital (PDF) book listings.

### 🛡️ Admin Management Dashboard

- **Request Approvals**: Review incoming borrow requests and either **Approve** or **Reject** them.
- **Automated Book State Sync**: Approving a request automatically updates the corresponding book's status to `Borrowed` in `booksCollection`.
- **Content Moderation**: Delete invalid requests, spam listings, or remove outdated books.
- **User & Inventory Oversight**: System-wide monitoring of total books, active requests, and general user interactions.

### 🔐 General Features

- **Authentication**: Secure login and registration using **Better Auth** with JWT.
- **Book Management**: Users can share books (Physical or PDF) with details like title, author, category, and cover image.
- **Borrow Requests**: Users can request to borrow available physical books.
- **Responsive UI**: Fully responsive and modern UI built with Tailwind CSS and Framer Motion animations.
- **Protected Routes**: Ensures only authenticated users can access specific pages (e.g., `/share`, `/dashboard`, `/admin`).

## 🛠️ Tech Stack

### Frontend
- [Next.js 16](https://nextjs.org/) (React Framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)

### Backend
- [Node.js](https://nodejs.org/) / [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (NoSQL Database)
- [Better Auth](https://better-auth.vercel.app/) (Authentication with JWT)

### Tools & Environment
- TypeScript / JavaScript
- Nodemon (Development)
- Dotenv (Environment Variables)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- MongoDB Atlas Account or Local MongoDB Instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/booknest.git
   cd booknest
Install Frontend Dependencies

bash
npm install
# or
yarn install
Install Backend Dependencies (if backend is in a separate folder)

bash
cd server # or your backend folder name
npm install
cd ..
Environment Variables
Create a .env.local file in the Frontend Root and a .env file in the Backend Root.

Frontend (.env.local)
text
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
Backend (.env)
text
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
Running the Application
Start the Backend Server (from the backend folder)

bash
npm run dev
# or
nodemon index.js
Server will run on http://localhost:5000

Start the Frontend Server (from the root folder)

bash
npm run dev
# or
yarn dev
App will run on http://localhost:3000

Open http://localhost:3000 in your browser.

📁 Project Structure
text
booknest/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/           # Admin Dashboard Pages
│   │   ├── api/             # API Routes (Backend for Next.js)
│   │   ├── books/           # Books Pages
│   │   ├── dashboard/       # User Dashboard Page
│   │   ├── share/           # Share Book Page
│   │   ├── my-books/        # My Shared Books Page
│   │   ├── borrow-requests/ # Borrow Requests Tracking Page
│   │   └── borrowed-books/  # Approved Borrowed Books Page
│   ├── components/          # Reusable React Components
│   ├── lib/                 # Utilities, Auth Client, DB Config
│   │   ├── auth-client.ts   # Better Auth Frontend Client
│   │   └── auth.ts          # Better Auth Backend Config
│   ├── hooks/               # Custom React Hooks
│   └── types/               # TypeScript Interfaces
├── server/                  # Express Backend (if separate)
│   ├── index.js             # Entry point
│   └── middleware/          # Custom Middlewares (verifyToken)
├── public/                  # Static Assets
├── .env.local               # Frontend Environment Variables
├── next.config.ts           # Next.js Configuration
├── tailwind.config.js       # Tailwind Configuration
└── package.json
📡 API Endpoints (Backend)
Method	Endpoint	Description	Auth Required
POST	/books	Create a new book share	✅ Yes
GET	/books	Get all books	❌ No
GET	/books/:id	Get a single book with details	❌ No
DELETE	/books/:id	Delete a book (Owner only)	✅ Yes
POST	/books/:id/request	Request to borrow a book	✅ Yes
GET	/dashboard/books	Get shared books count	✅ Yes
GET	/dashboard/borrowRequests/email	Get all requests & stats	✅ Yes
PATCH	/borrow-requests/:id	Update request status (Approve/Reject)	✅ Yes (Admin)
GET	/users/:id	Get user information	❌ No
🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Team
Your Name - Initial work - Your Github


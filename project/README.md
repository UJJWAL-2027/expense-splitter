# Expense Splitter

A beautiful, modern expense splitting application inspired by Splitwise. Built with React, TypeScript, and Tailwind CSS for the frontend, and Node.js with Express and MongoDB for the backend.

## Features

- 📊 **Dashboard** - Overview of expenses and balances
- 💰 **Expense Management** - Add, view, and delete expenses
- 👥 **Friend Management** - Add and manage friends
- ⚖️ **Balance Tracking** - Real-time balance calculations
- 🎯 **Smart Splitting** - Equal or custom split options
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean, professional interface

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expense-splitter.git
cd expense-splitter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your MongoDB connection string.

4. Start the development servers:

Frontend (Vite dev server):
```bash
npm run dev
```

Backend (Express server):
```bash
npm run server
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Deployment

### GitHub Pages
This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

1. Push your code to a GitHub repository
2. Go to your repository settings
3. Navigate to Pages section
4. Set source to "GitHub Actions"
5. The site will automatically deploy on every push to main branch

### Netlify
You can also deploy to Netlify by connecting your GitHub repository or using the Netlify CLI.

## Usage

1. **Add Friends** - Start by adding friends who will share expenses with you
2. **Create Expenses** - Add expenses and choose how to split them
3. **Track Balances** - View who owes what in the balances section
4. **Settle Up** - Mark balances as settled when payments are made

## API Endpoints

### Friends
- `GET /api/friends` - Get all friends
- `POST /api/friends` - Create a new friend
- `PUT /api/friends/:id` - Update friend
- `DELETE /api/friends/:id` - Delete friend

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Balances
- `GET /api/balances` - Get all balances
- `GET /api/balances/:friendId` - Get balance for specific friend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
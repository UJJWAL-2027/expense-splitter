# Expense Splitter

A beautiful, modern expense splitting application inspired by Splitwise. Built with Next.js, TypeScript, Tailwind CSS, and Supabase for seamless expense management with friends.

## ✨ Features

- 📊 **Dashboard** - Overview of expenses and balances with interactive charts
- 💰 **Expense Management** - Add, view, and delete expenses with smart splitting
- 👥 **Friend Management** - Add and manage friends easily
- ⚖️ **Balance Tracking** - Real-time balance calculations and debt tracking
- 🎯 **Smart Splitting** - Equal or custom split options
- 💳 **Settle Up** - Easy payment settlement between friends
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🔐 **Authentication** - Secure user authentication with Supabase
- 📈 **Analytics** - Spending insights and category breakdowns
- 🎨 **Modern UI** - Beautiful gradients, animations, and micro-interactions

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (Database, Auth, Real-time)
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Context API
- **Deployment**: GitHub Pages

## 🎨 Design System

- **Primary Color**: Emerald (#10B981)
- **Secondary Color**: Blue (#3B82F6)
- **Modern gradients and smooth animations**
- **Card-based layout with subtle shadows**
- **Responsive breakpoints for all devices**
- **Professional typography hierarchy**

## 🏗️ Architecture

### Frontend Structure
```
app/
├── globals.css           # Global styles and Tailwind
├── layout.tsx           # Root layout with providers
├── page.tsx             # Main application page
components/
├── layout/              # Layout components
├── modals/              # Modal components
├── Dashboard.tsx        # Dashboard with charts
├── Expenses.tsx         # Expense management
├── Friends.tsx          # Friend management
└── Balances.tsx         # Balance tracking
contexts/
├── AuthContext.tsx      # Authentication state
└── ExpenseContext.tsx   # Expense management state
services/
├── friendService.ts     # Friend API calls
└── expenseService.ts    # Expense API calls
types/
├── index.ts            # Application types
└── database.ts         # Supabase database types
```

### Database Schema (Supabase)

**Friends Table**
```sql
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Expenses Table**
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  paid_by UUID REFERENCES friends(id),
  participants UUID[] NOT NULL,
  splits JSONB NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/UJJWAL-2027/expense-splitter.git
cd expense-splitter
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create the database tables using the schema above
   - Enable Row Level Security (RLS) on both tables

4. **Environment setup**
```bash
cp .env.local.example .env.local
```
Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📱 Usage

1. **Sign Up/Sign In** - Create an account or sign in
2. **Add Friends** - Add friends you want to split expenses with
3. **Create Expenses** - Add expenses and choose how to split them
4. **Track Balances** - View who owes what in real-time
5. **Settle Up** - Mark balances as settled when payments are made
6. **View Analytics** - Check spending patterns and insights

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🌐 Deployment

The app is configured for GitHub Pages deployment:

1. Push to your GitHub repository
2. Enable GitHub Pages in repository settings
3. The app will automatically deploy on every push

## 🎯 Key Features Explained

### Smart Expense Splitting
- **Equal Split**: Automatically divides expenses equally
- **Custom Split**: Set custom amounts for each participant
- **Real-time Validation**: Ensures splits add up correctly

### Balance Management
- **Automatic Calculation**: Balances update in real-time
- **Settlement Tracking**: Easy settlement between friends
- **Visual Indicators**: Clear indication of who owes what

### Analytics Dashboard
- **Monthly Spending**: Bar chart showing spending trends
- **Category Breakdown**: Pie chart of expense categories
- **Summary Cards**: Quick overview of key metrics

### Modern UX
- **Smooth Animations**: Fade-in and slide-up animations
- **Responsive Design**: Works perfectly on all devices
- **Intuitive Navigation**: Easy-to-use tab-based navigation
- **Loading States**: Proper loading indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Splitwise for the core functionality
- Built with modern web technologies for optimal performance
- Designed with user experience as the top priority

---

**Live Demo**: [https://ujjwal-2027.github.io/expense-splitter/](https://ujjwal-2027.github.io/expense-splitter/)

**Repository**: [https://github.com/UJJWAL-2027/expense-splitter](https://github.com/UJJWAL-2027/expense-splitter)
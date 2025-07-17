import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ExpenseProvider } from '@/contexts/ExpenseContext'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Expense Splitter - Split expenses with friends',
  description: 'Easily split expenses with friends and keep track of who owes what with Expense Splitter.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ExpenseProvider>
            {children}
          </ExpenseProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
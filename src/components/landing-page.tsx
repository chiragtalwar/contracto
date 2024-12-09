'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileText, MessageSquare, FileSpreadsheet, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white relative overflow-hidden min-h-screen">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative">
          {/* Navigation */}
          <NavigationMenu isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center space-y-8"
            >
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Contract Analysis
              </Badge>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold tracking-tight"
              >
                Analyze Contracts in{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                  Seconds
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300"
              >
                Contract Analyzer Pro uses cutting-edge AI to compare, analyze, and extract key insights from your legal documents, saving you time and ensuring you never miss crucial details.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex justify-center gap-4"
              >
                <Link href="/upload">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
                    Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600">
                  Watch Demo
                </Button>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <FeatureCard
                  icon={<FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
                  title="Smart Comparison"
                  description="Compare multiple contracts side-by-side with AI-powered insights."
                />
                <FeatureCard
                  icon={<MessageSquare className="w-10 h-10 text-purple-600 dark:text-purple-400" />}
                  title="AI Chatbot"
                  description="Ask questions about your contracts and get instant, accurate answers."
                />
                <FeatureCard
                  icon={<FileSpreadsheet className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />}
                  title="Export & Share"
                  description="Generate detailed reports and easily share findings with your team."
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col items-center text-center space-y-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </div>
  )
}


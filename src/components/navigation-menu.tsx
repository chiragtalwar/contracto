'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu as NavMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { FileText } from 'lucide-react'
import Link from 'next/link'

export function NavigationMenu() {
  return (
    <nav className="border-b border-slate-700 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                  Contracto AI
                </span>
              </div>
            </Link>
          </motion.div>

          <NavMenu>
            <NavigationMenuList className="flex space-x-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-200 hover:text-blue-400 transition-colors">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] bg-slate-800 rounded-lg shadow-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <NavigationMenuLink asChild>
                        <Link href="/comparison" className="block p-3 space-y-1 rounded-md hover:bg-slate-700 transition-colors">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <h3 className="text-sm font-medium">Compare Contracts</h3>
                          </div>
                          <p className="text-xs text-slate-400">Find the best terms quickly</p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/chatbot" className="block p-3 space-y-1 rounded-md hover:bg-slate-700 transition-colors">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-purple-400" />
                            <h3 className="text-sm font-medium">AI-Powered Analysis</h3>
                          </div>
                          <p className="text-xs text-slate-400">Get insights with our chatbot</p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/pricing" className="text-slate-200 hover:text-blue-400 transition-colors">
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="text-slate-200 hover:text-blue-400 transition-colors">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className="text-slate-200 hover:text-blue-400 transition-colors">
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavMenu>
        </div>
      </div>
    </nav>
  )
}


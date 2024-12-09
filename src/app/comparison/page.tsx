'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, MessageSquare, Check, X } from 'lucide-react'
import { ContractComparisonService } from '@/lib/services/contractComparisonService'
import { Contract, ContractAnalysis } from '@/types/contract'

export default function ComparisonPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('table')

  const criteria = [
    'effective_date',
    'payment_terms',
    'late_penalty',
    'termination_clause',
    'confidentiality_clause',
    'arbitration',
    'delivery_timeline',
    'governing_law'
  ]

  useEffect(() => {
    async function loadContracts() {
      try {
        const data = await ContractComparisonService.getRecentContracts()
        console.log('Loaded contracts:', data)
        setContracts(data as Contract[])
      } catch (error) {
        console.error('Error loading contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContracts()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading contracts...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <NavigationMenu />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Contract Comparison</h1>
        <p className="text-gray-400 mb-6">
          Compare contracts and find the best deal at a glance.
        </p>

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'table' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setView('table')}
          >
            Table View
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'card' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => setView('card')}
          >
            Card View
          </button>
        </div>

        {view === 'table' ? (
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableCell className="font-bold capitalize text-gray-200 bg-gray-800/80 sticky left-0 whitespace-nowrap border-r border-gray-700">
                    <div className="flex items-center space-x-2">
                      <span>Criteria</span>
                    </div>
                  </TableCell>
                  {contracts.map(contract => (
                    <TableHead key={contract.id} className="text-center text-gray-300 min-w-[200px] max-w-[250px] px-4">
                      <div className="space-y-2">
                        <p className="font-medium truncate">{contract.original_name}</p>
                        <Badge className={`${
                          (contract.analysis?.score || 0) >= 90 ? 'bg-green-500/90' : 
                          (contract.analysis?.score || 0) >= 80 ? 'bg-yellow-500/90' : 
                          'bg-red-500/90'
                        } text-white px-3 py-0.5`}>
                          Score: {contract.analysis?.score || 'N/A'}
                        </Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map(key => (
                  <TableRow key={key} className="border-gray-700">
                    <TableCell className="font-medium capitalize text-gray-300">
                      {key.replace(/_/g, ' ')}
                    </TableCell>
                    {contracts.map(contract => (
                      <TableCell key={contract.id} className="text-center text-gray-300">
                        <span className={contract.analysis?.[key] === 'Not specified' ? 'text-gray-500' : ''}>
                          {contract.analysis?.[key] || 'Not specified'}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map(contract => (
              <Card key={contract.id} className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-300">
                    <span className="truncate">{contract.original_name}</span>
                    <Badge className={`${
                      (contract.analysis?.score || 0) >= 90 ? 'bg-green-500' : 
                      (contract.analysis?.score || 0) >= 80 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    } text-white ml-2`}>
                      {contract.analysis?.score || 'N/A'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {criteria.map(key => (
                    <div key={key} className="space-y-1">
                      <p className="text-sm font-medium capitalize text-gray-400">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className={`text-gray-300 ${
                        contract.analysis?.[key] === 'Not specified' ? 'text-gray-500' : ''
                      }`}>
                        {contract.analysis?.[key] || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Download Comparison Report
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
            Chat with Contract Analyzer Pro
          </button>
        </div>
      </div>
    </div>
  )
}


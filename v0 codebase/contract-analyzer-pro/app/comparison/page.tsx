'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ChevronDown, ChevronUp, Check, X, MessageSquare } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

export default function ComparisonPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [expandedContract, setExpandedContract] = useState(null)

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  // Sample data for demonstration
  const contracts = [
    { 
      name: 'Contract A', 
      paymentTerms: 'Net 30', 
      penaltyClause: 'Yes', 
      terminationConditions: '30 days notice',
      confidentiality: 'Strict',
      disputeResolution: 'Arbitration',
      intellectualProperty: 'Shared ownership',
      score: 85
    },
    { 
      name: 'Contract B', 
      paymentTerms: 'Net 45', 
      penaltyClause: 'No', 
      terminationConditions: '60 days notice',
      confidentiality: 'Moderate',
      disputeResolution: 'Mediation',
      intellectualProperty: 'Client ownership',
      score: 72
    },
    { 
      name: 'Contract C', 
      paymentTerms: 'Net 15', 
      penaltyClause: 'Yes', 
      terminationConditions: '15 days notice',
      confidentiality: 'Very strict',
      disputeResolution: 'Litigation',
      intellectualProperty: 'Provider ownership',
      score: 91
    },
  ]

  const toggleExpand = (contractName) => {
    if (expandedContract === contractName) {
      setExpandedContract(null)
    } else {
      setExpandedContract(contractName)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white relative overflow-hidden min-h-screen">
        <NavigationMenu isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8"
          >
            <h1 className="text-3xl font-bold mb-6">Contract Comparison</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Compare contracts and find the best deal at a glance.</p>
            
            <Tabs defaultValue="table" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>
              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Criteria</TableHead>
                        {contracts.map((contract) => (
                          <TableHead key={contract.name} className="text-center">
                            {contract.name}
                            <div className="mt-2">
                              <Badge className={`${contract.score >= 90 ? 'bg-green-500' : contract.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                                Score: {contract.score}
                              </Badge>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Payment Terms</TableCell>
                        {contracts.map((contract) => (
                          <TableCell key={contract.name} className="text-center">
                            {contract.paymentTerms}
                            {contract.paymentTerms === 'Net 15' && (
                              <Badge className="ml-2 bg-green-500 text-white">Best</Badge>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Penalty Clause</TableCell>
                        {contracts.map((contract) => (
                          <TableCell key={contract.name} className="text-center">
                            {contract.penaltyClause === 'Yes' ? (
                              <Check className="mx-auto text-green-500" />
                            ) : (
                              <X className="mx-auto text-red-500" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Termination Conditions</TableCell>
                        {contracts.map((contract) => (
                          <TableCell key={contract.name} className="text-center">{contract.terminationConditions}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Confidentiality</TableCell>
                        {contracts.map((contract) => (
                          <TableCell key={contract.name} className="text-center">{contract.confidentiality}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Dispute Resolution</TableCell>
                        {contracts.map((contract) => (
                          <TableCell key={contract.name} className="text-center">{contract.disputeResolution}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Intellectual Property</TableCell>
                        {contracts.map((contract) => (
                          <TableCell key={contract.name} className="text-center">{contract.intellectualProperty}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contracts.map((contract) => (
                    <Card key={contract.name} className="overflow-hidden">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-4">{contract.name}</h3>
                        <div className="mb-4">
                          <Badge className={`${contract.score >= 90 ? 'bg-green-500' : contract.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                            Score: {contract.score}
                          </Badge>
                        </div>
                        <Progress value={contract.score} className="mb-4" />
                        <ul className="space-y-2">
                          <li><strong>Payment Terms:</strong> {contract.paymentTerms}</li>
                          <li><strong>Penalty Clause:</strong> {contract.penaltyClause}</li>
                          <li><strong>Termination:</strong> {contract.terminationConditions}</li>
                        </ul>
                        <Button
                          variant="ghost"
                          className="mt-4 w-full"
                          onClick={() => toggleExpand(contract.name)}
                        >
                          {expandedContract === contract.name ? (
                            <>Less Details <ChevronUp className="ml-2 h-4 w-4" /></>
                          ) : (
                            <>More Details <ChevronDown className="ml-2 h-4 w-4" /></>
                          )}
                        </Button>
                        <AnimatePresence>
                          {expandedContract === contract.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ul className="space-y-2 mt-4">
                                <li><strong>Confidentiality:</strong> {contract.confidentiality}</li>
                                <li><strong>Dispute Resolution:</strong> {contract.disputeResolution}</li>
                                <li><strong>Intellectual Property:</strong> {contract.intellectualProperty}</li>
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center space-x-4">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Download className="mr-2 h-4 w-4" /> Download Comparison Report
              </Button>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <MessageSquare className="mr-2 h-4 w-4" /> Chat with Contract Analyzer Pro
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


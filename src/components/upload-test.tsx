'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function UploadTest() {
  const [status, setStatus] = useState<string>('')

  const testConnection = async () => {
    try {
      // Test database connection
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .limit(1)

      if (error) throw error
      
      setStatus('Database connection successful!')
      console.log('Database test:', data)

      // Test storage connection
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('contracts')
        .list()

      if (storageError) throw storageError
      
      setStatus('Database and Storage connections successful!')
      console.log('Storage test:', storageData)

    } catch (err) {
      console.error('Error:', err)
      setStatus('Error: ' + (err as Error).message)
    }
  }

  return (
    <div className="p-4">
      <button 
        onClick={testConnection}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Connection
      </button>
      <div className="mt-4 text-white">
        Status: {status}
      </div>
    </div>
  )
} 
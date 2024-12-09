'use client'

import { useState } from 'react'
import { supabaseAdmin as supabase } from '@/lib/supabase/client'
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"

export default function TestUpload() {
  const [status, setStatus] = useState('')
  const [extractedText, setExtractedText] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setStatus('Uploading...')
      
      // 1. Upload to storage
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('contracts')
        .upload(fileName, file)

      if (uploadError) throw uploadError
      setStatus('File uploaded, processing PDF...')

      // 2. Process PDF
      const blob = new Blob([file], { type: 'application/pdf' })
      const loader = new WebPDFLoader(blob)
      const docs = await loader.load()
      
      // 3. Extract text
      const fullText = docs.map(doc => doc.pageContent).join('\n')
      setExtractedText(fullText)

      // 4. Create basic record
      const { error: contractError } = await supabase
        .from('contracts')
        .insert({
          file_url: fileName,
          original_name: file.name,
          status: 'processed',
          size: file.size,
          metadata: {
            text: fullText,
            pages: docs.length,
            processed_at: new Date().toISOString()
          },
          embedding: null
        })

      if (contractError) throw contractError

      setStatus('Upload and processing successful!')

    } catch (error) {
      console.error('Error:', error)
      setStatus(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Upload with PDF Processing</h1>
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange}
        className="mb-4"
      />
      <div className="mt-4 text-sm text-gray-600">{status}</div>
      
      {extractedText && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Extracted Text:</h2>
          <div className="whitespace-pre-wrap p-4 bg-gray-50 rounded border max-h-96 overflow-auto">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  )
} 
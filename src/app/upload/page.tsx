'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, GitCompare, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PDFService } from '@/lib/services/pdfService'
import { NavigationMenu } from '@/components/navigation-menu'

interface UploadedFile {
  name: string
  size: number
  status: 'uploading' | 'done' | 'error'
  error?: string
  url?: string
  text?: string
  analysis?: any
}

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Set initial state for new files
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: file.size,
      status: 'uploading' as const
    }))
    
    setFiles(prev => [...prev, ...newFiles])

    // Process and upload files
    const results = await PDFService.uploadMultipleFiles(acceptedFiles)
    
    // Update states based on results
    setFiles(current => {
      const updatedFiles = [...current]
      results.forEach(result => {
        const index = updatedFiles.findIndex(f => f.name === result.fileName)
        if (index !== -1) {
          updatedFiles[index] = {
            ...updatedFiles[index],
            status: result.success ? 'done' : 'error',
            error: result.error,
            url: result.url,
            text: result.text,
            analysis: result.analysis
          }
        }
      })
      return updatedFiles
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const handleCompare = () => {
    router.push('/comparison')
  }

  const handleChat = () => {
    router.push('/chatbot')
  }

  return (
    <div className="min-h-screen dark">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen">
        <NavigationMenu />
        
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-slate-800 rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Contracts</h1>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <p className="text-lg mb-2">Drag & drop your PDF contracts here</p>
              <p className="text-sm text-slate-400 mb-4">or</p>
              <Button variant="secondary">Select Files</Button>
              <p className="mt-4 text-sm text-slate-400">Maximum 5 files, 10MB each</p>
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Uploaded Files:</h2>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li 
                      key={`${file.name}-${index}`} 
                      className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                        file.status === 'done' ? 'cursor-pointer hover:bg-slate-700' : ''
                      }`}
                      onClick={() => file.status === 'done' ? setSelectedFile(file) : null}
                    >
                      <Upload className={`w-5 h-5 ${
                        file.status === 'done' ? 'text-green-500' :
                        file.status === 'error' ? 'text-red-500' :
                        'text-blue-500'
                      }`} />
                      <span className="text-slate-300">{file.name}</span>
                      <span className={`text-sm ${
                        file.status === 'done' ? 'text-green-400' : 
                        file.status === 'error' ? 'text-red-400' : 
                        'text-slate-400'
                      }`}>
                        {file.status === 'error' ? `Error: ${file.error}` : `(${file.status})`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {files.length > 0 && files.some(file => file.status === 'done') && (
              <div className="mt-8 flex justify-center space-x-4">
                <Button 
                  onClick={handleCompare}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare Contracts
                </Button>
                <Button 
                  onClick={handleChat}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat About Contracts
                </Button>
              </div>
            )}

            {selectedFile && selectedFile.text && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Extracted Text</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="whitespace-pre-wrap p-4 bg-slate-900 rounded border border-slate-700 max-h-96 overflow-auto text-sm text-slate-300">
                  {selectedFile.text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { Upload, ArrowRight } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function UploadPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [files, setFiles] = useState([])
  const router = useRouter()

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })))
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically upload the files to your server
    // For this example, we'll just navigate to the comparison page
    router.push('/comparison')
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white relative overflow-hidden min-h-screen">
        <NavigationMenu isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8"
          >
            <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Contracts</h1>
            <form onSubmit={handleSubmit}>
              <div
                {...getRootProps()}
                className={`border-4 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 ${
                  isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <p className="text-lg mb-2">Drag & drop your PDF contracts here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or</p>
                <Button type="button" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Select Files
                </Button>
              </div>
              {files.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Uploaded Files:</h2>
                  <ul className="space-y-2">
                    {files.map((file) => (
                      <li key={file.name} className="flex items-center space-x-2">
                        <Upload className="w-5 h-5 text-blue-500" />
                        <span>{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-8 text-center">
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold">
                  Analyze Contracts <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


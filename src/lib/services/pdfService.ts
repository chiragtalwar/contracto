import { supabaseAdmin as supabase } from '../supabase/client'
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"
import { ContractParserService } from './contractParserService'

interface UploadResult {
  fileName: string
  success: boolean
  error?: string
  url?: string
  text?: string
}

export class PDFService {
  static async uploadMultipleFiles(files: File[]): Promise<UploadResult[]> {
    const results: UploadResult[] = []

    for (const file of files) {
      try {
        console.log('Processing:', file.name)

        // 1. Process PDF first
        const blob = new Blob([file], { type: 'application/pdf' })
        const loader = new WebPDFLoader(blob)
        const docs = await loader.load()
        const fullText = docs.map(doc => doc.pageContent).join('\n')

        // 2. Upload to storage
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('contracts')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // 3. Create database record with extracted text
        const { data: contractData, error: contractError } = await supabase
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
          .select()

        if (contractError) throw contractError

        // 4. Process and store analysis
        await ContractParserService.processAndStoreAnalysis(
          contractData[0].id,
          { text: fullText }
        )

        results.push({
          fileName: file.name,
          success: true,
          url: fileName,
          text: fullText
        })

      } catch (error) {
        console.error('Error processing file:', error)
        results.push({
          fileName: file.name,
          success: false,
          error: error instanceof Error ? error.message : 'Upload failed'
        })
      }
    }

    return results
  }
}
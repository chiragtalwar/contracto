import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { supabaseAdmin as supabase } from './supabase/client'

export async function processPdf(fileUrl: string) {
  try {
    // 1. Get file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('contracts')
      .download(fileUrl)

    if (downloadError) throw downloadError

    // 2. Convert blob to Blob object for WebPDFLoader
    const blob = new Blob([fileData], { type: 'application/pdf' })
    
    // 3. Use WebPDFLoader instead of PDFLoader
    const loader = new WebPDFLoader(blob)
    const docs = await loader.load()
    
    // 4. Extract text and metadata
    const fullText = docs.map(doc => doc.pageContent).join('\n')

    // 5. Update contracts table
    const { error: contractError } = await supabase
      .from('contracts')
      .update({ 
        status: 'processed',
        extracted_data: {
          text: fullText,
          pages: docs.length,
          processed_at: new Date().toISOString()
        }
      })
      .eq('file_url', fileUrl)

    if (contractError) throw contractError

    return {
      success: true,
      text: fullText.substring(0, 1000),
      pages: docs.length
    }

  } catch (error) {
    console.error('Processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}
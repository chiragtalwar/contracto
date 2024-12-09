import { supabaseAdmin as supabase } from '../supabase/client'
import { OpenAIEmbeddings } from '@langchain/openai'
import { ChatOpenAI } from '@langchain/openai'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'

export class ChatService {
  private static embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  private static chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7
  })

  private static vectorStore = new SupabaseVectorStore(
    this.embeddings,
    {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents'
    }
  )

  static async generateResponse(message: string, contractIds: string[]) {
    try {
      const contexts = await this.getRelevantContexts(message, contractIds)
      
      const response = await this.chatModel.predict(
        `You are an expert contract analysis assistant. Analyze the following contracts and answer the user's question.
         
         Contract Context:
         ${contexts.join('\n\n')}
         
         User Question: ${message}
         
         Instructions:
         1. Provide a detailed analysis
         2. Cite specific clauses when relevant
         3. Compare terms between contracts if applicable
         4. Highlight any potential issues or risks
         5. Format your response in a clear, professional manner
         6. Use bullet points or numbered lists for clarity when appropriate`
      )

      return response

    } catch (error) {
      console.error('Chat service error:', error)
      throw error
    }
  }

  static async createEmbeddingsForContract(contractId: string) {
    try {
      const { data: contract, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single()

      if (error || !contract) {
        throw new Error('Contract not found')
      }

      const chunks = this.splitIntoChunks(contract.content, 1000)

      for (const chunk of chunks) {
        const embedding = await this.embeddings.embedQuery(chunk)
        
        await supabase
          .from('documents')
          .insert({
            content: chunk,
            metadata: {
              contractId: contract.id,
              originalName: contract.original_name
            },
            embedding,
            contract_id: contract.id
          })
      }

    } catch (error) {
      console.error('Error creating embeddings:', error)
      throw error
    }
  }

  private static splitIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = []
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize))
    }
    return chunks
  }

  private static async getRelevantContexts(query: string, contractIds: string[]) {
    try {
      const results = await this.vectorStore.similaritySearch(query, 3)

      const relevantContractIds = [...new Set(results.map(
        doc => (doc.metadata as any).contractId
      ))]

      const { data: contracts } = await supabase
        .from('contracts')
        .select('*')
        .in('id', relevantContractIds)

      return contracts?.map(contract => 
        `Contract ${contract.original_name}:\n${contract.content}`
      ) || []

    } catch (error) {
      console.error('Context retrieval error:', error)
      return []
    }
  }
} 
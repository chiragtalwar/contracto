import { supabaseAdmin as supabase } from '../supabase/client'

interface ParsedContract {
  effective_date?: string;
  termination_clause?: string;
  payment_terms?: string;
  late_penalty?: string;
  delivery_timeline?: string;
  governing_law?: string;
  confidentiality_clause?: string;
  arbitration?: string;
}

export class ContractParserService {
  static parseContractText(text: string): ParsedContract {
    const parsed: ParsedContract = {};
    console.log('Starting to parse text:', text); // Debug log
    
    // Split text into lines and process each line
    const lines = text.split('\n');
    
    for (const line of lines) {
      const normalizedLine = line.trim();
      console.log('Processing line:', normalizedLine); // Debug log
      
      // Skip header lines
      if (/^Contract Document|^Contract Number|^Party A|^Party B/i.test(normalizedLine)) {
        continue;
      }
      
      // Match "Key: Value" format
      const matches = normalizedLine.match(/^([^:]+):\s*(.+)$/);
      if (matches) {
        const [_, key, value] = matches;
        const normalizedKey = key.trim().toLowerCase();
        
        switch (normalizedKey) {
          case 'effective date':
            parsed.effective_date = value.trim();
            break;
          case 'termination clause':
            parsed.termination_clause = value.trim();
            break;
          case 'payment terms':
            parsed.payment_terms = value.trim();
            break;
          case 'late penalty':
            parsed.late_penalty = value.trim();
            break;
          case 'delivery timeline':
            parsed.delivery_timeline = value.trim();
            break;
          case 'governing law':
            parsed.governing_law = value.trim();
            break;
          case 'confidentiality clause':
            parsed.confidentiality_clause = value.trim();
            break;
          case 'arbitration':
            parsed.arbitration = value.trim();
            break;
        }
      }
    }

    console.log('Parsed contract:', parsed); // Debug log
    return parsed;
  }

  static async processAndStoreAnalysis(contractId: string, metadata: any) {
    console.log('Processing contract:', contractId);
    console.log('Metadata received:', metadata);

    const contractText = metadata?.text;
    if (!contractText) {
      console.log('No text found in metadata');
      return null;
    }

    // Parse the contract text
    const parsedData = this.parseContractText(contractText);
    console.log('Parsed data:', parsedData);

    // Calculate a basic score
    const score = this.calculateScore(parsedData);
    console.log('Calculated score:', score);

    try {
      // Store in contract_analysis table
      const { data, error } = await supabase
        .from('contract_analysis')
        .upsert({
          contract_id: contractId,
          ...parsedData,
          score,
          edited_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Storage error:', error);
        throw error;
      }
      
      console.log('Stored analysis:', data);
      return data[0];
    } catch (error) {
      console.error('Failed to store analysis:', error);
      throw error;
    }
  }

  private static calculateScore(parsed: ParsedContract): number {
    let score = 70; // Base score
    const fields = Object.values(parsed);
    
    // Add points for each field that's present and not 'Not specified'
    fields.forEach(field => {
      if (field && field !== 'Not specified') score += 5;
    });

    return Math.min(100, score);
  }
} 
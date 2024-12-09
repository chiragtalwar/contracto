interface ContractFields {
  effective_date: string;
  termination_clause: string;
  payment_terms: string;
  late_penalty: string;
  delivery_timeline: string;
  governing_law: string;
  confidentiality_clause: string;
  arbitration: string;
  score?: number;
}

export class ContractAnalyzerService {
  static async analyzeContract(text: string): Promise<ContractFields> {
    // For now, let's use simple pattern matching
    // Later we can enhance this with AI/ML
    const fields: ContractFields = {
      effective_date: this.extractField(text, ['effective date', 'commencement date'], 50),
      termination_clause: this.extractField(text, ['termination', 'contract end'], 100),
      payment_terms: this.extractField(text, ['payment terms', 'payment schedule'], 100),
      late_penalty: this.extractField(text, ['late penalty', 'late payment', 'penalty clause'], 100),
      delivery_timeline: this.extractField(text, ['delivery schedule', 'delivery timeline'], 100),
      governing_law: this.extractField(text, ['governing law', 'jurisdiction'], 100),
      confidentiality_clause: this.extractField(text, ['confidentiality', 'non-disclosure'], 150),
      arbitration: this.extractField(text, ['arbitration', 'dispute resolution'], 100),
    }

    // Calculate a basic score based on completeness and terms
    fields.score = this.calculateScore(fields)

    return fields
  }

  private static extractField(text: string, keywords: string[], contextLength: number): string {
    const lowercaseText = text.toLowerCase()
    
    for (const keyword of keywords) {
      const index = lowercaseText.indexOf(keyword)
      if (index !== -1) {
        // Get surrounding context
        const start = Math.max(0, index - 20)
        const end = Math.min(text.length, index + contextLength)
        return text.slice(start, end).trim()
      }
    }
    
    return 'Not specified'
  }

  private static calculateScore(fields: ContractFields): number {
    let score = 70 // Base score
    
    // Add points for each field that's specified
    Object.values(fields).forEach(value => {
      if (value && value !== 'Not specified') score += 3
    })
    
    // Add points for favorable terms (we can expand this)
    if (fields.payment_terms.toLowerCase().includes('net 30')) score += 5
    if (fields.arbitration.toLowerCase().includes('arbitration')) score += 5
    if (fields.confidentiality_clause.length > 50) score += 5

    return Math.min(100, score) // Cap at 100
  }
} 
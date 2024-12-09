import { supabaseAdmin as supabase } from '../supabase/client'

interface ContractAnalysis {
  effective_date: string;
  termination_clause: string;
  payment_terms: string;
  late_penalty: string;
  delivery_timeline: string;
  governing_law: string;
  confidentiality_clause: string;
  arbitration: string;
  score: number;
}

interface Contract {
  id: string;
  original_name: string;
  analysis: ContractAnalysis;
}

export class ContractComparisonService {
  static async getRecentContracts(limit: number = 10): Promise<Contract[]> {
    console.log('Fetching recent contracts...');
    
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        id,
        original_name,
        metadata,
        contract_analysis (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Raw data from Supabase:', data);

    return data.map(contract => {
      console.log('Processing contract:', contract);
      return {
        id: contract.id,
        original_name: contract.original_name,
        analysis: contract.contract_analysis?.[0] || {
          score: 'N/A',
          effective_date: 'Not specified',
          payment_terms: 'Not specified',
          late_penalty: 'Not specified',
          termination_clause: 'Not specified',
          confidentiality_clause: 'Not specified',
          arbitration: 'Not specified',
          delivery_timeline: 'Not specified',
          governing_law: 'Not specified'
        }
      };
    });
  }

  static async getContractById(id: string): Promise<Contract | null> {
    const { data, error } = await supabase
      .from('contracts')
      .select('id, original_name, metadata, created_at')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      original_name: data.original_name,
      analysis: data.metadata.analysis,
      uploaded_at: data.created_at
    }
  }

  static async compareContracts(contractIds: string[]): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('id, original_name, metadata, created_at')
      .in('id', contractIds)

    if (error) throw error

    return data.map(contract => ({
      id: contract.id,
      original_name: contract.original_name,
      analysis: contract.metadata.analysis,
      uploaded_at: contract.created_at
    }))
  }
} 
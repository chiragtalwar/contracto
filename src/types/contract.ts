export interface ContractAnalysis {
  [key: string]: string | number;
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

export interface Contract {
  id: string;
  original_name: string;
  analysis: ContractAnalysis;
} 
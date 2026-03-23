export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  attributes: Record<string, string>;
  images: string[];
}

export interface ScoreResult {
  score: number;
  explanation: string;
}

export interface ComparedProductItem {
  product: ProductResponse;
  scoreResult: ScoreResult;
}

export interface ProductComparisonResponse {
  products: ComparedProductItem[];
  allAttributes: string[];
  commonAttributes: string[];
  differingAttributes: string[];
}

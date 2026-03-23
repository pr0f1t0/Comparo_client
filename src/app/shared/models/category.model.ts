export interface CategoryResponse {
  id: string;
  name: string;
  parentId: string | null;
  subcategories: CategoryResponse[];
}

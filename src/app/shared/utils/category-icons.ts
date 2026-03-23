const ICON_MAP: Record<string, string> = {
  electronics: 'devices',
  'home & living': 'weekend',
  fashion: 'checkroom',
  'sport & outdoors': 'fitness_center',
  'health & beauty': 'content_cut',
  garden: 'yard',
  automotive: 'directions_car',
  toys: 'smart_toy',
  books: 'menu_book',
  food: 'restaurant',
  music: 'headphones',
  gaming: 'sports_esports',
  office: 'business_center',
  pets: 'pets',
  baby: 'child_friendly',
  travel: 'flight',
  jewelry: 'diamond',
  tools: 'handyman',
  software: 'code',
  phones: 'smartphone',
  laptops: 'laptop',
  cameras: 'photo_camera',
  audio: 'headphones',
  appliances: 'kitchen',
};

const FALLBACK_ICON = 'category';

export function getCategoryIcon(categoryName: string): string {
  const key = categoryName.toLowerCase().trim();
  return ICON_MAP[key] ?? FALLBACK_ICON;
}

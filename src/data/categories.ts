export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'all' | 'goods' | 'services';
  description: string;
  count?: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    type: 'goods',
    description: 'Smartphones, laptops, monitors, smartwatches, and tech accessories'
  },
  {
    id: 'services-digital',
    name: 'Digital & Creative Services',
    slug: 'services-digital',
    type: 'services',
    description: 'Web development, UI/UX design, videography, branding, and social media'
  },
  {
    id: 'home-solar',
    name: 'Home, Furniture & Solar Power',
    slug: 'home-solar',
    type: 'goods',
    description: 'Inverters, solar generators, orthopaedic mattresses, and carved mahogany furniture'
  },
  {
    id: 'fashion-kente',
    name: 'Fashion, Kente & Apparel',
    slug: 'fashion-kente',
    type: 'goods',
    description: 'Authentic handwoven Kente, tailor-made smocks, shoes, and luxury fabrics'
  },
  {
    id: 'auto-parts',
    name: 'Auto, Motorcycles & Parts',
    slug: 'auto-parts',
    type: 'goods',
    description: 'Car batteries, motorbikes, vehicle spare parts, tyres, and accessories'
  },
  {
    id: 'farm-foodstuffs',
    name: 'Farm Produce & Foodstuffs',
    slug: 'farm-foodstuffs',
    type: 'goods',
    description: 'Organic honey, bags of rice, yam tubers, pure shea butter, and poultry feed'
  },
  {
    id: 'services-trades',
    name: 'Handyman, Electric & Plumbing',
    slug: 'services-trades',
    type: 'services',
    description: 'Solar panel installation, electrical wiring, carpentry, and AC repair'
  },
  {
    id: 'business-tutoring',
    name: 'Tutoring & Business Advisory',
    slug: 'business-tutoring',
    type: 'services',
    description: 'GRA tax filing support, French/Twi language tutoring, and accounting'
  },
  {
    id: 'audio-musical',
    name: 'Musical & Sound Equipment',
    slug: 'audio-musical',
    type: 'goods',
    description: 'Studio monitors, acoustic guitars, digital pianos, and wireless mics'
  }
];

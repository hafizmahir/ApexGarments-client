import { Product } from '../types/index.ts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Executive Slim-Fit Oxford Cotton Shirt',
    description: 'Premium 100% combed Egyptian cotton yarn with breathable weave, mother-of-pearl buttons, and wrinkle-resistant finishing. Ideal for luxury corporate uniform programs.',
    category: 'Shirt',
    price: 18.50,
    availableQuantity: 4500,
    minimumOrderQuantity: 100,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800'
    ],
    demoVideoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    paymentOptions: 'PayFirst',
    showOnHome: true,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'prod-002',
    name: 'Selvedge Indigo Raw Denim Jeans',
    description: '13.5 oz Japanese shuttle-loom selvedge denim, sanforized with chain-stitched hems, custom antique brass hardware, and reinforced pocket bags for long-lasting durability.',
    category: 'Denim',
    price: 24.00,
    availableQuantity: 3200,
    minimumOrderQuantity: 150,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800'
    ],
    demoVideoLink: '',
    paymentOptions: 'PayFirst',
    showOnHome: true,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-02-04T12:00:00.000Z',
    updatedAt: '2026-02-04T12:00:00.000Z'
  },
  {
    id: 'prod-003',
    name: 'All-Weather Technical Softshell Jacket',
    description: 'DWR water-repellent exterior with bonded micro-fleece thermal backing. YKK Aquaguard taped zippers, ergonomic articulation, and adjustable storm hood for outerwear brands.',
    category: 'Jacket',
    price: 38.00,
    availableQuantity: 2100,
    minimumOrderQuantity: 80,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800'
    ],
    demoVideoLink: 'https://assets.mixkit.co/videos/preview/mixkit-sewing-on-a-garment-factory-42477-large.mp4',
    paymentOptions: 'Cash on Delivery',
    showOnHome: true,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-02-10T14:30:00.000Z',
    updatedAt: '2026-02-10T14:30:00.000Z'
  },
  {
    id: 'prod-004',
    name: 'Heavyweight French Terry Oversized Hoodie',
    description: '450 GSM pure organic ring-spun cotton loopback knit, double-needle coverstitched seams, rib cuffs with 5% elastane retention, pre-shrunk and garment-dyed.',
    category: 'Knitwear',
    price: 21.50,
    availableQuantity: 5800,
    minimumOrderQuantity: 120,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800'
    ],
    paymentOptions: 'PayFirst',
    showOnHome: true,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-02-15T09:00:00.000Z'
  },
  {
    id: 'prod-005',
    name: 'Tailored Wool-Blend Formal Trousers',
    description: 'Crease-resistant 60% Australian Merino wool and 40% sustainable poly blend with interior curtain waistband, coin pocket detail, and unfinished hems for custom tailoring.',
    category: 'Pant',
    price: 26.75,
    availableQuantity: 2800,
    minimumOrderQuantity: 90,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800'
    ],
    paymentOptions: 'Cash on Delivery',
    showOnHome: true,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-02-20T11:45:00.000Z',
    updatedAt: '2026-02-20T11:45:00.000Z'
  },
  {
    id: 'prod-006',
    name: 'Seamless High-Performance Active Compression Tee',
    description: 'Hydrophobic moisture-wicking poly-spandex blend with body-mapped ventilation jacquard zones, 4-way mechanical stretch, and silver-ion antimicrobial finish.',
    category: 'Activewear',
    price: 14.20,
    availableQuantity: 6200,
    minimumOrderQuantity: 200,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800'
    ],
    paymentOptions: 'PayFirst',
    showOnHome: true,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-02-25T15:20:00.000Z',
    updatedAt: '2026-02-25T15:20:00.000Z'
  },
  {
    id: 'prod-007',
    name: 'Industrial Canvas Heavy-Duty Work Apron & Accessories',
    description: '16 oz dry-waxed cotton canvas with genuine full-grain leather straps, solid copper rivets, and reinforced tool pockets for artisan and workshop brands.',
    category: 'Accessories',
    price: 12.80,
    availableQuantity: 1900,
    minimumOrderQuantity: 50,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&q=80&w=800'
    ],
    paymentOptions: 'Cash on Delivery',
    showOnHome: false,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z'
  },
  {
    id: 'prod-008',
    name: 'Tactical Seam-Sealed Extreme Weather Parka',
    description: 'Triple-layer ripstop nylon shell with 20,000mm hydrostatic head waterproof rating, taped micro-seams, and insulated detachable baffle collar.',
    category: 'Jacket',
    price: 52.00,
    availableQuantity: 1400,
    minimumOrderQuantity: 60,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800'
    ],
    paymentOptions: 'PayFirst',
    showOnHome: false,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-03-04T11:00:00.000Z',
    updatedAt: '2026-03-04T11:00:00.000Z'
  },
  {
    id: 'prod-009',
    name: 'Heritage Pique Cotton Uniform Polo Shirt',
    description: '220 GSM 100% combed cotton honeycomb pique knit with ribbed collar and cuffs, side vents with herringbone tape reinforcement, and color-matched 3-button placket.',
    category: 'Shirt',
    price: 15.50,
    availableQuantity: 7500,
    minimumOrderQuantity: 150,
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'
    ],
    paymentOptions: 'Cash on Delivery',
    showOnHome: false,
    createdBy: {
      id: 'usr-mgr-01',
      name: 'Rashidul Karim',
      email: 'manager@garmentflow.com'
    },
    createdAt: '2026-03-06T14:15:00.000Z',
    updatedAt: '2026-03-06T14:15:00.000Z'
  }
];

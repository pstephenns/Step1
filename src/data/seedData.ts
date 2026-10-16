import { User, Listing, TradeOffer, Conversation, Message, Review, Report, AuditLog } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user_kwame',
    name: 'Kwame Mensah',
    email: 'kwame@goldcoasttrade.gh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    region: 'Greater Accra',
    city: 'East Legon, Accra',
    phone: '+233 24 412 3456',
    bio: 'Tech enthusiast, software hobbyist and photographer in East Legon. Love bartering electronics for renewable power or camera gear.',
    role: 'user',
    verifiedTrader: true,
    completedTradesCount: 14,
    trustRating: 4.9,
    reviewCount: 12,
    memberSince: 'March 2025',
    createdAt: '2025-03-12T00:00:00Z',
    blockedUserIds: []
  },
  {
    id: 'user_ama',
    name: 'Ama Serwaa',
    email: 'ama@goldcoasttrade.gh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    region: 'Greater Accra',
    city: 'Osu, Accra',
    phone: '+233 50 876 5432',
    bio: 'Full-stack UI/UX designer and web engineer based in Osu. Open to bartering professional web & branding packages for studio gear and furniture.',
    role: 'user',
    verifiedTrader: true,
    completedTradesCount: 8,
    trustRating: 5.0,
    reviewCount: 8,
    memberSince: 'January 2025',
    createdAt: '2025-01-15T00:00:00Z',
    blockedUserIds: []
  },
  {
    id: 'user_kojo',
    name: 'Kojo Darko',
    email: 'kojo@goldcoasttrade.gh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    region: 'Ashanti',
    city: 'Adum, Kumasi',
    phone: '+233 20 998 1122',
    bio: 'Solar technician and renewable energy distributor in Adum, Kumasi. Bartering solar equipment, batteries, and pure northern farm supplies.',
    role: 'user',
    verifiedTrader: true,
    completedTradesCount: 11,
    trustRating: 4.8,
    reviewCount: 9,
    memberSince: 'February 2025',
    createdAt: '2025-02-10T00:00:00Z',
    blockedUserIds: []
  },
  {
    id: 'user_abena',
    name: 'Abena Osei',
    email: 'abena@goldcoasttrade.gh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    region: 'Western',
    city: 'Takoradi Central',
    phone: '+233 27 334 5566',
    bio: 'Artisan textile weaver and collector of authentic Bonwire Kente in Takoradi. Interested in bartering authentic weaves for digital tools.',
    role: 'user',
    verifiedTrader: true,
    completedTradesCount: 6,
    trustRating: 4.9,
    reviewCount: 5,
    memberSince: 'April 2025',
    createdAt: '2025-04-05T00:00:00Z',
    blockedUserIds: []
  },
  {
    id: 'admin_kofi',
    name: 'Kofi Boateng (Admin)',
    email: 'admin@goldcoasttrade.gh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    region: 'Greater Accra',
    city: 'Airport Residential, Accra',
    phone: '+233 30 200 0001',
    bio: 'GoldCoast Trade Trust & Safety Lead. Keeping barter safe, authentic, and cash-free across Ghana.',
    role: 'admin',
    verifiedTrader: true,
    completedTradesCount: 32,
    trustRating: 5.0,
    reviewCount: 28,
    memberSince: 'January 2025',
    createdAt: '2025-01-01T00:00:00Z',
    blockedUserIds: []
  }
];

export const SEED_LISTINGS: Listing[] = [
  {
    id: 'list_macbook_m1',
    userId: 'user_kwame',
    userName: 'Kwame Mensah',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    userRegion: 'Greater Accra',
    userCity: 'East Legon, Accra',
    userRating: 4.9,
    userCompletedTrades: 14,
    userVerified: true,
    title: 'Apple MacBook Air M1 (16GB RAM, 512GB SSD) Space Gray',
    description: 'Pristine condition MacBook Air M1 with 16GB unified memory and 512GB storage. Battery cycle count only 74 (96% maximum health). Original Apple 30W charger and braided cable included. Zero scratches on display. Clean iCloud logged out ready for inspection.',
    category: 'Electronics & Gadgets',
    type: 'goods',
    condition: 'like_new',
    estimatedValueGHS: 7500,
    wishlistExchange: 'Portable Solar Generator (Anker/EcoFlow 800W+), DJI Mini 3 Pro Drone, or iPad Pro 11-inch with Apple Pencil.',
    images: [
      '/src/assets/images/listing_macbook_pro_1792135623934.jpg'
    ],
    region: 'Greater Accra',
    city: 'East Legon, Accra',
    meetupPreference: 'public_place',
    status: 'active',
    viewsCount: 342,
    createdAt: '2026-10-10T14:30:00Z',
    updatedAt: '2026-10-10T14:30:00Z'
  },
  {
    id: 'list_web_design_service',
    userId: 'user_ama',
    userName: 'Ama Serwaa',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userRegion: 'Greater Accra',
    userCity: 'Osu, Accra',
    userRating: 5.0,
    userCompletedTrades: 8,
    userVerified: true,
    title: 'Custom Brand Identity + High-Performance Next.js Web App',
    description: 'Offering a complete professional digital package: Brand identity (Vector logo, typography, color guide, pitch deck template) PLUS a custom 5-page responsive website built with Next.js/React and Tailwind CSS. Turnaround 14 business days. Includes 3 revision rounds and 6 months hosting assistance.',
    category: 'Digital & Creative Services',
    type: 'services',
    condition: 'not_applicable',
    estimatedValueGHS: 6200,
    wishlistExchange: 'Dell Ultrasharp 27" or 32" 4K Monitor, Herman Miller or ergonomic office chair, iPhone 13 Pro, or Solar inverter.',
    images: [
      '/src/assets/images/listing_web_service_1792135624275.jpg'
    ],
    region: 'Greater Accra',
    city: 'Osu, Accra',
    meetupPreference: 'flexible',
    status: 'active',
    viewsCount: 289,
    createdAt: '2026-10-11T09:15:00Z',
    updatedAt: '2026-10-11T09:15:00Z'
  },
  {
    id: 'list_solar_generator',
    userId: 'user_kojo',
    userName: 'Kojo Darko',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    userRegion: 'Ashanti',
    userCity: 'Adum, Kumasi',
    userRating: 4.8,
    userCompletedTrades: 11,
    userVerified: true,
    title: 'Anker Solix 1056Wh Portable Power Station + 200W Foldable Solar Panel',
    description: 'Heavy duty LiFePO4 battery generator (3000+ lifecycle rating to 80%). Features 1800W AC pure sine-wave output (runs fridge, TV, fans, workstations, medical equipment during ECG dumsor outages). Includes 200W foldable solar panel and MC4 charging cables. Tested and working 100%.',
    category: 'Home, Furniture & Solar Power',
    type: 'goods',
    condition: 'like_new',
    estimatedValueGHS: 8500,
    wishlistExchange: 'M1/M2 MacBook Air or Pro, Yamaha Digital Stage Piano, Honda 2.5kVA Inverter Generator, or High-end Mirrorless Camera.',
    images: [
      '/src/assets/images/listing_solar_generator_1792135624783.jpg'
    ],
    region: 'Ashanti',
    city: 'Adum, Kumasi',
    meetupPreference: 'police_station',
    status: 'active',
    viewsCount: 512,
    createdAt: '2026-10-12T11:00:00Z',
    updatedAt: '2026-10-12T11:00:00Z'
  },
  {
    id: 'list_kente_cloth',
    userId: 'user_abena',
    userName: 'Abena Osei',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    userRegion: 'Western',
    userCity: 'Takoradi Central',
    userRating: 4.9,
    userCompletedTrades: 6,
    userVerified: true,
    title: 'Authentic Handwoven Bonwire Royal Kente (3-Piece Full Ceremony Set)',
    description: 'Master artisan woven double-layer royal silk and cotton Kente cloth in gold, emerald green, and rich burgundy ("Adweneasa" pattern symbolising wisdom). Authentic hand-spun fringe. Suitable for weddings, chieftaincy functions, and heirloom collections.',
    category: 'Fashion, Kente & Apparel',
    type: 'goods',
    condition: 'new',
    estimatedValueGHS: 4500,
    wishlistExchange: 'iPad 10th Gen with Apple Pencil, Industrial Heavy-Duty Juki Sewing Machine, or Samsung Galaxy S22.',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80'
    ],
    region: 'Western',
    city: 'Takoradi Central',
    meetupPreference: 'public_place',
    status: 'active',
    viewsCount: 198,
    createdAt: '2026-10-13T16:20:00Z',
    updatedAt: '2026-10-13T16:20:00Z'
  },
  {
    id: 'list_shea_butter_bulk',
    userId: 'user_kojo',
    userName: 'Kojo Darko',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    userRegion: 'Ashanti',
    userCity: 'Adum, Kumasi',
    userRating: 4.8,
    userCompletedTrades: 11,
    userVerified: true,
    title: '50kg Pure Grade-A Unrefined Northern Shea Butter (Direct Tamale Source)',
    description: 'Freshly harvested, unrefined, chemical-free ivory Shea butter produced by women cooperations in Tamale. High stearic content, sweet nutty natural aroma. Packed in 5 food-grade 10kg buckets. Ideal for cosmetics producers, soapmakers, or distributors.',
    category: 'Farm Produce & Foodstuffs',
    type: 'goods',
    condition: 'new',
    estimatedValueGHS: 3200,
    wishlistExchange: 'Motorbike spare parts, weighing scales & heat sealers, or Android smartphone (Redmi / Samsung A series).',
    images: [
      'https://images.unsplash.com/photo-1608248597359-2911b3e817a0?w=800&auto=format&fit=crop&q=80'
    ],
    region: 'Ashanti',
    city: 'Adum, Kumasi',
    meetupPreference: 'public_place',
    status: 'active',
    viewsCount: 165,
    createdAt: '2026-10-14T08:45:00Z',
    updatedAt: '2026-10-14T08:45:00Z'
  },
  {
    id: 'list_solar_installation_service',
    userId: 'user_kojo',
    userName: 'Kojo Darko',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    userRegion: 'Ashanti',
    userCity: 'Adum, Kumasi',
    userRating: 4.8,
    userCompletedTrades: 11,
    userVerified: true,
    title: 'Full Residential Solar Inverter & Battery Wiring Service',
    description: 'Certified energy technician offering complete home solar setup: Inverter mounting, battery rack balancing, breaker distribution panel integration, and earthing installation (labor and engineering). Work includes post-installation testing and safety certification.',
    category: 'Handyman, Electric & Plumbing',
    type: 'services',
    condition: 'not_applicable',
    estimatedValueGHS: 2800,
    wishlistExchange: 'Bosch or DeWalt Cordless Power Tool Set (Hammer drill + Impact driver), or High-lumen LED outdoor floodlights.',
    images: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop&q=80'
    ],
    region: 'Ashanti',
    city: 'Adum, Kumasi',
    meetupPreference: 'flexible',
    status: 'active',
    viewsCount: 220,
    createdAt: '2026-10-14T10:30:00Z',
    updatedAt: '2026-10-14T10:30:00Z'
  }
];

export const SEED_OFFERS: TradeOffer[] = [
  {
    id: 'offer_ama_to_kwame',
    listingId: 'list_macbook_m1',
    listingTitle: 'Apple MacBook Air M1 (16GB RAM, 512GB SSD) Space Gray',
    listingImage: '/src/assets/images/listing_macbook_pro_1792135623934.jpg',
    listingEstimatedValueGHS: 7500,
    listingOwnerId: 'user_kwame',
    listingOwnerName: 'Kwame Mensah',
    offererId: 'user_ama',
    offererName: 'Ama Serwaa',
    offererAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    offererRegion: 'Greater Accra',
    offererCity: 'Osu, Accra',
    status: 'pending',
    offeredItems: [
      {
        id: 'offered_web_service',
        title: 'Complete Custom Brand Identity + Next.js Website Package',
        type: 'services',
        description: 'Full branding guide, vector logo, and responsive 5-page business site.',
        estimatedValueGHS: 6200,
        existingListingId: 'list_web_design_service'
      }
    ],
    optionalCashTopUpGHS: 1000,
    cashDirection: 'offered_by_sender',
    offerNote: 'Hello Kwame! I saw you are looking for design / dev services and tech gear. I can deliver the full brand & Next.js web application package plus GH₵ 1,000 cash top-up upon meeting at Accra Mall food court to balance the trade value. Let me know if this works for you!',
    counterHistory: [],
    mutualConfirmation: {
      ownerConfirmed: false,
      offererConfirmed: false
    },
    conversationId: 'conv_ama_kwame_offer',
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-10-15T10:00:00Z'
  },
  {
    id: 'offer_completed_sample',
    listingId: 'list_shea_butter_bulk',
    listingTitle: '50kg Pure Grade-A Unrefined Northern Shea Butter',
    listingImage: 'https://images.unsplash.com/photo-1608248597359-2911b3e817a0?w=800&auto=format&fit=crop&q=80',
    listingEstimatedValueGHS: 3200,
    listingOwnerId: 'user_kojo',
    listingOwnerName: 'Kojo Darko',
    offererId: 'user_kwame',
    offererName: 'Kwame Mensah',
    offererAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    offererRegion: 'Greater Accra',
    offererCity: 'East Legon, Accra',
    status: 'completed',
    offeredItems: [
      {
        id: 'item_sample_phone',
        title: 'Samsung Galaxy A53 5G 128GB (Dual SIM) + Spigen Case',
        type: 'goods',
        estimatedValueGHS: 3000
      }
    ],
    optionalCashTopUpGHS: 200,
    cashDirection: 'offered_by_sender',
    offerNote: 'Barter Samsung Galaxy phone in mint box with GH₵ 200 top-up for 50kg Shea butter buckets.',
    counterHistory: [],
    mutualConfirmation: {
      ownerConfirmed: true,
      offererConfirmed: true,
      ownerConfirmedAt: '2026-10-14T16:00:00Z',
      offererConfirmedAt: '2026-10-14T16:05:00Z'
    },
    conversationId: 'conv_completed_sample',
    createdAt: '2026-10-13T12:00:00Z',
    updatedAt: '2026-10-14T16:05:00Z'
  }
];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_ama_kwame_offer',
    tradeOfferId: 'offer_ama_to_kwame',
    listingId: 'list_macbook_m1',
    listingTitle: 'Apple MacBook Air M1 (16GB RAM, 512GB SSD) Space Gray',
    listingImage: '/src/assets/images/listing_macbook_pro_1792135623934.jpg',
    participantIds: ['user_kwame', 'user_ama'],
    participantNames: ['Kwame Mensah', 'Ama Serwaa'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    ],
    lastMessage: 'Hello Kwame! I can deliver the full brand & Next.js web application package plus GH₵ 1,000 cash top-up...',
    lastMessageTimestamp: '2026-10-15T10:00:00Z',
    unreadCountFor: {
      user_kwame: 1,
      user_ama: 0
    }
  },
  {
    id: 'conv_completed_sample',
    tradeOfferId: 'offer_completed_sample',
    listingId: 'list_shea_butter_bulk',
    listingTitle: '50kg Pure Grade-A Unrefined Northern Shea Butter',
    listingImage: 'https://images.unsplash.com/photo-1608248597359-2911b3e817a0?w=800&auto=format&fit=crop&q=80',
    participantIds: ['user_kojo', 'user_kwame'],
    participantNames: ['Kojo Darko', 'Kwame Mensah'],
    participantAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    ],
    lastMessage: 'Trade completed successfully! Both of us confirmed the exchange. Thanks Kojo!',
    lastMessageTimestamp: '2026-10-14T16:06:00Z',
    unreadCountFor: {
      user_kojo: 0,
      user_kwame: 0
    }
  }
];

export const SEED_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_ama_kwame_offer',
    senderId: 'user_ama',
    senderName: 'Ama Serwaa',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Hello Kwame! I submitted an offer on your MacBook Air M1. I am offering my full Brand Identity + Next.js web app package (valued at GH₵ 6,200) plus GH₵ 1,000 cash balance top-up.',
    timestamp: '2026-10-15T10:00:00Z',
    read: false
  },
  {
    id: 'msg_2',
    conversationId: 'conv_ama_kwame_offer',
    senderId: 'user_ama',
    senderName: 'Ama Serwaa',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'We can meet at Accra Mall food court during daylight hours so you can inspect my portfolio live and I can run diagnostics on the MacBook. Does Thursday 2 PM work?',
    timestamp: '2026-10-15T10:02:00Z',
    read: false
  },
  {
    id: 'msg_c1',
    conversationId: 'conv_completed_sample',
    senderId: 'user_kwame',
    senderName: 'Kwame Mensah',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Met at Adum Police Station frontage in Kumasi. Both goods thoroughly verified. Handover was smooth!',
    timestamp: '2026-10-14T15:50:00Z',
    read: true
  },
  {
    id: 'msg_c2',
    conversationId: 'conv_completed_sample',
    senderId: 'user_kojo',
    senderName: 'Kojo Darko',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'Confirmed! Samsung Galaxy phone received in perfect shape. Thank you Kwame.',
    timestamp: '2026-10-14T16:00:00Z',
    read: true
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    tradeOfferId: 'offer_completed_sample',
    listingId: 'list_shea_butter_bulk',
    listingTitle: '50kg Pure Grade-A Unrefined Northern Shea Butter',
    reviewerId: 'user_kwame',
    reviewerName: 'Kwame Mensah',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reviewedUserId: 'user_kojo',
    rating: 5,
    comment: 'Flawless barter exchange! Kojo brought authentic unrefined Shea butter exactly as described. Met right near the police station in Adum for peace of mind. Highly recommended trader!',
    badges: ['Accurate Description', 'Punctual', 'Honest Valuation'],
    createdAt: '2026-10-14T16:10:00Z'
  },
  {
    id: 'rev_2',
    tradeOfferId: 'offer_completed_sample',
    listingId: 'list_shea_butter_bulk',
    listingTitle: '50kg Pure Grade-A Unrefined Northern Shea Butter',
    reviewerId: 'user_kojo',
    reviewerName: 'Kojo Darko',
    reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    reviewedUserId: 'user_kwame',
    rating: 5,
    comment: 'Kwame is a gentleman trader. Samsung phone came with original box and clean factory reset. Fair value balancing with cash top-up. 10/10.',
    badges: ['Smooth Exchange', 'Great Communication'],
    createdAt: '2026-10-14T16:15:00Z'
  }
];

export const SEED_REPORTS: Report[] = [
  {
    id: 'rep_1',
    reporterId: 'user_ama',
    reporterName: 'Ama Serwaa',
    targetType: 'listing',
    targetId: 'list_fake_valuation_demo',
    targetTitleOrName: 'Suspicious 2024 iPhone with unrealistic GH₵ 500 valuation',
    reason: 'scam_fraud',
    details: 'User asked in chat to send Western Union or Mobile Money advance deposit before seeing the item. Violates safe barter policy.',
    status: 'resolved',
    createdAt: '2026-10-09T11:20:00Z',
    resolvedAt: '2026-10-09T13:40:00Z',
    adminNotes: 'Listing removed and offending user account suspended.'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_1',
    timestamp: '2026-10-09T13:40:00Z',
    actorId: 'admin_kofi',
    actorName: 'Kofi Boateng (Admin)',
    action: 'listing_deleted',
    details: 'Deleted flagged listing #list_fake_valuation_demo following verified advance-fee fee scam report.'
  },
  {
    id: 'audit_2',
    timestamp: '2026-10-10T09:00:00Z',
    actorId: 'admin_kofi',
    actorName: 'Kofi Boateng (Admin)',
    action: 'user_verified',
    details: 'Verified trader badge granted to Kwame Mensah after completing 10+ positive verified trades.'
  }
];

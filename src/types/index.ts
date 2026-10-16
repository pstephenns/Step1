/**
 * GoldCoast Trade - Type Definitions
 */

export type GhanaRegion =
  | 'Greater Accra'
  | 'Ashanti'
  | 'Western'
  | 'Central'
  | 'Eastern'
  | 'Volta'
  | 'Northern'
  | 'Upper East'
  | 'Upper West'
  | 'Bono'
  | 'Bono East'
  | 'Ahafo'
  | 'Oti'
  | 'Savannah'
  | 'North East'
  | 'Western North';

export type ListingType = 'goods' | 'services';

export type ItemCondition = 'new' | 'like_new' | 'gently_used' | 'fair' | 'not_applicable';

export type MeetupPreference = 'public_place' | 'police_station' | 'delivery' | 'flexible';

export type ListingStatus = 'active' | 'in_negotiation' | 'traded' | 'paused' | 'flagged';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  region: GhanaRegion;
  city: string; // e.g. "East Legon, Accra", "Adum, Kumasi"
  phone?: string;
  bio: string;
  role: 'user' | 'admin';
  verifiedTrader: boolean;
  completedTradesCount: number;
  trustRating: number; // e.g. 4.9
  reviewCount: number;
  memberSince: string;
  createdAt?: string;
  blockedUserIds: string[];
}

export interface Listing {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRegion: GhanaRegion;
  userCity: string;
  userRating: number;
  userCompletedTrades: number;
  userVerified: boolean;
  userMemberSince?: string;
  userCreatedAt?: string;
  title: string;
  description: string;
  category: string;
  type: ListingType;
  condition: ItemCondition;
  estimatedValueGHS: number; // For barter value balancing reference only
  wishlistExchange: string; // What the trader is seeking in return
  images: string[];
  region: GhanaRegion;
  city: string;
  meetupPreference: MeetupPreference;
  status: ListingStatus;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OfferedItem {
  id: string;
  title: string;
  type: ListingType;
  description?: string;
  estimatedValueGHS?: number;
  existingListingId?: string;
}

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'countered'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface CounterHistoryItem {
  id: string;
  byUserId: string;
  byUserName: string;
  note: string;
  offeredItems: OfferedItem[];
  optionalCashTopUpGHS: number;
  cashDirection: 'offered_by_sender' | 'requested_from_receiver' | 'none';
  timestamp: string;
}

export interface TradeOffer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingEstimatedValueGHS: number;
  listingOwnerId: string;
  listingOwnerName: string;
  offererId: string;
  offererName: string;
  offererAvatar: string;
  offererRegion: GhanaRegion;
  offererCity: string;
  status: OfferStatus;
  offeredItems: OfferedItem[];
  optionalCashTopUpGHS: number; // Cash top-up for value balance (e.g. +GH₵ 100)
  cashDirection: 'offered_by_sender' | 'requested_from_receiver' | 'none';
  offerNote: string;
  counterHistory: CounterHistoryItem[];
  // Mutual confirmation for safe completion:
  mutualConfirmation: {
    ownerConfirmed: boolean;
    offererConfirmed: boolean;
    ownerConfirmedAt?: string;
    offererConfirmedAt?: string;
  };
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  isSystemNotice?: boolean;
}

export interface Conversation {
  id: string;
  tradeOfferId: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  participantIds: [string, string];
  participantNames: [string, string];
  participantAvatars: [string, string];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCountFor: Record<string, number>;
}

export interface Review {
  id: string;
  tradeOfferId: string;
  listingId: string;
  listingTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewedUserId: string;
  rating: number; // 1 to 5
  comment: string;
  badges: string[]; // e.g. "Punctual", "Accurate Description", "Great Communication"
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitleOrName: string;
  reason: 'scam_fraud' | 'prohibited_item' | 'abusive_chat' | 'ghosting' | 'fake_valuation' | 'other';
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'offer_received'
    | 'offer_accepted'
    | 'offer_countered'
    | 'offer_rejected'
    | 'trade_completed'
    | 'new_message'
    | 'review_received'
    | 'system';
  link: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: 'listing_flagged' | 'listing_deleted' | 'user_banned' | 'user_verified' | 'report_resolved';
  details: string;
}

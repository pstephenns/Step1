import {
  User,
  Listing,
  TradeOffer,
  Conversation,
  Message,
  Review,
  Report,
  NotificationItem,
  AuditLog,
  GhanaRegion,
  ListingType,
  ItemCondition,
  MeetupPreference,
  OfferedItem
} from '../types';
import {
  SEED_USERS,
  SEED_LISTINGS,
  SEED_OFFERS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_REVIEWS,
  SEED_REPORTS,
  SEED_AUDIT_LOGS
} from '../data/seedData';
import { getUserVerificationDetails } from '../utils/userVerification';

const STORAGE_KEYS = {
  USERS: 'gct_users_v1',
  CURRENT_USER: 'gct_current_user_v1',
  LISTINGS: 'gct_listings_v1',
  OFFERS: 'gct_offers_v1',
  CONVERSATIONS: 'gct_conversations_v1',
  MESSAGES: 'gct_messages_v1',
  REVIEWS: 'gct_reviews_v1',
  REPORTS: 'gct_reports_v1',
  FAVOURITES: 'gct_favourites_v1',
  NOTIFICATIONS: 'gct_notifications_v1',
  AUDIT_LOGS: 'gct_audit_logs_v1'
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error('Storage error:', err);
  }
}

// Initialise storage if empty
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  } else {
    // Ensure all stored users have createdAt timestamps
    try {
      const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      let updated = false;
      existingUsers.forEach((u: any) => {
        if (!u.createdAt) {
          const match = SEED_USERS.find(s => s.id === u.id);
          u.createdAt = match?.createdAt || '2025-02-01T00:00:00Z';
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUsers));
      }
    } catch {}
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to Kwame Mensah for rich experience
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
  } else {
    try {
      const cur = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '{}');
      if (cur && !cur.createdAt) {
        const match = SEED_USERS.find(s => s.id === cur.id);
        cur.createdAt = match?.createdAt || '2025-03-12T00:00:00Z';
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(cur));
      }
    } catch {}
  }
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(SEED_LISTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(SEED_OFFERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(SEED_CONVERSATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVOURITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify({
      user_kwame: ['list_solar_generator'],
      user_ama: ['list_macbook_m1']
    }));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([
      {
        id: 'notif_welcome',
        userId: 'user_kwame',
        title: 'New Trade Offer Received',
        message: 'Ama Serwaa proposed a trade on your MacBook Air M1 (Brand package + GH₵ 1,000).',
        type: 'offer_received',
        link: '/offers',
        read: false,
        createdAt: '2026-10-15T10:01:00Z'
      }
    ]));
  }
}

// ----------------- AUTH & USER SERVICES -----------------

export function getCurrentUser(): User | null {
  return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function getAllUsers(): User[] {
  return getStored<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
}

export function getUserById(id: string): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

export function registerUser(params: {
  name: string;
  email: string;
  password?: string;
  region: GhanaRegion;
  city: string;
  phone?: string;
  bio?: string;
}): { success: boolean; error?: string; user?: User } {
  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === params.email.toLowerCase().trim());
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name.trim(),
    email: params.email.toLowerCase().trim(),
    password: params.password || 'password123',
    avatar: `https://images.unsplash.com/photo-${1534528741775 + (users.length % 5)}?w=150&auto=format&fit=crop&q=80`,
    region: params.region,
    city: params.city.trim() || `${params.region} Central`,
    phone: params.phone?.trim(),
    bio: params.bio?.trim() || 'Barter enthusiast looking to trade what I have and get what I need.',
    role: 'user',
    verifiedTrader: false,
    completedTradesCount: 0,
    trustRating: 5.0,
    reviewCount: 0,
    memberSince: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    createdAt: new Date().toISOString(),
    blockedUserIds: []
  };

  users.push(newUser);
  setStored(STORAGE_KEYS.USERS, users);
  setStored(STORAGE_KEYS.CURRENT_USER, newUser);

  addNotification({
    userId: newUser.id,
    title: 'Akwaaba to GoldCoast Trade!',
    message: 'Start by listing goods or services you want to barter, or browse Accra & Ghana listings.',
    type: 'system',
    link: '/marketplace'
  });

  return { success: true, user: newUser };
}

export function loginUser(email: string): { success: boolean; error?: string; user?: User } {
  const users = getAllUsers();
  const target = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!target) {
    return { success: false, error: 'No account found with this email. Please register.' };
  }

  setStored(STORAGE_KEYS.CURRENT_USER, target);
  return { success: true, user: target };
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  notifyListeners();
}

export function switchPersona(userId: string): User | null {
  const user = getUserById(userId);
  if (user) {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  }
  return null;
}

export function updateUserProfile(updates: Partial<User>): User | null {
  const current = getCurrentUser();
  if (!current) return null;

  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) return null;

  const updated: User = { ...users[idx], ...updates };
  users[idx] = updated;
  setStored(STORAGE_KEYS.USERS, users);
  setStored(STORAGE_KEYS.CURRENT_USER, updated);
  return updated;
}

export function blockUser(targetUserId: string): void {
  const current = getCurrentUser();
  if (!current || current.id === targetUserId) return;

  const blocked = current.blockedUserIds || [];
  if (!blocked.includes(targetUserId)) {
    updateUserProfile({ blockedUserIds: [...blocked, targetUserId] });
  }
}

export function unblockUser(targetUserId: string): void {
  const current = getCurrentUser();
  if (!current) return;

  const blocked = current.blockedUserIds || [];
  updateUserProfile({ blockedUserIds: blocked.filter(id => id !== targetUserId) });
}

// ----------------- LISTINGS SERVICES -----------------

export function getListings(filters?: {
  search?: string;
  category?: string;
  region?: string;
  type?: ListingType;
  minVal?: number;
  maxVal?: number;
  userId?: string;
  status?: string;
  verifiedOnly?: boolean;
}): Listing[] {
  let listings = getStored<Listing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  const current = getCurrentUser();
  const blocked = current?.blockedUserIds || [];

  // Exclude listings from blocked users
  if (blocked.length > 0) {
    listings = listings.filter(l => !blocked.includes(l.userId));
  }

  if (filters?.userId) {
    return listings.filter(l => l.userId === filters.userId);
  }

  if (filters?.status) {
    listings = listings.filter(l => l.status === filters.status);
  } else {
    // Default show active
    listings = listings.filter(l => l.status === 'active' || l.status === 'in_negotiation');
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    listings = listings.filter(
      l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.wishlistExchange.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
    );
  }

  if (filters?.category && filters.category !== 'all') {
    listings = listings.filter(l => l.category.toLowerCase().includes(filters.category!.toLowerCase()));
  }

  if (filters?.region && filters.region !== 'all') {
    listings = listings.filter(l => l.region === filters.region);
  }

  if (filters?.type) {
    listings = listings.filter(l => l.type === filters.type);
  }

  if (filters?.minVal !== undefined && filters.minVal > 0) {
    listings = listings.filter(l => l.estimatedValueGHS >= filters.minVal!);
  }

  if (filters?.maxVal !== undefined && filters.maxVal > 0) {
    listings = listings.filter(l => l.estimatedValueGHS <= filters.maxVal!);
  }

  if (filters?.verifiedOnly) {
    const users = getAllUsers();
    listings = listings.filter(l => {
      const u = users.find(user => user.id === l.userId);
      const v = getUserVerificationDetails({
        createdAt: l.userCreatedAt || u?.createdAt,
        memberSince: l.userMemberSince || u?.memberSince,
        completedTradesCount: l.userCompletedTrades || u?.completedTradesCount,
        trustRating: l.userRating || u?.trustRating,
        verifiedTrader: l.userVerified || u?.verifiedTrader
      });
      return v.isVerified;
    });
  }

  return listings;
}

export function getListingById(id: string): Listing | undefined {
  const listings = getStored<Listing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  return listings.find(l => l.id === id);
}

export function incrementListingView(id: string): void {
  const listings = getStored<Listing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  const idx = listings.findIndex(l => l.id === id);
  if (idx !== -1) {
    listings[idx].viewsCount = (listings[idx].viewsCount || 0) + 1;
    setStored(STORAGE_KEYS.LISTINGS, listings);
  }
}

export function createListing(params: {
  title: string;
  description: string;
  category: string;
  type: ListingType;
  condition: ItemCondition;
  estimatedValueGHS: number;
  wishlistExchange: string;
  images: string[];
  region: GhanaRegion;
  city: string;
  meetupPreference: MeetupPreference;
}): { success: boolean; listing?: Listing; error?: string } {
  const current = getCurrentUser();
  if (!current) {
    return { success: false, error: 'Please log in to create a listing.' };
  }

  const listings = getStored<Listing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);

  const defaultImage =
    params.type === 'goods'
      ? '/src/assets/images/listing_macbook_pro_1792135623934.jpg'
      : '/src/assets/images/listing_web_service_1792135624275.jpg';

  const newListing: Listing = {
    id: `list_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: current.id,
    userName: current.name,
    userAvatar: current.avatar,
    userRegion: current.region,
    userCity: current.city,
    userRating: current.trustRating,
    userCompletedTrades: current.completedTradesCount,
    userVerified: current.verifiedTrader,
    userMemberSince: current.memberSince,
    userCreatedAt: current.createdAt || new Date().toISOString(),
    title: params.title.trim(),
    description: params.description.trim(),
    category: params.category,
    type: params.type,
    condition: params.condition,
    estimatedValueGHS: Number(params.estimatedValueGHS) || 0,
    wishlistExchange: params.wishlistExchange.trim(),
    images: params.images.length > 0 ? params.images : [defaultImage],
    region: params.region,
    city: params.city.trim(),
    meetupPreference: params.meetupPreference,
    status: 'active',
    viewsCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  listings.unshift(newListing);
  setStored(STORAGE_KEYS.LISTINGS, listings);

  addNotification({
    userId: current.id,
    title: 'Listing Published!',
    message: `Your listing "${newListing.title}" is live for barter across Ghana.`,
    type: 'system',
    link: `/listing/${newListing.id}`
  });

  return { success: true, listing: newListing };
}

export function updateListing(id: string, updates: Partial<Listing>): boolean {
  const current = getCurrentUser();
  if (!current) return false;

  const listings = getStored<Listing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) return false;

  // Strict ownership check (or admin)
  if (listings[idx].userId !== current.id && current.role !== 'admin') {
    return false;
  }

  listings[idx] = { ...listings[idx], ...updates, updatedAt: new Date().toISOString() };
  setStored(STORAGE_KEYS.LISTINGS, listings);
  return true;
}

export function deleteListing(id: string): boolean {
  const current = getCurrentUser();
  if (!current) return false;

  const listings = getStored<Listing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  const target = listings.find(l => l.id === id);
  if (!target) return false;

  if (target.userId !== current.id && current.role !== 'admin') {
    return false;
  }

  const updated = listings.filter(l => l.id !== id);
  setStored(STORAGE_KEYS.LISTINGS, updated);

  if (current.role === 'admin') {
    addAuditLog({
      action: 'listing_deleted',
      details: `Admin deleted listing: "${target.title}" (ID: ${target.id}) by user ${target.userName}`
    });
  }

  return true;
}

// ----------------- TRADE OFFERS & NEGOTIATION -----------------

export function getTradeOffers(userId?: string): TradeOffer[] {
  const offers = getStored<TradeOffer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
  if (!userId) return offers;
  return offers.filter(o => o.listingOwnerId === userId || o.offererId === userId);
}

export function getTradeOfferById(id: string): TradeOffer | undefined {
  const offers = getStored<TradeOffer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
  return offers.find(o => o.id === id);
}

export function createTradeOffer(params: {
  listingId: string;
  offeredItems: OfferedItem[];
  optionalCashTopUpGHS: number;
  cashDirection: 'offered_by_sender' | 'requested_from_receiver' | 'none';
  offerNote: string;
}): { success: boolean; error?: string; offer?: TradeOffer } {
  const current = getCurrentUser();
  if (!current) {
    return { success: false, error: 'Please log in to propose a trade offer.' };
  }

  const listing = getListingById(params.listingId);
  if (!listing) {
    return { success: false, error: 'Target listing not found.' };
  }

  if (listing.userId === current.id) {
    return { success: false, error: 'You cannot make a trade offer on your own listing.' };
  }

  const offers = getStored<TradeOffer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newOffer: TradeOffer = {
    id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    listingId: listing.id,
    listingTitle: listing.title,
    listingImage: listing.images[0],
    listingEstimatedValueGHS: listing.estimatedValueGHS,
    listingOwnerId: listing.userId,
    listingOwnerName: listing.userName,
    offererId: current.id,
    offererName: current.name,
    offererAvatar: current.avatar,
    offererRegion: current.region,
    offererCity: current.city,
    status: 'pending',
    offeredItems: params.offeredItems,
    optionalCashTopUpGHS: params.optionalCashTopUpGHS,
    cashDirection: params.cashDirection,
    offerNote: params.offerNote,
    counterHistory: [],
    mutualConfirmation: {
      ownerConfirmed: false,
      offererConfirmed: false
    },
    conversationId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  offers.unshift(newOffer);
  setStored(STORAGE_KEYS.OFFERS, offers);

  // Create linked conversation
  const conversations = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  const newConversation: Conversation = {
    id: conversationId,
    tradeOfferId: newOffer.id,
    listingId: listing.id,
    listingTitle: listing.title,
    listingImage: listing.images[0],
    participantIds: [listing.userId, current.id],
    participantNames: [listing.userName, current.name],
    participantAvatars: [listing.userAvatar, current.avatar],
    lastMessage: params.offerNote || `Proposed a trade offer on "${listing.title}"`,
    lastMessageTimestamp: new Date().toISOString(),
    unreadCountFor: {
      [listing.userId]: 1,
      [current.id]: 0
    }
  };
  conversations.unshift(newConversation);
  setStored(STORAGE_KEYS.CONVERSATIONS, conversations);

  // Send initial message
  if (params.offerNote) {
    sendMessage({
      conversationId,
      content: params.offerNote
    });
  }

  // Notify listing owner
  addNotification({
    userId: listing.userId,
    title: 'New Trade Offer!',
    message: `${current.name} made a barter offer on your "${listing.title}".`,
    type: 'offer_received',
    link: `/offers`
  });

  return { success: true, offer: newOffer };
}

export function respondToOffer(
  offerId: string,
  action: 'accept' | 'reject' | 'counter',
  counterData?: {
    note: string;
    offeredItems: OfferedItem[];
    optionalCashTopUpGHS: number;
    cashDirection: 'offered_by_sender' | 'requested_from_receiver' | 'none';
  }
): boolean {
  const current = getCurrentUser();
  if (!current) return false;

  const offers = getStored<TradeOffer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
  const idx = offers.findIndex(o => o.id === offerId);
  if (idx === -1) return false;

  const offer = offers[idx];
  const isOwner = offer.listingOwnerId === current.id;
  const isOfferer = offer.offererId === current.id;

  if (!isOwner && !isOfferer) return false;

  const recipientId = isOwner ? offer.offererId : offer.listingOwnerId;

  if (action === 'accept') {
    offer.status = 'accepted';
    offer.updatedAt = new Date().toISOString();

    // Mark listing as in negotiation
    updateListing(offer.listingId, { status: 'in_negotiation' });

    addNotification({
      userId: recipientId,
      title: 'Offer Accepted! 🎉',
      message: `${current.name} accepted the trade offer on "${offer.listingTitle}". Coordinate safe public exchange in chat!`,
      type: 'offer_accepted',
      link: `/messages?conv=${offer.conversationId}`
    });

    sendSystemMessage(
      offer.conversationId,
      `🤝 Trade offer accepted! Please discuss safe exchange meetup location (e.g. Accra Mall or police station frontage) in daylight hours.`
    );
  } else if (action === 'reject') {
    offer.status = 'rejected';
    offer.updatedAt = new Date().toISOString();

    addNotification({
      userId: recipientId,
      title: 'Offer Declined',
      message: `${current.name} declined the barter offer on "${offer.listingTitle}".`,
      type: 'offer_rejected',
      link: `/offers`
    });

    sendSystemMessage(offer.conversationId, `Offer was declined by ${current.name}.`);
  } else if (action === 'counter' && counterData) {
    offer.status = 'countered';
    offer.counterHistory.push({
      id: `counter_${Date.now()}`,
      byUserId: current.id,
      byUserName: current.name,
      note: counterData.note,
      offeredItems: counterData.offeredItems,
      optionalCashTopUpGHS: counterData.optionalCashTopUpGHS,
      cashDirection: counterData.cashDirection,
      timestamp: new Date().toISOString()
    });
    offer.offeredItems = counterData.offeredItems;
    offer.optionalCashTopUpGHS = counterData.optionalCashTopUpGHS;
    offer.cashDirection = counterData.cashDirection;
    offer.offerNote = counterData.note;
    offer.updatedAt = new Date().toISOString();

    addNotification({
      userId: recipientId,
      title: 'Counter-Offer Received',
      message: `${current.name} submitted a counter-proposal on "${offer.listingTitle}".`,
      type: 'offer_countered',
      link: `/offers`
    });

    sendSystemMessage(
      offer.conversationId,
      `🔄 Counter-offer submitted by ${current.name}: "${counterData.note}". Check offers tab to review details.`
    );
  }

  offers[idx] = offer;
  setStored(STORAGE_KEYS.OFFERS, offers);
  return true;
}

// ----------------- MUTUAL COMPLETION & REVIEWS -----------------

export function confirmTradeCompletion(offerId: string): {
  success: boolean;
  bothCompleted: boolean;
  message: string;
} {
  const current = getCurrentUser();
  if (!current) return { success: false, bothCompleted: false, message: 'Please log in.' };

  const offers = getStored<TradeOffer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
  const idx = offers.findIndex(o => o.id === offerId);
  if (idx === -1) return { success: false, bothCompleted: false, message: 'Offer not found.' };

  const offer = offers[idx];
  const isOwner = offer.listingOwnerId === current.id;
  const isOfferer = offer.offererId === current.id;

  if (!isOwner && !isOfferer) {
    return { success: false, bothCompleted: false, message: 'Unauthorized.' };
  }

  const now = new Date().toISOString();
  if (isOwner) {
    offer.mutualConfirmation.ownerConfirmed = true;
    offer.mutualConfirmation.ownerConfirmedAt = now;
  }
  if (isOfferer) {
    offer.mutualConfirmation.offererConfirmed = true;
    offer.mutualConfirmation.offererConfirmedAt = now;
  }

  const bothDone = offer.mutualConfirmation.ownerConfirmed && offer.mutualConfirmation.offererConfirmed;

  if (bothDone) {
    offer.status = 'completed';
    offer.updatedAt = now;

    // Update listing to traded
    updateListing(offer.listingId, { status: 'traded' });

    // Increment completed trade counts for both users
    const users = getAllUsers();
    users.forEach(u => {
      if (u.id === offer.listingOwnerId || u.id === offer.offererId) {
        u.completedTradesCount = (u.completedTradesCount || 0) + 1;
        if (u.completedTradesCount >= 3) {
          u.verifiedTrader = true;
        }
      }
    });
    setStored(STORAGE_KEYS.USERS, users);

    // Refresh current user if matched
    const updatedCur = users.find(u => u.id === current.id);
    if (updatedCur) setStored(STORAGE_KEYS.CURRENT_USER, updatedCur);

    // Notify both parties
    addNotification({
      userId: offer.listingOwnerId,
      title: 'Trade Verified & Completed! 🏆',
      message: `Both parties confirmed item handover for "${offer.listingTitle}". You can now leave a verified trader review!`,
      type: 'trade_completed',
      link: `/offers`
    });
    addNotification({
      userId: offer.offererId,
      title: 'Trade Verified & Completed! 🏆',
      message: `Both parties confirmed item handover for "${offer.listingTitle}". You can now leave a verified trader review!`,
      type: 'trade_completed',
      link: `/offers`
    });

    sendSystemMessage(
      offer.conversationId,
      `🏆 MUTUAL CONFIRMATION COMPLETE: Both ${offer.listingOwnerName} and ${offer.offererName} have confirmed successful handover! Trade is now marked Completed.`
    );
  } else {
    // Notify the other party to confirm
    const otherPartyId = isOwner ? offer.offererId : offer.listingOwnerId;
    addNotification({
      userId: otherPartyId,
      title: 'Trade Completion Confirmation Requested',
      message: `${current.name} has confirmed item handover. Please confirm on your end to finalize trade and unlock reviews.`,
      type: 'system',
      link: `/offers`
    });

    sendSystemMessage(
      offer.conversationId,
      `⏳ ${current.name} confirmed trade completion. Waiting for other party confirmation.`
    );
  }

  offers[idx] = offer;
  setStored(STORAGE_KEYS.OFFERS, offers);

  return {
    success: true,
    bothCompleted: bothDone,
    message: bothDone
      ? 'Both parties confirmed! Trade is complete. You may now leave a review.'
      : 'You have confirmed handover! Waiting for the other trader to confirm.'
  };
}

export function submitReview(params: {
  tradeOfferId: string;
  rating: number;
  comment: string;
  badges: string[];
}): { success: boolean; error?: string } {
  const current = getCurrentUser();
  if (!current) return { success: false, error: 'Please log in to submit a review.' };

  const offer = getTradeOfferById(params.tradeOfferId);
  if (!offer) return { success: false, error: 'Trade offer not found.' };

  // STRICT REQUIREMENT: Only after mutual completion!
  if (offer.status !== 'completed') {
    return {
      success: false,
      error: 'Reviews can strictly only be submitted after BOTH parties have confirmed completed trade handover.'
    };
  }

  const isOwner = offer.listingOwnerId === current.id;
  const isOfferer = offer.offererId === current.id;
  if (!isOwner && !isOfferer) {
    return { success: false, error: 'Only participants of this completed barter can leave a review.' };
  }

  const reviewedUserId = isOwner ? offer.offererId : offer.listingOwnerId;
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);

  // Check if already reviewed
  const existing = reviews.find(
    r => r.tradeOfferId === params.tradeOfferId && r.reviewerId === current.id
  );
  if (existing) {
    return { success: false, error: 'You have already submitted a review for this trade.' };
  }

  const newReview: Review = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    tradeOfferId: params.tradeOfferId,
    listingId: offer.listingId,
    listingTitle: offer.listingTitle,
    reviewerId: current.id,
    reviewerName: current.name,
    reviewerAvatar: current.avatar,
    reviewedUserId,
    rating: params.rating,
    comment: params.comment.trim(),
    badges: params.badges,
    createdAt: new Date().toISOString()
  };

  reviews.unshift(newReview);
  setStored(STORAGE_KEYS.REVIEWS, reviews);

  // Recalculate recipient rating
  const userReviews = reviews.filter(r => r.reviewedUserId === reviewedUserId);
  const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;

  const users = getAllUsers();
  const targetUserIdx = users.findIndex(u => u.id === reviewedUserId);
  if (targetUserIdx !== -1) {
    users[targetUserIdx].trustRating = Number(avg.toFixed(1));
    users[targetUserIdx].reviewCount = userReviews.length;
    setStored(STORAGE_KEYS.USERS, users);
  }

  addNotification({
    userId: reviewedUserId,
    title: 'New Verified Barter Review! ⭐',
    message: `${current.name} rated you ${params.rating} stars for completed trade on "${offer.listingTitle}".`,
    type: 'review_received',
    link: `/user/${reviewedUserId}`
  });

  return { success: true };
}

export function getReviewsForUser(userId: string): Review[] {
  const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  return reviews.filter(r => r.reviewedUserId === userId);
}

// ----------------- MESSAGING -----------------

export function getConversations(userId?: string): Conversation[] {
  const conversations = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  if (!userId) return conversations;
  return conversations.filter(c => c.participantIds.includes(userId));
}

export function getConversationById(id: string): Conversation | undefined {
  const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  return convs.find(c => c.id === id);
}

export function getMessages(conversationId: string): Message[] {
  const msgs = getStored<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  return msgs.filter(m => m.conversationId === conversationId);
}

export function sendMessage(params: {
  conversationId: string;
  content: string;
}): Message | null {
  const current = getCurrentUser();
  if (!current) return null;

  const msgs = getStored<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  const newMsg: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId: params.conversationId,
    senderId: current.id,
    senderName: current.name,
    senderAvatar: current.avatar,
    content: params.content.trim(),
    timestamp: new Date().toISOString(),
    read: false
  };

  msgs.push(newMsg);
  setStored(STORAGE_KEYS.MESSAGES, msgs);

  // Update conversation
  const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  const idx = convs.findIndex(c => c.id === params.conversationId);
  if (idx !== -1) {
    convs[idx].lastMessage = params.content;
    convs[idx].lastMessageTimestamp = newMsg.timestamp;
    const otherId = convs[idx].participantIds.find(id => id !== current.id);
    if (otherId) {
      convs[idx].unreadCountFor[otherId] = (convs[idx].unreadCountFor[otherId] || 0) + 1;
    }
    setStored(STORAGE_KEYS.CONVERSATIONS, convs);
  }

  return newMsg;
}

function sendSystemMessage(conversationId: string, content: string): void {
  const msgs = getStored<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  const newMsg: Message = {
    id: `sys_${Date.now()}`,
    conversationId,
    senderId: 'system',
    senderName: 'GoldCoast SafeTrade',
    senderAvatar: '',
    content,
    timestamp: new Date().toISOString(),
    read: false,
    isSystemNotice: true
  };
  msgs.push(newMsg);
  setStored(STORAGE_KEYS.MESSAGES, msgs);
}

export function markConversationRead(conversationId: string): void {
  const current = getCurrentUser();
  if (!current) return;

  const convs = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  const idx = convs.findIndex(c => c.id === conversationId);
  if (idx !== -1) {
    convs[idx].unreadCountFor[current.id] = 0;
    setStored(STORAGE_KEYS.CONVERSATIONS, convs);
  }
}

// ----------------- FAVOURITES -----------------

export function getFavourites(): string[] {
  const current = getCurrentUser();
  if (!current) return [];
  const map = getStored<Record<string, string[]>>(STORAGE_KEYS.FAVOURITES, {});
  return map[current.id] || [];
}

export function toggleFavourite(listingId: string): boolean {
  const current = getCurrentUser();
  if (!current) return false;

  const map = getStored<Record<string, string[]>>(STORAGE_KEYS.FAVOURITES, {});
  const userFavs = map[current.id] || [];
  const exists = userFavs.includes(listingId);

  if (exists) {
    map[current.id] = userFavs.filter(id => id !== listingId);
  } else {
    map[current.id] = [...userFavs, listingId];
  }

  setStored(STORAGE_KEYS.FAVOURITES, map);
  return !exists;
}

// ----------------- NOTIFICATIONS -----------------

export function getNotifications(): NotificationItem[] {
  const current = getCurrentUser();
  if (!current) return [];
  const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  return notifs.filter(n => n.userId === current.id);
}

export function addNotification(params: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void {
  const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const newNotif: NotificationItem = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...params,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifs.unshift(newNotif);
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
}

export function markNotificationAsRead(id: string): void {
  const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const idx = notifs.findIndex(n => n.id === id);
  if (idx !== -1) {
    notifs[idx].read = true;
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
}

export function markAllNotificationsRead(): void {
  const current = getCurrentUser();
  if (!current) return;
  const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  notifs.forEach(n => {
    if (n.userId === current.id) n.read = true;
  });
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
}

// ----------------- REPORTS & MODERATION -----------------

export function submitReport(params: {
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitleOrName: string;
  reason: Report['reason'];
  details: string;
}): { success: boolean } {
  const current = getCurrentUser();
  const reports = getStored<Report[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);

  const newReport: Report = {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    reporterId: current?.id || 'anonymous',
    reporterName: current?.name || 'Guest User',
    targetType: params.targetType,
    targetId: params.targetId,
    targetTitleOrName: params.targetTitleOrName,
    reason: params.reason,
    details: params.details.trim(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  reports.unshift(newReport);
  setStored(STORAGE_KEYS.REPORTS, reports);

  // If listing was reported for scam, optionally flag it
  if (params.targetType === 'listing') {
    updateListing(params.targetId, { status: 'flagged' });
  }

  return { success: true };
}

export function getAllReports(): Report[] {
  return getStored<Report[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
}

export function updateReportStatus(
  reportId: string,
  status: 'resolved' | 'dismissed',
  adminNotes?: string
): void {
  const reports = getStored<Report[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
  const idx = reports.findIndex(r => r.id === reportId);
  if (idx !== -1) {
    reports[idx].status = status;
    reports[idx].resolvedAt = new Date().toISOString();
    if (adminNotes) reports[idx].adminNotes = adminNotes;
    setStored(STORAGE_KEYS.REPORTS, reports);

    addAuditLog({
      action: 'report_resolved',
      details: `Report ${reportId} marked as ${status}. ${adminNotes || ''}`
    });
  }
}

// ----------------- AUDIT LOGS -----------------

export function getAuditLogs(): AuditLog[] {
  return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
}

export function addAuditLog(params: { action: AuditLog['action']; details: string }): void {
  const current = getCurrentUser();
  const logs = getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  const newLog: AuditLog = {
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorId: current?.id || 'admin_system',
    actorName: current?.name || 'Admin',
    action: params.action,
    details: params.details
  };
  logs.unshift(newLog);
  setStored(STORAGE_KEYS.AUDIT_LOGS, logs);
}

// ----------------- ADMIN ACTIONS -----------------

export function toggleUserVerification(userId: string): boolean {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;

  users[idx].verifiedTrader = !users[idx].verifiedTrader;
  setStored(STORAGE_KEYS.USERS, users);

  addAuditLog({
    action: 'user_verified',
    details: `Toggled verified trader status for ${users[idx].name} to ${users[idx].verifiedTrader}`
  });

  return true;
}

export function toggleUserBan(userId: string): boolean {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;

  const current = getCurrentUser();
  // Don't ban yourself
  if (current?.id === userId) return false;

  const isBanned = (users[idx] as any).banned || false;
  (users[idx] as any).banned = !isBanned;
  setStored(STORAGE_KEYS.USERS, users);

  addAuditLog({
    action: 'user_banned',
    details: `${!isBanned ? 'Banned' : 'Unbanned'} user ${users[idx].name} (ID: ${userId})`
  });

  return true;
}

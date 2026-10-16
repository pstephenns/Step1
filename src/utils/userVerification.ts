/**
 * GoldCoast Trade - User Verification & Account Activity Age Helper
 * Determines trust status based on registration date, account longevity, and barter activity.
 */

export interface VerificationDetails {
  isVerified: boolean;
  level: 'veteran' | 'established' | 'verified' | 'emerging';
  title: string;
  shortBadge: string;
  ageDays: number;
  ageMonths: number;
  ageFormatted: string;
  memberSinceFormatted: string;
  criteria: string[];
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

// Convert "Month Year" string like "March 2025" or ISO string to Date
export function parseDate(dateInput?: string): Date {
  if (!dateInput) return new Date('2025-03-01T00:00:00Z');
  
  // If ISO format
  if (dateInput.includes('T') || dateInput.includes('-')) {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) return d;
  }

  // If "Month Year" format e.g. "March 2025"
  const parts = dateInput.trim().split(' ');
  if (parts.length === 2) {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const monthIdx = months.indexOf(parts[0].toLowerCase());
    const year = parseInt(parts[1], 10);
    if (monthIdx !== -1 && !isNaN(year)) {
      return new Date(Date.UTC(year, monthIdx, 1));
    }
  }

  const fallback = new Date(dateInput);
  return isNaN(fallback.getTime()) ? new Date('2025-01-01T00:00:00Z') : fallback;
}

export function calculateAccountAge(
  createdAtOrMemberSince?: string,
  referenceNow: Date = new Date()
): { days: number; months: number; years: number; formatted: string; memberSince: string } {
  const joinDate = parseDate(createdAtOrMemberSince);
  const diffMs = Math.max(0, referenceNow.getTime() - joinDate.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30.4375);
  const years = +(days / 365.25).toFixed(1);

  let formatted = '';
  if (days < 30) {
    formatted = `${days} day${days === 1 ? '' : 's'} active`;
  } else if (months < 12) {
    formatted = `${months} month${months === 1 ? '' : 's'} active`;
  } else {
    formatted = `${years} yr${years === 1 ? '' : 's'} active`;
  }

  const memberSince = joinDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });

  return { days, months, years, formatted, memberSince };
}

export function getUserVerificationDetails(user: {
  createdAt?: string;
  memberSince?: string;
  completedTradesCount?: number;
  trustRating?: number;
  verifiedTrader?: boolean;
}): VerificationDetails {
  const dateStr = user.createdAt || user.memberSince || 'January 2025';
  const { days, months, years, formatted, memberSince } = calculateAccountAge(dateStr);
  const completed = user.completedTradesCount || 0;
  const rating = user.trustRating || 5.0;

  // Account activity age thresholds:
  // Veteran: >= 365 days (1+ year)
  // Established: >= 90 days (~3 months)
  // Verified Active: >= 30 days OR >= 3 completed trades
  // Emerging: < 30 days
  let level: 'veteran' | 'established' | 'verified' | 'emerging' = 'emerging';
  let title = 'New Barterer';
  let shortBadge = 'New Member';
  let isVerified = false;
  let colorClass = 'text-neutral-600';
  let bgClass = 'bg-neutral-100';
  let borderClass = 'border-neutral-200';

  if (days >= 365 || years >= 1.0) {
    level = 'veteran';
    title = 'Verified Veteran Trader';
    shortBadge = `Verified · ${years >= 1 ? `${years}y` : '1y+'} active`;
    isVerified = true;
    colorClass = 'text-[#006B45]';
    bgClass = 'bg-emerald-50';
    borderClass = 'border-emerald-300';
  } else if (days >= 90 || months >= 3) {
    level = 'established';
    title = 'Verified Established Trader';
    shortBadge = `Verified · ${months}mo active`;
    isVerified = true;
    colorClass = 'text-[#006B45]';
    bgClass = 'bg-emerald-50';
    borderClass = 'border-emerald-200';
  } else if (days >= 30 || completed >= 3 || user.verifiedTrader) {
    level = 'verified';
    title = 'Verified Trader';
    shortBadge = `Verified · ${days}d active`;
    isVerified = true;
    colorClass = 'text-[#006B45]';
    bgClass = 'bg-emerald-50';
    borderClass = 'border-emerald-200';
  } else {
    level = 'emerging';
    title = 'New Barterer';
    shortBadge = `New · ${days}d active`;
    isVerified = false;
    colorClass = 'text-neutral-600';
    bgClass = 'bg-neutral-100';
    borderClass = 'border-neutral-200';
  }

  const criteria: string[] = [
    `Account active for ${formatted} (Registered: ${memberSince})`,
    `${completed} completed barter trades confirmed in person`,
    `Community trust rating: ${rating.toFixed(1)} / 5.0`,
    isVerified
      ? 'Verified account activity age milestone met (>30 days active or established trade history)'
      : 'Account in probationary activity period (<30 days active)'
  ];

  return {
    isVerified,
    level,
    title,
    shortBadge,
    ageDays: days,
    ageMonths: months,
    ageFormatted: formatted,
    memberSinceFormatted: memberSince,
    criteria,
    colorClass,
    bgClass,
    borderClass
  };
}

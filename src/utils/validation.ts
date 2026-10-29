import { z } from 'zod';

// Sanitization utility against XSS
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .trim();
}

// Sanitization utility against LLM prompt injection
export function sanitizePromptText(text: string): string {
  if (!text) return '';
  // Remove dangerous instruction overrides (e.g. "ignore previous instructions")
  return text
    .replace(/(?:ignore|disregard|override)\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|rules|prompts)/gi, '[sanitized_instruction]')
    .replace(/system\s*:\s*/gi, '')
    .slice(0, 1500) // enforce reasonable limit
    .trim();
}

export const createEventSchema = z.object({
  title: z.string().min(3, 'Event title must be at least 3 characters').max(100),
  type: z.enum(['wedding', 'birthday', 'community', 'anniversary', 'corporate', 'festival']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date (YYYY-MM-DD)'),
  location: z.string().min(2, 'Location is required').max(150),
  guestCount: z.number().int().positive('Guest count must be at least 1').max(50000),
  totalBudget: z.number().nonnegative('Budget cannot be negative').max(100000000),
  currency: z.enum(['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD']),
  themeNotes: z.string().max(500).optional(),
});

export const budgetItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters').max(100),
  category: z.enum(['venue', 'catering', 'decor', 'photography', 'entertainment', 'attire', 'logistics', 'marketing', 'permits', 'contingency', 'other']),
  estimatedCost: z.number().nonnegative('Cost cannot be negative'),
  actualCost: z.number().nonnegative().optional().default(0),
  paid: z.boolean().default(false),
  notes: z.string().max(300).optional(),
  dueDate: z.string().optional(),
});

export const milestoneSchema = z.object({
  title: z.string().min(3, 'Milestone title is required').max(120),
  description: z.string().max(300).optional().default(''),
  phase: z.enum(['12_months', '6_months', '3_months', '1_month', '1_week', 'day_of', 'post_event']),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date required'),
  category: z.enum(['venue', 'catering', 'decor', 'photography', 'entertainment', 'attire', 'logistics', 'marketing', 'permits', 'contingency', 'other', 'general']),
  priority: z.enum(['high', 'medium', 'low']),
});

export const vendorSchema = z.object({
  name: z.string().min(2, 'Vendor name is required').max(100),
  category: z.enum(['venue', 'catering', 'florist', 'photography', 'videography', 'dj_music', 'cake', 'transport', 'rentals', 'entertainment', 'speaker', 'security', 'other']),
  status: z.enum(['researching', 'contacted', 'quoted', 'booked', 'completed', 'cancelled']),
  contactPerson: z.string().max(100).optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  estimatedCost: z.number().nonnegative().default(0),
  quoteAmount: z.number().nonnegative().default(0),
  depositPaid: z.number().nonnegative().default(0),
  notes: z.string().max(500).optional(),
  rating: z.number().min(1).max(5).optional(),
});

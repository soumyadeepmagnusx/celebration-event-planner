import { EventData } from '../types/event';
import { DEFAULT_EVENTS } from '../constants/defaultEvents';

const STORAGE_KEY = 'celebratify_events_data_v1';
const ACTIVE_EVENT_KEY = 'celebratify_active_event_id';
const API_KEY_STORAGE = 'celebratify_gemini_api_key';

export function loadEventsFromStorage(): EventData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveEventsToStorage(DEFAULT_EVENTS);
      return DEFAULT_EVENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_EVENTS;
  } catch (err) {
    console.error('Failed to load events from storage, using defaults:', err);
    return DEFAULT_EVENTS;
  }
}

export function saveEventsToStorage(events: EventData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to storage:', err);
  }
}

export function getActiveEventId(): string {
  try {
    return localStorage.getItem(ACTIVE_EVENT_KEY) || DEFAULT_EVENTS[0].id;
  } catch {
    return DEFAULT_EVENTS[0].id;
  }
}

export function setActiveEventId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_EVENT_KEY, id);
  } catch (err) {
    console.error('Failed to set active event ID:', err);
  }
}

export function getStoredApiKey(): string {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (stored) return stored;
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  } catch (err) {
    console.error('Failed to store API key:', err);
  }
}

export function exportEventToJSON(event: EventData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_plan.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importEventFromJSON(jsonString: string): EventData {
  const parsed = JSON.parse(jsonString);
  if (!parsed.id || !parsed.title || !parsed.type) {
    throw new Error('Invalid event structure in uploaded JSON file.');
  }
  // Ensure array structures exist
  parsed.budgetItems = Array.isArray(parsed.budgetItems) ? parsed.budgetItems : [];
  parsed.milestones = Array.isArray(parsed.milestones) ? parsed.milestones : [];
  parsed.runOfShow = Array.isArray(parsed.runOfShow) ? parsed.runOfShow : [];
  parsed.vendors = Array.isArray(parsed.vendors) ? parsed.vendors : [];
  parsed.themes = Array.isArray(parsed.themes) ? parsed.themes : [];
  parsed.invitations = Array.isArray(parsed.invitations) ? parsed.invitations : [];
  parsed.menus = Array.isArray(parsed.menus) ? parsed.menus : [];
  parsed.entertainment = Array.isArray(parsed.entertainment) ? parsed.entertainment : [];
  parsed.speeches = Array.isArray(parsed.speeches) ? parsed.speeches : [];
  parsed.contingencies = Array.isArray(parsed.contingencies) ? parsed.contingencies : [];
  parsed.updatedAt = new Date().toISOString();
  return parsed;
}

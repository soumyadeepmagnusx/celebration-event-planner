import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  EventData, 
  BudgetItem, 
  Milestone, 
  RunOfShowItem, 
  Vendor, 
  ThemeIdea, 
  InvitationCopy, 
  MenuIdea, 
  EntertainmentIdea, 
  SpeechIdea, 
  ContingencyPlan, 
  ChatMessage 
} from '../types/event';
import { 
  loadEventsFromStorage, 
  saveEventsToStorage, 
  getActiveEventId, 
  setActiveEventId as persistActiveId,
  getStoredApiKey,
  setStoredApiKey as persistApiKey
} from '../services/storageService';
import { DEFAULT_EVENTS } from '../constants/defaultEvents';
import { chatWithAICoPlanner } from '../services/geminiService';

interface EventContextType {
  events: EventData[];
  activeEvent: EventData;
  activeEventId: string;
  selectEvent: (id: string) => void;
  createEvent: (newEvent: EventData) => void;
  updateEventDetails: (updates: Partial<EventData>) => void;
  deleteEvent: (id: string) => void;
  resetToDefaults: () => void;
  
  // Budget
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  toggleItemPaid: (id: string) => void;

  // Milestones & Run of Show
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  toggleMilestone: (id: string) => void;
  deleteMilestone: (id: string) => void;
  addRunOfShowItem: (item: Omit<RunOfShowItem, 'id'>) => void;
  toggleRunOfShowItem: (id: string) => void;
  deleteRunOfShowItem: (id: string) => void;

  // Vendors
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // Creative Ideas
  addTheme: (theme: ThemeIdea) => void;
  addInvitation: (invitation: InvitationCopy) => void;
  addMenu: (menu: MenuIdea) => void;
  addEntertainment: (entertainment: EntertainmentIdea) => void;
  addSpeech: (speech: SpeechIdea) => void;
  addContingency: (contingency: ContingencyPlan) => void;

  // AI Assistant Chat & Key
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  isGeneratingAI: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventData[]>(() => loadEventsFromStorage());
  const [activeEventId, setActiveEventIdState] = useState<string>(() => getActiveEventId());
  const [apiKey, setApiKeyState] = useState<string>(() => getStoredApiKey());
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I am Celebratify Co-Planner, your AI event planning assistant. I can help organize budgets, draft vendor negotiation emails, format your Day-Of timeline, or invent personalized creative themes! How can I assist you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  const activeEvent: EventData = events.find(e => e.id === activeEventId) || events[0] || DEFAULT_EVENTS[0];

  const selectEvent = (id: string) => {
    setActiveEventIdState(id);
    persistActiveId(id);
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    persistApiKey(key);
  };

  const createEvent = (newEvent: EventData) => {
    setEvents(prev => [newEvent, ...prev]);
    selectEvent(newEvent.id);
  };

  const updateEventDetails = (updates: Partial<EventData>) => {
    setEvents(prev => prev.map(e => {
      if (e.id === activeEventId) {
        return { ...e, ...updates, updatedAt: new Date().toISOString() };
      }
      return e;
    }));
  };

  const deleteEvent = (id: string) => {
    if (events.length <= 1) {
      alert('You must have at least one active event project.');
      return;
    }
    const filtered = events.filter(e => e.id !== id);
    setEvents(filtered);
    if (activeEventId === id) {
      selectEvent(filtered[0].id);
    }
  };

  const resetToDefaults = () => {
    setEvents(DEFAULT_EVENTS);
    selectEvent(DEFAULT_EVENTS[0].id);
  };

  // --- Budget Actions ---
  const addBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = { ...item, id: `b-${Date.now()}` };
    updateEventDetails({
      budgetItems: [...activeEvent.budgetItems, newItem],
    });
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    updateEventDetails({
      budgetItems: activeEvent.budgetItems.map(b => b.id === id ? { ...b, ...updates } : b),
    });
  };

  const deleteBudgetItem = (id: string) => {
    updateEventDetails({
      budgetItems: activeEvent.budgetItems.filter(b => b.id !== id),
    });
  };

  const toggleItemPaid = (id: string) => {
    updateEventDetails({
      budgetItems: activeEvent.budgetItems.map(b => b.id === id ? { ...b, paid: !b.paid } : b),
    });
  };

  // --- Milestones & Run of Show ---
  const addMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newM: Milestone = { ...milestone, id: `m-${Date.now()}` };
    updateEventDetails({
      milestones: [...activeEvent.milestones, newM],
    });
  };

  const toggleMilestone = (id: string) => {
    updateEventDetails({
      milestones: activeEvent.milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m),
    });
  };

  const deleteMilestone = (id: string) => {
    updateEventDetails({
      milestones: activeEvent.milestones.filter(m => m.id !== id),
    });
  };

  const addRunOfShowItem = (item: Omit<RunOfShowItem, 'id'>) => {
    const newRos: RunOfShowItem = { ...item, id: `ros-${Date.now()}` };
    updateEventDetails({
      runOfShow: [...activeEvent.runOfShow, newRos],
    });
  };

  const toggleRunOfShowItem = (id: string) => {
    updateEventDetails({
      runOfShow: activeEvent.runOfShow.map(r => r.id === id ? { ...r, completed: !r.completed } : r),
    });
  };

  const deleteRunOfShowItem = (id: string) => {
    updateEventDetails({
      runOfShow: activeEvent.runOfShow.filter(r => r.id !== id),
    });
  };

  // --- Vendors ---
  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newV: Vendor = { ...vendor, id: `v-${Date.now()}` };
    updateEventDetails({
      vendors: [...activeEvent.vendors, newV],
    });
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    updateEventDetails({
      vendors: activeEvent.vendors.map(v => v.id === id ? { ...v, ...updates } : v),
    });
  };

  const deleteVendor = (id: string) => {
    updateEventDetails({
      vendors: activeEvent.vendors.filter(v => v.id !== id),
    });
  };

  // --- Ideas ---
  const addTheme = (theme: ThemeIdea) => {
    updateEventDetails({ themes: [theme, ...activeEvent.themes] });
  };

  const addInvitation = (invitation: InvitationCopy) => {
    updateEventDetails({ invitations: [invitation, ...activeEvent.invitations] });
  };

  const addMenu = (menu: MenuIdea) => {
    updateEventDetails({ menus: [menu, ...activeEvent.menus] });
  };

  const addEntertainment = (entertainment: EntertainmentIdea) => {
    updateEventDetails({ entertainment: [entertainment, ...activeEvent.entertainment] });
  };

  const addSpeech = (speech: SpeechIdea) => {
    updateEventDetails({ speeches: [speech, ...activeEvent.speeches] });
  };

  const addContingency = (contingency: ContingencyPlan) => {
    updateEventDetails({ contingencies: [contingency, ...activeEvent.contingencies] });
  };

  // --- AI Co-Planner Chat ---
  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setIsGeneratingAI(true);

    try {
      const responseText = await chatWithAICoPlanner(activeEvent, newHistory, content.trim());
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I'm currently reviewing your event plan for "${activeEvent.title}". Check out your Budget and Vendors tabs to see automated insights, or ask me for advice on seating, menus, and timelines!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. How can I help you plan ${activeEvent.title}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        activeEvent,
        activeEventId,
        selectEvent,
        createEvent,
        updateEventDetails,
        deleteEvent,
        resetToDefaults,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        toggleItemPaid,
        addMilestone,
        toggleMilestone,
        deleteMilestone,
        addRunOfShowItem,
        toggleRunOfShowItem,
        deleteRunOfShowItem,
        addVendor,
        updateVendor,
        deleteVendor,
        addTheme,
        addInvitation,
        addMenu,
        addEntertainment,
        addSpeech,
        addContingency,
        chatMessages,
        sendChatMessage,
        clearChat,
        isGeneratingAI,
        apiKey,
        setApiKey,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export function useEvent(): EventContextType {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}

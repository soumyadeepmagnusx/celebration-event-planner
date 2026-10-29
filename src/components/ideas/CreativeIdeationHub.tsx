import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  generateCreativeThemes, 
  generateInvitationCopy, 
  generateMenuIdeas, 
  generateEntertainmentPlan, 
  generateSpeechToast, 
  generateContingencyPlan 
} from '../../services/geminiService';
import { 
  Sparkles, 
  Palette, 
  Mail, 
  Utensils, 
  Music, 
  Mic, 
  ShieldAlert, 
  Copy, 
  Check, 
  Loader2
} from 'lucide-react';

export const CreativeIdeationHub: React.FC = () => {
  const { 
    activeEvent, 
    addTheme, 
    addInvitation, 
    addMenu, 
    addEntertainment, 
    addSpeech, 
    addContingency 
  } = useEvent();

  const [activeCategory, setActiveCategory] = useState<'themes' | 'invitations' | 'menus' | 'entertainment' | 'speeches' | 'contingencies'>('themes');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for specialized prompts
  const [customThemePrompt, setCustomThemePrompt] = useState('');
  const [selectedInviteTone, setSelectedInviteTone] = useState<string>('warm');
  const [menuDietaryNote, setMenuDietaryNote] = useState('');
  const [speechRole, setSpeechRole] = useState('Best Man / Maid of Honor');
  const [speechTone, setSpeechTone] = useState('Warm, witty, and heartfelt');
  const [speechMemory, setSpeechMemory] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Handlers for Generation ---
  const handleGenerateThemes = async () => {
    setIsGenerating(true);
    try {
      const themes = await generateCreativeThemes(activeEvent, customThemePrompt);
      themes.forEach(t => addTheme(t));
      setCustomThemePrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateInvite = async () => {
    setIsGenerating(true);
    try {
      const invite = await generateInvitationCopy(activeEvent, selectedInviteTone);
      addInvitation(invite);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMenu = async () => {
    setIsGenerating(true);
    try {
      const menu = await generateMenuIdeas(activeEvent, menuDietaryNote);
      addMenu(menu);
      setMenuDietaryNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateEntertainment = async () => {
    setIsGenerating(true);
    try {
      const ent = await generateEntertainmentPlan(activeEvent);
      addEntertainment(ent);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSpeech = async () => {
    setIsGenerating(true);
    try {
      const speech = await generateSpeechToast(activeEvent, speechRole, speechTone, speechMemory);
      addSpeech(speech);
      setSpeechMemory('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContingencies = async () => {
    setIsGenerating(true);
    try {
      const plans = await generateContingencyPlan(activeEvent);
      plans.forEach(p => addContingency(p));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Category Pills Navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setActiveCategory('themes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeCategory === 'themes'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Themes & Aesthetics ({activeEvent.themes.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('invitations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeCategory === 'invitations'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Invitation Copy ({activeEvent.invitations.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('menus')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeCategory === 'menus'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Food & Beverage ({activeEvent.menus.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('entertainment')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeCategory === 'entertainment'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Music & Playlists ({activeEvent.entertainment.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('speeches')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeCategory === 'speeches'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Speech Writer ({activeEvent.speeches.length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('contingencies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeCategory === 'contingencies'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Plan B Contingencies ({activeEvent.contingencies.length})</span>
        </button>
      </div>

      {/* 1. THEMES TAB */}
      {activeCategory === 'themes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label htmlFor="theme-prompt-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Customize Theme Mood / Inspiration (Optional)
              </label>
              <input
                id="theme-prompt-input"
                type="text"
                value={customThemePrompt}
                onChange={(e) => setCustomThemePrompt(e.target.value)}
                placeholder="e.g. Modern Sunset Bohemian with dried florals and amber uplighting..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>
            <button
              onClick={handleGenerateThemes}
              disabled={isGenerating}
              className="sm:self-end px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-700 hover:to-pink-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Themes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeEvent.themes.map((theme) => (
              <div
                key={theme.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {theme.category || theme.decorStyle} {theme.vibe && `• ${theme.vibe}`}
                    </span>
                    {theme.impact && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        ★ {theme.impact}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {theme.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                {/* Color Swatches */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Cohesive Color Palette
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {theme.colorPalette.map((col, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">{col.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{col.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sensory Details */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Sensory Experience:</span>
                  <span className="text-slate-600 dark:text-slate-400">{theme.sensoryDetails}</span>
                </div>

                {/* DIY Tips */}
                {theme.diyTips && theme.diyTips.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Budget-Friendly DIY Decor Tips
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {theme.diyTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-500 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. INVITATIONS TAB */}
      {activeCategory === 'invitations' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
              <label htmlFor="invite-tone-select" className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">
                Select Invitation Tone:
              </label>
              <select
                id="invite-tone-select"
                value={selectedInviteTone}
                onChange={(e) => setSelectedInviteTone(e.target.value)}
                className="px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              >
                <option value="warm">Warm & Heartfelt</option>
                <option value="formal">Formal & Black Tie</option>
                <option value="witty">Witty & Lighthearted</option>
                <option value="playful">Playful & Upbeat</option>
                <option value="cultural">Cultural & Traditional</option>
                <option value="minimalist">Minimalist Modern</option>
              </select>
            </div>
            <button
              onClick={handleGenerateInvite}
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Draft New Invitation Copy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeEvent.invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                    Tone: {inv.tone}
                  </span>
                  <button
                    onClick={() => copyToClipboard(`${inv.headline}\n\n${inv.body}\n\nRSVP: ${inv.rsvpWording}\n\nDress Code: ${inv.dressCodeNotice}`, inv.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    {copiedId === inv.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === inv.id ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-center py-4 px-2 space-y-3 font-serif">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                    {inv.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {inv.body}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-400">
                  <p><strong>RSVP:</strong> {inv.rsvpWording}</p>
                  <p><strong>Dress Code:</strong> {inv.dressCodeNotice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MENUS TAB */}
      {activeCategory === 'menus' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label htmlFor="menu-dietary-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Dietary Requirements or Cuisines (Optional)
              </label>
              <input
                id="menu-dietary-input"
                type="text"
                value={menuDietaryNote}
                onChange={(e) => setMenuDietaryNote(e.target.value)}
                placeholder="e.g. Italian Mediterranean with vegan options, nut-free desserts..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>
            <button
              onClick={handleGenerateMenu}
              disabled={isGenerating}
              className="sm:self-end px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Curate Menu with AI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeEvent.menus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {menu.title}
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-brand-600 mb-1">
                      Welcome Drinks & Sips
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {menu.welcomeDrinks.map((d, i) => <li key={i}>🍹 {d}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-brand-600 mb-1">
                      Passed Appetizers & Canapés
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {menu.appetizers.map((a, i) => <li key={i}>🍢 {a}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-brand-600 mb-1">
                      Signature Mains & Stations
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {menu.mains.map((m, i) => <li key={i}>🍽️ {m}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-brand-600 mb-1">
                      Artisan Desserts & Sweets
                    </h4>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {menu.desserts.map((ds, i) => <li key={i}>🍰 {ds}</li>)}
                    </ul>
                  </div>

                  {menu.dietaryAccommodations && menu.dietaryAccommodations.length > 0 && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 text-xs">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Dietary & Allergen Accommodations:</span>
                      <ul className="text-emerald-700 dark:text-emerald-400 space-y-0.5">
                        {menu.dietaryAccommodations.map((a, i) => <li key={i}>✓ {a}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ENTERTAINMENT TAB */}
      {activeCategory === 'entertainment' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleGenerateEntertainment}
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Music Vibe & Activities</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeEvent.entertainment.map((ent) => (
              <div
                key={ent.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Playlist Atmosphere
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {ent.playlistVibe}
                  </h3>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Key Moment Soundtracks
                  </h4>
                  <div className="space-y-2">
                    {ent.keyMoments.map((km, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{km.moment}</span>
                        <span className="text-brand-600 dark:text-brand-400 font-medium">{km.suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Interactive Activities & Games
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {ent.interactiveActivities.map((act, i) => (
                      <li key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30 flex items-start gap-2">
                        <span className="text-brand-500 font-bold">✨</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SPEECHES TAB */}
      {activeCategory === 'speeches' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Speech & Toast Ghostwriter
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="speech-speaker-role" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Speaker Role
                </label>
                <input
                  id="speech-speaker-role"
                  type="text"
                  value={speechRole}
                  onChange={(e) => setSpeechRole(e.target.value)}
                  placeholder="e.g. Best Man, Maid of Honor, Parent, Birthday Host"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="speech-tone-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Tone & Style
                </label>
                <input
                  id="speech-tone-input"
                  type="text"
                  value={speechTone}
                  onChange={(e) => setSpeechTone(e.target.value)}
                  placeholder="e.g. Playful, deeply emotional, inspiring"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="speech-memory-notes" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Personal Memory / Inside Joke (Optional)
              </label>
              <textarea
                id="speech-memory-notes"
                rows={2}
                value={speechMemory}
                onChange={(e) => setSpeechMemory(e.target.value)}
                placeholder="e.g. Traveled across Europe together in 2019, how they met on a rainy Tuesday..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateSpeech}
                disabled={isGenerating}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Write 2.5-Minute Speech</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {activeEvent.speeches.map((sp) => (
              <div
                key={sp.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Speech for: {sp.speakerRole}
                    </h4>
                    <p className="text-xs text-slate-500">Tone: {sp.tone}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(sp.speechText, sp.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copiedId === sp.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === sp.id ? 'Copied!' : 'Copy Speech'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {sp.speechText}
                </div>

                {sp.keyPoints && sp.keyPoints.length > 0 && (
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Speaker Cue Points:</span>
                    <ul className="flex flex-wrap gap-2">
                      {sp.keyPoints.map((pt, i) => (
                        <li key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                          ✓ {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CONTINGENCIES TAB */}
      {activeCategory === 'contingencies' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleGenerateContingencies}
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              <span>Generate Plan-B Risk Protections</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeEvent.contingencies.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    c.severity === 'high'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {c.severity} Severity Risk
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {c.risk}
                </h4>

                <div className="text-xs space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Pre-Event Mitigation:</span>
                    <span className="text-slate-600 dark:text-slate-400">{c.mitigation}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-brand-50/50 dark:bg-brand-950/20 border-l-2 border-brand-500">
                    <span className="font-bold text-brand-900 dark:text-brand-300 block mb-0.5">Plan B Immediate Action:</span>
                    <span className="text-brand-800 dark:text-brand-200">{c.planBAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

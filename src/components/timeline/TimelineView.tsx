import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { TimelinePhase } from '../../types/event';
import { TIMELINE_PHASES } from '../../constants/categories';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { milestoneSchema, sanitizeInput } from '../../utils/validation';
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Clock, 
  Trash2, 
  Calendar, 
  ListOrdered,
  MapPin,
  UserCheck
} from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { 
    activeEvent, 
    addMilestone, 
    toggleMilestone, 
    deleteMilestone,
    addRunOfShowItem,
    toggleRunOfShowItem,
    deleteRunOfShowItem
  } = useEvent();

  const [activeSubTab, setActiveSubTab] = useState<'milestones' | 'runOfShow'>('milestones');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isAddRosModalOpen, setIsAddRosModalOpen] = useState(false);

  // Milestone Form
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mPhase, setMPhase] = useState<TimelinePhase>('3_months');
  const [mDueDate, setMDueDate] = useState('');
  const [mPriority, setMPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [mErrors, setMErrors] = useState<Record<string, string>>({});

  // Run of Show Form
  const [rosTime, setRosTime] = useState('04:00 PM');
  const [rosTitle, setRosTitle] = useState('');
  const [rosDuration, setRosDuration] = useState(30);
  const [rosLead, setRosLead] = useState('');
  const [rosLocation, setRosLocation] = useState('');
  const [rosNotes, setRosNotes] = useState('');

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: sanitizeInput(mTitle),
      description: sanitizeInput(mDesc),
      phase: mPhase,
      dueDate: mDueDate || activeEvent.date,
      category: 'general' as const,
      priority: mPriority,
    };

    const res = milestoneSchema.safeParse(payload);
    if (!res.success) {
      const errMap: Record<string, string> = {};
      res.error.issues.forEach(i => {
        if (i.path[0]) errMap[i.path[0].toString()] = i.message;
      });
      setMErrors(errMap);
      return;
    }

    addMilestone({
      ...res.data,
      completed: false,
    });

    setMTitle('');
    setMDesc('');
    setMDueDate('');
    setMErrors({});
    setIsAddMilestoneModalOpen(false);
  };

  const handleCreateRosItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rosTitle.trim()) return;

    addRunOfShowItem({
      time: rosTime,
      title: sanitizeInput(rosTitle),
      durationMinutes: Number(rosDuration) || 30,
      leadPerson: sanitizeInput(rosLead || 'Event Host'),
      location: sanitizeInput(rosLocation || activeEvent.location),
      notes: sanitizeInput(rosNotes),
      completed: false,
    });

    setRosTitle('');
    setRosNotes('');
    setIsAddRosModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Subtab Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('milestones')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'milestones'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Milestones Schedule ({activeEvent.milestones.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('runOfShow')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'runOfShow'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Day-Of Run-of-Show ({activeEvent.runOfShow.length})</span>
          </button>
        </div>

        <div>
          {activeSubTab === 'milestones' ? (
            <button
              onClick={() => setIsAddMilestoneModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddRosModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day-Of Item</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: MILESTONES SCHEDULE */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-6">
          {/* Phase Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedPhaseFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPhaseFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All Phases
            </button>
            {TIMELINE_PHASES.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPhaseFilter(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedPhaseFilter === p.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Grouped Timeline Phases */}
          <div className="space-y-6">
            {TIMELINE_PHASES.filter(phase => selectedPhaseFilter === 'all' || selectedPhaseFilter === phase.id).map(phase => {
              const phaseMilestones = activeEvent.milestones.filter(m => m.phase === phase.id);
              if (phaseMilestones.length === 0 && selectedPhaseFilter !== 'all') return null;

              return (
                <div key={phase.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-500" />
                      {phase.label}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {phaseMilestones.filter(m => m.completed).length} / {phaseMilestones.length} completed
                    </span>
                  </div>

                  {phaseMilestones.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No milestones set for this phase.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {phaseMilestones.map(m => (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                            m.completed
                              ? 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-800/50 opacity-75'
                              : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleMilestone(m.id)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                              aria-label={`Mark ${m.title} as ${m.completed ? 'incomplete' : 'complete'}`}
                            >
                              {m.completed ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>

                            <div>
                              <p className={`text-xs sm:text-sm font-bold ${
                                m.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                              }`}>
                                {m.title}
                              </p>
                              {m.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {m.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                                <span>Due: {formatDate(m.dueDate)}</span>
                                {m.priority === 'high' && (
                                  <span className="px-1.5 py-0.2 rounded font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                                    High Priority
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteMilestone(m.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            aria-label={`Delete milestone ${m.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: DAY-OF RUN-OF-SHOW ITINERARY */}
      {activeSubTab === 'runOfShow' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Day-Of Execution Itinerary (Run of Show)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minute-by-minute schedule from arrival to final send-off on {formatDate(activeEvent.date)}.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
              {activeEvent.runOfShow.length} Timed Items
            </span>
          </div>

          {activeEvent.runOfShow.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No itinerary items yet. Click "+ Add Day-Of Item" to outline your minute-by-minute schedule!
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-200 dark:border-brand-900 space-y-6">
              {activeEvent.runOfShow.map((ros) => (
                <div key={ros.id} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 transition-colors ${
                    ros.completed ? 'bg-emerald-500' : 'bg-brand-500'
                  }`} />

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-md text-xs font-black bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 tabular-nums">
                          {ros.time}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          ({ros.durationMinutes} mins)
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {ros.title}
                        </h4>
                      </div>

                      {ros.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                          {ros.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-brand-500" />
                          Lead: {ros.leadPerson}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-500" />
                          Location: {ros.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => toggleRunOfShowItem(ros.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                          ros.completed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        {ros.completed ? 'Completed' : 'Mark Done'}
                      </button>

                      <button
                        onClick={() => deleteRunOfShowItem(ros.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        aria-label={`Delete ${ros.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => setIsAddMilestoneModalOpen(false)}
        title="Add Timeline Milestone"
        description="Schedule a critical planning checkpoint for your celebration."
      >
        <form onSubmit={handleCreateMilestone} className="space-y-4">
          <div>
            <label htmlFor="milestone-title" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Milestone Title
            </label>
            <input
              id="milestone-title"
              type="text"
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
              placeholder="e.g. Confirm Seating Chart & Print Escort Cards"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
            {mErrors.title && <p className="mt-1 text-xs text-rose-500">{mErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="milestone-desc" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Description / Action Steps
            </label>
            <textarea
              id="milestone-desc"
              rows={2}
              value={mDesc}
              onChange={(e) => setMDesc(e.target.value)}
              placeholder="e.g. Gather final dietary cards from venue coordinator."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="milestone-phase" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Phase
              </label>
              <select
                id="milestone-phase"
                value={mPhase}
                onChange={(e) => setMPhase(e.target.value as TimelinePhase)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              >
                {TIMELINE_PHASES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="milestone-due" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Target Due Date
              </label>
              <input
                id="milestone-due"
                type="date"
                value={mDueDate}
                onChange={(e) => setMDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="milestone-priority" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Priority
              </label>
              <select
                id="milestone-priority"
                value={mPriority}
                onChange={(e) => setMPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddMilestoneModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Run of Show Item Modal */}
      <Modal
        isOpen={isAddRosModalOpen}
        onClose={() => setIsAddRosModalOpen(false)}
        title="Add Day-Of Itinerary Item"
        description="Insert a scheduled moment into the minute-by-minute execution timeline."
      >
        <form onSubmit={handleCreateRosItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="ros-time" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Start Time
              </label>
              <input
                id="ros-time"
                type="text"
                value={rosTime}
                onChange={(e) => setRosTime(e.target.value)}
                placeholder="e.g. 05:30 PM"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="ros-duration" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Duration (Mins)
              </label>
              <input
                id="ros-duration"
                type="number"
                min="5"
                step="5"
                value={rosDuration}
                onChange={(e) => setRosDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="ros-lead" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Lead Person / Vendor
              </label>
              <input
                id="ros-lead"
                type="text"
                value={rosLead}
                onChange={(e) => setRosLead(e.target.value)}
                placeholder="e.g. Best Man / DJ"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ros-title" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Activity Title
            </label>
            <input
              id="ros-title"
              type="text"
              required
              value={rosTitle}
              onChange={(e) => setRosTitle(e.target.value)}
              placeholder="e.g. Cocktail Hour & Signature Drink Unveiling"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="ros-location" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Specific Room / Location
            </label>
            <input
              id="ros-location"
              type="text"
              value={rosLocation}
              onChange={(e) => setRosLocation(e.target.value)}
              placeholder="e.g. Garden Pavilion South Terrace"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="ros-notes" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Execution Notes
            </label>
            <textarea
              id="ros-notes"
              rows={2}
              value={rosNotes}
              onChange={(e) => setRosNotes(e.target.value)}
              placeholder="e.g. Acoustic guitar plays softly; passed appetizers commence immediately."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddRosModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
            >
              Add Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

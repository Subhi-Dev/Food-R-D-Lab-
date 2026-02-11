import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  FlaskConical,
  Clock,
  MapPin,
  MoreVertical,
  Plus
} from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

const Schedule: React.FC = () => {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const calendarEvents = useQuery(api.schedule.listEvents) ?? []
  const agendaTasks = useQuery(api.schedule.listAgenda) ?? []

  // Events filtered for "Microbial Testing" highlighting
  const getEventStyle = (title: string, type: string) => {
    if (title.toLowerCase().includes('microbial') || type === 'testing') {
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800/50'
    }
    if (title.toLowerCase().includes('sampling')) {
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800/50'
    }
    switch (type) {
      case 'monitoring':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800/50'
      case 'panel':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-orange-200 dark:border-orange-800/50'
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-700'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Schedule
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
            Lab rotation & Equipment reservation
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-800">
          <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-2">
            <CalendarIcon
              size={16}
              className="text-gray-400 dark:text-slate-500"
            />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              Oct 23 - 29, 2023
            </span>
          </div>
          <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Timeline (Left) */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-sm p-8 min-h-[600px]">
          {/* Days Header */}
          <div className="grid grid-cols-5 mb-8">
            {DAYS.map((day, i) => (
              <div key={day} className="text-center group cursor-pointer">
                <span className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {day}
                </span>
                <div
                  className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-xl font-bold transition-all ${
                    i === 1
                      ? 'bg-gray-900 dark:bg-indigo-600 text-white shadow-lg shadow-gray-900/20 dark:shadow-indigo-600/30 scale-110'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-slate-700'
                  }`}
                >
                  {23 + i}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline content */}
          <div className="space-y-4">
            {/* Mock Time Blocks */}
            {[9, 10, 11, 12, 13, 14, 15, 16].map((hour) => {
              // Find events starting at this hour (rounded down)
              const hourEvents = calendarEvents.filter(
                (e: any) => Math.floor(e.startHour) === hour
              )

              return (
                <div key={hour} className="flex gap-6 group">
                  <div className="w-16 text-right pt-2 text-xs font-bold text-gray-300 dark:text-slate-600 font-mono group-hover:text-gray-500 dark:group-hover:text-slate-400 transition-colors">
                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                  </div>
                  <div className="flex-1 border-t border-gray-100 dark:border-slate-800 relative min-h-[5rem] py-2">
                    {hourEvents.map((ev, idx) => (
                      <div
                        key={idx}
                        className={`absolute left-0 right-0 mx-4 p-4 rounded-[1.5rem] border ${getEventStyle(ev.title, ev.type)} flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer`}
                        style={{ top: '0', zIndex: 10 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/40 dark:bg-black/20 rounded-full">
                            <FlaskConical size={18} className="opacity-80" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm leading-tight">
                              {ev.title}
                            </h4>
                            <p className="text-xs opacity-70 font-medium">
                              {ev.subTitle || 'Lab 4 - Workstation'}
                            </p>
                          </div>
                        </div>

                        {/* Badge for Microbial */}
                        {ev.title.toLowerCase().includes('microbial') && (
                          <span className="bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            High Priority
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Sidebar: Agenda & Tools */}
        <div className="w-80 space-y-6 hidden xl:block">
          {/* Today's Focus */}
          <div className="bg-[#FFF7ED] dark:bg-orange-900/10 dark:border dark:border-orange-500/20 rounded-[2.5rem] p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-orange-900 dark:text-orange-100 font-bold text-lg mb-1">
                Today's Focus
              </h3>
              <p className="text-orange-800/60 dark:text-orange-200/60 text-xs font-medium mb-6">
                4 tasks remaining
              </p>

              <div className="space-y-3">
                {agendaTasks.slice(0, 3).map((task: any, i: number) => (
                  <div
                    key={i}
                    className="bg-white/60 dark:bg-white/5 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-3"
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'bg-transparent border-orange-300 dark:border-orange-500/50'}`}
                    ></div>
                    <span
                      className={`text-sm font-bold ${task.status === 'done' ? 'text-gray-400 dark:text-slate-500 line-through' : 'text-orange-900 dark:text-orange-100'}`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Decor */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/50 dark:bg-orange-500/10 rounded-full blur-2xl"></div>
          </div>

          {/* Quick Action */}
          <button className="w-full py-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-[2rem] font-bold shadow-lg shadow-gray-900/20 dark:shadow-indigo-600/30 hover:bg-gray-800 dark:hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
            <Plus size={20} />
            Book Equipment
          </button>

          {/* Upcoming */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Up Next
              </h3>
              <MoreVertical
                size={16}
                className="text-gray-400 dark:text-slate-500"
              />
            </div>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500">
                  WED
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  25
                </span>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  Sensory Panel
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-slate-400">
                  <Clock size={12} /> 2:00 PM
                  <MapPin size={12} /> Room 102
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule

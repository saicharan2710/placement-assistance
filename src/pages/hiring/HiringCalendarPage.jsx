import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import HiringLayout from '../../components/hiring/HiringLayout';

const events = [
  { date: '2026-03-28', title: 'Infosys HackWithInfy Round 1', company: 'Infosys', time: '09:00 AM', type: 'Test' },
  { date: '2026-03-28', title: 'TCS NQT Registration Deadline', company: 'TCS', time: '11:59 PM', type: 'Deadline' },
  { date: '2026-03-29', title: 'Amazon SDE Intern - Coding Test', company: 'Amazon', time: '10:00 AM', type: 'Test' },
  { date: '2026-04-01', title: 'Amazon Application Deadline', company: 'Amazon', time: '11:59 PM', type: 'Deadline' },
  { date: '2026-04-02', title: 'JP Morgan Technical Interview', company: 'JP Morgan', time: '11:00 AM', type: 'Interview' },
  { date: '2026-04-05', title: 'JP Morgan Application Deadline', company: 'JP Morgan', time: '11:59 PM', type: 'Deadline' },
  { date: '2026-04-08', title: 'Microsoft Intern - Coding Round', company: 'Microsoft', time: '02:00 PM', type: 'Test' },
  { date: '2026-04-10', title: 'Accenture Data Analyst Deadline', company: 'Accenture', time: '11:59 PM', type: 'Deadline' },
  { date: '2026-04-15', title: 'TCS NQT Registration Deadline', company: 'TCS', time: '11:59 PM', type: 'Deadline' },
  { date: '2026-04-15', title: 'Wipro Application Deadline', company: 'Wipro', time: '11:59 PM', type: 'Deadline' },
];

const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
const startOffset = 0; // March 2026 starts on Sunday

const dotColor = {
  Test: 'bg-blue-500',
  Interview: 'bg-green-500',
  Deadline: 'bg-orange-500',
  Notice: 'bg-purple-500',
};

export default function HiringCalendarPage() {
  const [selectedDate, setSelectedDate] = useState('2026-03-28');

  const dateEvents = useMemo(() => events.filter((e) => e.date === selectedDate), [selectedDate]);
  const upcoming = useMemo(() => events.slice(0, 5), []);

  return (
    <HiringLayout>
      <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-[#F4F4F5]">Placement Calendar</h1>
        <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mt-1">Track upcoming drives, tests and interviews</p>
      </motion.div>

      <motion.div className="flex items-center justify-between mb-4 glass-card px-4 py-3" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <motion.button className="glass-button-outline px-3 py-1 hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>&lt;</motion.button>
        <p className="font-semibold text-gray-900 dark:text-[#F4F4F5]">March 2026</p>
        <motion.button className="glass-button-outline px-3 py-1 hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>&gt;</motion.button>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <div className="space-y-4">
          <div className="glass-card p-4">
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startOffset }).map((_, idx) => <div key={`empty-${idx}`} className="h-14" />)}
              {monthDays.map((day) => {
                const date = `2026-03-${String(day).padStart(2, '0')}`;
                const dayEvents = events.filter((e) => e.date === date);
                const isToday = day === 28;
                return (
                  <motion.button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`h-14 rounded-lg border text-sm flex flex-col items-center justify-center ${
                      selectedDate === date
                        ? 'border-blue-600 bg-blue-600/20'
                        : 'border-white/10 hover:border-blue-500/50'
                    } ${isToday ? 'bg-blue-600/15' : ''}`}
                    whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  >
                    <span className="text-gray-900 dark:text-[#F4F4F5]">{day}</span>
                    <div className="flex gap-1 mt-1">
                      {dayEvents.slice(0, 2).map((e, idx) => (
                        <span key={idx} className={`w-1.5 h-1.5 rounded-full ${dotColor[e.type] || 'bg-purple-500'}`} />
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-[#F4F4F5] mb-3">Upcoming This Week</h3>
            <div className="space-y-2">
              {upcoming.map((e, idx) => (
                <motion.div key={`${e.title}-${idx}`} className="flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-blue-500/20 rounded-lg px-2 py-1" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
                  <span className={`w-2 h-2 rounded-full ${dotColor[e.type] || 'bg-purple-500'}`} />
                  <span className="text-gray-900 dark:text-[#F4F4F5]">{e.title}</span>
                  <span className="text-gray-600 dark:text-[#A1A1AA] ml-auto">{e.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-4 h-fit">
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#F4F4F5] mb-3">Events - {selectedDate}</h2>
          <div className="space-y-3">
            {dateEvents.length === 0 && <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">No events</p>}
            {dateEvents.map((e, idx) => (
              <motion.div key={`${e.title}-${idx}`} className="glass-card p-3 border-l-2 border-blue-500 hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
                <p className="font-semibold text-gray-900 dark:text-[#F4F4F5] text-sm">{e.title}</p>
                <p className="text-xs text-gray-600 dark:text-[#A1A1AA]">{e.company} • {e.time}</p>
                <span className={`mt-2 inline-block ${e.type === 'Interview' ? 'glass-pill-green' : e.type === 'Deadline' ? 'glass-pill-yellow' : 'glass-pill-blue'}`}>{e.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </HiringLayout>
  );
}

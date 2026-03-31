import React, { useMemo, useState } from 'react';
import HiringLayout from '../../components/hiring/HiringLayout';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const trackerRows = [
  { company: 'TCS', job: 'Software Engineer', round: 'Round 1', title: 'Screening', status: 'CLEARED', date: '28 Mar 2026' },
  { company: 'TCS', job: 'Software Engineer', round: 'Round 2', title: 'Aptitude Test', status: 'PENDING', date: '30 Mar 2026' },
  { company: 'Infosys', job: 'Systems Engineer', round: 'Round 1', title: 'Screening', status: 'CLEARED', date: '24 Mar 2026' },
  { company: 'Infosys', job: 'Systems Engineer', round: 'Round 2', title: 'Online Test', status: 'CLEARED', date: '26 Mar 2026' },
  { company: 'Infosys', job: 'Systems Engineer', round: 'Round 3', title: 'HR Interview', status: 'PENDING', date: '2 Apr 2026' },
  { company: 'JP Morgan', job: 'SWE Program', round: 'Round 1', title: 'Screening', status: 'CLEARED', date: '22 Mar 2026' },
  { company: 'JP Morgan', job: 'SWE Program', round: 'Round 2', title: 'Technical', status: 'CLEARED', date: '26 Mar 2026' },
  { company: 'JP Morgan', job: 'SWE Program', round: 'Round 3', title: 'HR Interview', status: 'PENDING', date: '2 Apr 2026' },
  { company: 'Deloitte', job: 'Business Analyst', round: 'Round 1', title: 'Screening', status: 'CLEARED', date: '20 Mar 2026' },
  { company: 'Deloitte', job: 'Business Analyst', round: 'Round 2', title: 'Case Study', status: 'REJECTED', date: '24 Mar 2026' },
  { company: 'Accenture', job: 'Data Analyst', round: 'Round 1', title: 'Screening', status: 'REJECTED', date: '21 Mar 2026' },
];

const filters = ['All', 'In Progress', 'Cleared', 'Rejected', 'Pending'];

const pill = {
  CLEARED: 'glass-pill-green',
  REJECTED: 'glass-pill-red',
  PENDING: 'glass-pill-yellow',
  '-': 'glass-pill-grey',
};

export default function TrackerPage() {
  const [filter, setFilter] = useState('All');
  const [openGroups, setOpenGroups] = useState({});

  const grouped = useMemo(() => {
    return trackerRows.reduce((acc, row) => {
      if (!acc[row.company]) acc[row.company] = [];
      acc[row.company].push(row);
      return acc;
    }, {});
  }, []);

  const filteredRows = useMemo(() => {
    if (filter === 'All') return trackerRows;
    if (filter === 'In Progress') return trackerRows.filter((r) => r.status === 'PENDING');
    return trackerRows.filter((r) => r.status === filter.toUpperCase());
  }, [filter]);

  const stats = useMemo(() => {
    return {
      Applied: 4,
      Shortlisted: 1,
      'In Progress': trackerRows.filter((r) => r.status === 'PENDING').length,
      Offers: 0,
    };
  }, []);

  return (
    <HiringLayout>
      <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-[#F4F4F5]">Application Tracker</h1>
        <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mt-1">Track your placement journey round by round</p>
      </motion.div>

      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        {Object.entries(stats).map(([label, value]) => (
          <motion.div key={label} className="glass-card p-4 text-center hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
            <p className="text-2xl font-bold text-blue-600 dark:text-[#60A5FA]">{value}</p>
            <p className="text-xs text-gray-600 dark:text-[#A1A1AA]">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="glass-card p-4 mb-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <div className="grid grid-cols-4 items-center gap-2 text-center text-xs font-semibold">
          {['Applied', 'Shortlisted', 'Interview', 'Offer'].map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">{idx + 1}</div>
              {idx < 3 && <div className="flex-1 h-1 bg-blue-600/40" />}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className="flex flex-wrap gap-2 mb-4" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        {filters.map((f) => (
          <motion.button key={f} className={filter === f ? 'glass-pill-blue' : 'glass-pill-grey'} onClick={() => setFilter(f)} whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
            {f}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <div className="hidden lg:grid grid-cols-6 gap-3 px-4 py-3 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] border-b border-white/10">
          <span>Company</span><span>Job Title</span><span>Round No</span><span>Round Title</span><span>Status</span><span>Date</span>
        </div>

        {Object.entries(grouped).map(([company, rows]) => {
          const visibleRows = rows.filter((row) => filteredRows.includes(row));
          if (visibleRows.length === 0) return null;
          const isOpen = !!openGroups[company];

          return (
            <div key={company} className="border-b border-white/10 last:border-b-0">
              <motion.button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5"
                onClick={() => setOpenGroups((prev) => ({ ...prev, [company]: !prev[company] }))}
                whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
              >
                <div className="flex items-center gap-2 text-left">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className="font-semibold text-gray-900 dark:text-[#F4F4F5]">{company}</span>
                  <span className="glass-pill-grey">{visibleRows.length} rounds</span>
                </div>
              </motion.button>

              {isOpen && (
                <div className="space-y-2 px-3 pb-3">
                  {visibleRows.map((row, idx) => (
                    <motion.div key={`${row.company}-${idx}`} className="glass-card p-3 grid lg:grid-cols-6 gap-2 text-sm border-l-2 border-blue-600 hover:shadow-lg hover:shadow-blue-500/20" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
                      <span className="font-medium text-gray-900 dark:text-[#F4F4F5]">{row.company}</span>
                      <span className="text-gray-700 dark:text-[#A1A1AA] truncate">{row.job}</span>
                      <span className="text-gray-700 dark:text-[#A1A1AA]">{row.round}</span>
                      <span className="text-gray-700 dark:text-[#A1A1AA]">{row.title}</span>
                      <span><span className={pill[row.status] || 'glass-pill-grey'}>{row.status}</span></span>
                      <span className="text-gray-700 dark:text-[#A1A1AA]">{row.date}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </HiringLayout>
  );
}

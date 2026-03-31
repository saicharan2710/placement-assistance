import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import HiringLayout from '../../components/hiring/HiringLayout';

const notices = [
  {
    id: 1,
    title: 'TCS NQT Registration Open',
    by: 'Placement Cell',
    date: '28 Mar 2026, 14:00',
    category: 'Urgent',
    unread: true,
    content: 'Dear Students, TCS National Qualifier Test registration is now open. All eligible students from CSE, ECE and IT branches must register before 15 April 2026. Registration link has been shared on your college email. Minimum 60% aggregate required to be eligible. Contact CDC for any queries.',
    attachment: 'TCS_NQT_Guidelines.pdf',
  },
  {
    id: 2,
    title: 'Infosys HackWithInfy - Round 1 Instructions',
    by: 'Placement Cell',
    date: '28 Mar 2026, 13:17',
    category: 'General',
    unread: true,
    content: 'Dear Students, The Round 1 Online Test for Infosys HackWithInfy will be conducted on 29 March 2026. Please read the following instructions carefully: 1. Join the session by 9:00 AM sharp 2. Keep your college ID ready 3. Stable internet connection is mandatory 4. Camera must be on throughout the test 5. Any malpractice will lead to disqualification.',
  },
  {
    id: 3,
    title: 'JP Morgan - Shortlisted Candidates',
    by: 'Placement Cell',
    date: '27 Mar 2026, 10:30',
    category: 'Company Specific',
    unread: false,
    content: 'Dear Students, The following students have been shortlisted for JP Morgan Chase Software Engineer Program Round 2 Technical Interview. Interviews will be conducted on 2 April 2026 via Zoom. Meeting link will be shared to your registered email 24 hours before the interview.',
    attachment: 'JPMorgan_Shortlist.pdf',
  },
  {
    id: 4,
    title: 'Amazon SDE Intern - Applications Open',
    by: 'Placement Cell',
    date: '25 Mar 2026, 09:00',
    category: 'Company Specific',
    unread: false,
    content: 'Amazon Summer Internship applications are now open for eligible students. Only final year students with 7.5+ CGPA are eligible. The process includes an online coding test followed by 2 technical interviews and 1 HR interview.',
  },
  {
    id: 5,
    title: 'Placement Orientation Session',
    by: 'Dr. Placement Coordinator',
    date: '20 Mar 2026, 10:00',
    category: 'General',
    unread: false,
    content: 'All pre-final and final year students are requested to attend the placement orientation session on 25 March 2026 at 10:00 AM in the Main Auditorium. Attendance is compulsory. Topics covered: resume building, interview preparation, placement process.',
  },
];

export default function NoticePage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notices.filter((n) => {
      const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      const matchesFilter = filter === 'All' || n.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const selected = filtered.find((n) => n.id === selectedId) || filtered[0] || notices[0];

  return (
    <HiringLayout>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="glass-card p-4 hover:shadow-lg hover:shadow-blue-500/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            scale: 1.03,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
          }}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#F4F4F5] mb-3">Notices</h2>
          <input
            className="glass-input w-full mb-3"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="glass-input w-full mb-4" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Urgent</option>
            <option>General</option>
            <option>Company Specific</option>
          </select>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.map((n) => (
              <motion.button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                whileHover={{
                  scale: 1.03,
                  transition: { type: 'spring', stiffness: 400, damping: 10 },
                }}
                className={`glass-card w-full text-left p-3 border-l-2 hover:shadow-lg hover:shadow-blue-500/20 ${selected?.id === n.id ? 'border-l-blue-600' : 'border-l-transparent'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 dark:text-[#F4F4F5] text-sm">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1" />}
                </div>
                <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mt-1">{n.by} • {n.date}</p>
                <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mt-2 truncate">{n.content}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-5 hover:shadow-lg hover:shadow-blue-500/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            scale: 1.03,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
          }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F4F4F5] mb-2">{selected.title}</h1>
          <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mb-4">{selected.by} • {selected.date}</p>
          {selected.attachment && (
            <motion.button
              className="glass-button-outline px-3 py-2 text-sm inline-flex items-center gap-2 mb-4 hover:shadow-lg hover:shadow-blue-500/20"
              whileHover={{
                scale: 1.03,
                transition: { type: 'spring', stiffness: 400, damping: 10 },
              }}
            >
              <Download className="w-4 h-4" />
              {selected.attachment}
            </motion.button>
          )}
          <p className="text-sm leading-7 text-gray-700 dark:text-[#D4D4D8]">{selected.content}</p>
        </motion.div>
      </motion.div>
    </HiringLayout>
  );
}

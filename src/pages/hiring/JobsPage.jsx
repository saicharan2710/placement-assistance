import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BriefcaseBusiness, X } from 'lucide-react';
import { motion } from 'framer-motion';
import HiringLayout from '../../components/hiring/HiringLayout';

const STORAGE_KEY = 'prepway_applications';

const baseJobs = [
  { id: 1, company: 'TCS', role: 'Software Engineer', applyBy: '15 Apr 2026', type: 'Full Time', ctc: '7 LPA', status: 'Not Applied', location: 'Bangalore' },
  { id: 2, company: 'Infosys', role: 'Systems Engineer', applyBy: '20 Apr 2026', type: 'Full Time', ctc: '6.5 LPA', status: 'Not Applied', location: 'Pune' },
  { id: 3, company: 'Accenture', role: 'Associate Consultant', applyBy: '10 Apr 2026', type: 'Full Time', ctc: '10 LPA', status: 'Applied', location: 'Hyderabad' },
  { id: 4, company: 'JP Morgan', role: 'Software Engineer Program', applyBy: '5 Apr 2026', type: 'Full Time', ctc: '20 LPA', status: 'Shortlisted', location: 'Mumbai' },
  { id: 5, company: 'Amazon', role: 'SDE Intern', applyBy: '1 Apr 2026', type: 'Summer Intern', ctc: '15 LPA/month', status: 'Not Applied', location: 'Bangalore' },
  { id: 6, company: 'Wipro', role: 'Project Engineer', applyBy: '25 Apr 2026', type: 'Full Time', ctc: '6 LPA', status: 'Not Applied', location: 'Chennai' },
  { id: 7, company: 'Deloitte', role: 'Business Analyst', applyBy: '18 Apr 2026', type: 'Full Time', ctc: '12 LPA', status: 'Applied', location: 'Gurgaon' },
  { id: 8, company: 'Microsoft', role: 'SWE Intern', applyBy: '8 Apr 2026', type: 'Intern + Full Time', ctc: '30 LPA', status: 'Not Applied', location: 'Hyderabad' },
  { id: 9, company: 'Siemens', role: 'Graduate Engineer Trainee', applyBy: '30 Apr 2026', type: 'Full Time', ctc: '8 LPA', status: 'Not Applied', location: 'Pune' },
  { id: 10, company: 'Accenture', role: 'Data Analyst', applyBy: '12 Apr 2026', type: 'Full Time', ctc: '9 LPA', status: 'Rejected', location: 'Bangalore' },
];

const jobTabs = ['All Jobs', 'Eligible Jobs', 'Applied Jobs', 'Not Applied', 'Offered'];
const typeTabs = ['All', 'Full Time', 'Internship', 'Intern + Full Time', 'Summer Intern'];

const typePill = {
  'Full Time': 'glass-pill-blue',
  Internship: 'glass-pill-green',
  'Intern + Full Time': 'glass-pill-yellow',
  'Summer Intern': 'glass-pill-green',
};

const statusPill = {
  'Not Applied': 'glass-pill-grey',
  Applied: 'glass-pill-blue',
  Shortlisted: 'glass-pill-green',
  Rejected: 'glass-pill-red',
  Offered: 'glass-pill-green',
};

function getSavedStatusMap() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function JobsPage() {
  const [searchParams] = useSearchParams();
  const companyFilterFromURL = searchParams.get('company') || '';

  const [jobs, setJobs] = useState(() => {
    const map = getSavedStatusMap();
    return baseJobs.map((job) => ({ ...job, status: map[job.id] || job.status }));
  });
  const [query, setQuery] = useState(companyFilterFromURL);
  const [tab, setTab] = useState('All Jobs');
  const [typeTab, setTypeTab] = useState('All');
  const [confirmJob, setConfirmJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (companyFilterFromURL) {
      setQuery(companyFilterFromURL);
    }
  }, [companyFilterFromURL]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch = !q || job.company.toLowerCase().includes(q) || job.role.toLowerCase().includes(q);
      const matchesType = typeTab === 'All' || job.type === typeTab || (typeTab === 'Internship' && job.type.includes('Intern'));
      const matchesTab =
        tab === 'All Jobs' ||
        tab === 'Eligible Jobs' ||
        (tab === 'Applied Jobs' && job.status === 'Applied') ||
        (tab === 'Not Applied' && job.status === 'Not Applied') ||
        (tab === 'Offered' && job.status === 'Offered');
      return matchesSearch && matchesType && matchesTab;
    });
  }, [jobs, query, tab, typeTab]);

  const updateStatus = (jobId, status) => {
    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status } : job)));
    const map = getSavedStatusMap();
    map[jobId] = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  };

  const handleApplyConfirm = () => {
    if (!confirmJob) return;
    updateStatus(confirmJob.id, 'Applied');
    setConfirmJob(null);
    setToast('Application submitted successfully ✓');
    setTimeout(() => setToast(''), 2200);
  };

  return (
    <HiringLayout>
      <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-[#F4F4F5]">Jobs</h1>
      </motion.div>

      <motion.div className="space-y-3 mb-4" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by company or role..."
          className="glass-input w-full lg:max-w-xl"
        />

        <div className="flex flex-wrap gap-2">
          {jobTabs.map((t) => (
            <motion.button key={t} onClick={() => setTab(t)} className={tab === t ? 'glass-pill-blue' : 'glass-pill-grey'} whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
              {t}
            </motion.button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {typeTabs.map((t) => (
            <motion.button key={t} onClick={() => setTypeTab(t)} className={typeTab === t ? 'glass-pill-blue' : 'glass-pill-grey'} whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
              {t}
            </motion.button>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">{filteredJobs.length} Jobs</p>
      </motion.div>

      <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
        <div className="hidden lg:grid grid-cols-7 gap-3 px-4 py-3 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] border-b border-white/10">
          <span>Company</span><span>Role</span><span>Apply By</span><span>Type</span><span>CTC</span><span>Status</span><span>Action</span>
        </div>
        <div className="divide-y divide-white/10">
          {filteredJobs.map((job) => (
            <motion.button
              key={job.id}
              className="w-full text-left lg:grid lg:grid-cols-7 gap-3 px-4 py-4 glass-card hover:bg-white/5"
              onClick={() => setSelectedJob(job)}
              whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
            >
              <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-[#F4F4F5]">
                <span className="w-7 h-7 rounded-md bg-blue-600 text-white text-xs flex items-center justify-center">{job.company[0]}</span>
                {job.company}
              </div>
              <div className="text-gray-800 dark:text-[#D4D4D8]">{job.role}</div>
              <div className="text-gray-700 dark:text-[#A1A1AA]">{job.applyBy}</div>
              <div><span className={typePill[job.type] || 'glass-pill-grey'}>{job.type}</span></div>
              <div className="text-green-600 dark:text-[#4ADE80]">{job.ctc || 'Not Specified'}</div>
              <div><span className={statusPill[job.status] || 'glass-pill-grey'}>{job.status}</span></div>
              <div>
                {job.status === 'Not Applied' ? (
                  <motion.button
                    className="glass-button-primary px-3 py-1.5 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmJob(job);
                    }}
                    whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  >
                    Apply Now
                  </motion.button>
                ) : (
                  <button className="glass-button-outline px-3 py-1.5 text-sm opacity-70" disabled>
                    {job.status === 'Applied' ? 'Applied ✓' : job.status}
                  </button>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {confirmJob && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[90]" onClick={() => setConfirmJob(null)} />
          <div className="glass-modal fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[92vw] max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#F4F4F5] mb-2">Apply to {confirmJob.company} for {confirmJob.role}?</h3>
            <p className="text-sm text-gray-700 dark:text-[#A1A1AA] mb-6">
              Make sure your resume is up to date. Your profile resume will be shared with the company.
            </p>
            <div className="flex gap-3">
              <button className="glass-button-primary flex-1 py-2" onClick={handleApplyConfirm}>Confirm Application</button>
              <button className="glass-button-outline flex-1 py-2" onClick={() => setConfirmJob(null)}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {selectedJob && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[90]" onClick={() => setSelectedJob(null)} />
          <aside className="fixed right-0 top-0 h-full w-full max-w-[400px] z-[100] bg-white/90 dark:bg-[rgba(10,10,10,0.95)] backdrop-blur-[24px] border-l border-white/20 dark:border-white/10 p-6 overflow-y-auto">
            <button className="absolute right-4 top-4 p-2 glass-button-outline rounded-full" onClick={() => setSelectedJob(null)}>
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F4F4F5] mt-6 mb-1">{selectedJob.role}</h2>
            <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mb-4">{selectedJob.company}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className={typePill[selectedJob.type] || 'glass-pill-grey'}>{selectedJob.type}</span>
              <span className="glass-pill-green">{selectedJob.ctc}</span>
              <span className="glass-pill-grey">Apply by {selectedJob.applyBy}</span>
              <span className="glass-pill-grey">{selectedJob.location}</span>
            </div>

            <div className="glass-card p-4 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-[#F4F4F5] mb-2">About the Role</h3>
              <p className="text-sm text-gray-700 dark:text-[#A1A1AA]">You will work on high impact products, collaborate with cross-functional teams and build scalable systems for real users.</p>
            </div>

            <div className="glass-card p-4 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-[#F4F4F5] mb-2">Responsibilities</h3>
              <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-[#A1A1AA] space-y-1">
                <li>Design, build and test production-grade features</li>
                <li>Write maintainable and scalable code</li>
                <li>Collaborate with product and QA teams</li>
                <li>Participate in reviews and debugging</li>
              </ul>
            </div>

            <div className="glass-card p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-[#F4F4F5] mb-2">Requirements</h3>
              <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-[#A1A1AA] space-y-1">
                <li>Strong DSA and problem-solving skills</li>
                <li>Good fundamentals in CS concepts</li>
                <li>Hands-on with projects and Git</li>
                <li>Communication and teamwork skills</li>
              </ul>
            </div>

            {selectedJob.status === 'Not Applied' ? (
              <button
                className="glass-button-primary w-full py-3"
                onClick={() => {
                  setConfirmJob(selectedJob);
                  setSelectedJob(null);
                }}
              >
                Apply Now
              </button>
            ) : (
              <button className="glass-button-outline w-full py-3" disabled>
                {selectedJob.status}
              </button>
            )}
          </aside>
        </>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[110] glass-card px-4 py-3 text-sm text-gray-900 dark:text-[#F4F4F5]">
          {toast}
        </div>
      )}
    </HiringLayout>
  );
}

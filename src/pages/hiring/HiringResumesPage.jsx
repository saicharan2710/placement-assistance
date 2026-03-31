import React, { useState } from 'react';
import { FileText, Trash2, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import HiringLayout from '../../components/hiring/HiringLayout';

const initialResumes = [
  { id: 1, name: 'Saicharan_SWE_Resume.pdf', uploaded: '15 Mar 2026', size: '245 KB', role: 'Software Engineering roles', primary: true },
  { id: 2, name: 'Saicharan_Data_Resume.pdf', uploaded: '10 Mar 2026', size: '238 KB', role: 'Data Analyst roles', primary: false },
];

export default function HiringResumesPage() {
  const [resumes, setResumes] = useState(initialResumes);
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');
  const [showUploadArea, setShowUploadArea] = useState(false);

  const setPrimary = (id) => {
    setResumes((prev) => prev.map((r) => ({ ...r, primary: r.id === id })));
  };

  const deleteResume = (id) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <HiringLayout>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-[#F4F4F5]">My Resumes</h1>
          <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mt-1">Manage resumes for different roles</p>
        </div>
        <motion.button className="glass-button-primary px-4 py-2" onClick={() => setShowUploadArea((v) => !v)} whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
          Upload New Resume
        </motion.button>
      </div>

      {(showUploadArea || resumes.length === 0) && (
        <div className="glass-card border-2 border-dashed border-blue-500/30 p-10 text-center mb-6">
          <FileText className="w-10 h-10 mx-auto text-blue-600 dark:text-[#60A5FA] mb-3" />
          <p className="font-medium text-gray-900 dark:text-[#F4F4F5]">Drag and drop your resume here</p>
          <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mb-4">or click to browse</p>
          <p className="text-xs text-gray-500 dark:text-[#71717A] mb-4">PDF only, max 5MB</p>
          <motion.button className="glass-button-outline px-4 py-2" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>Browse Files</motion.button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {resumes.map((resume) => (
          <motion.div key={resume.id} className="glass-card p-5 relative" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>
            {resume.primary && <span className="absolute right-4 top-4 glass-pill-blue">Primary</span>}
            <button className="absolute right-4 top-10 text-red-500" onClick={() => deleteResume(resume.id)} aria-label="Delete resume">
              <Trash2 className="w-4 h-4" />
            </button>

            <FileText className="w-9 h-9 text-blue-600 dark:text-[#60A5FA] mb-3" />

            {editingId === resume.id ? (
              <input
                className="glass-input w-full mb-2"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => {
                  setResumes((prev) => prev.map((r) => (r.id === resume.id ? { ...r, name: tempName || r.name } : r)));
                  setEditingId(null);
                }}
                autoFocus
              />
            ) : (
              <h3 className="font-semibold text-gray-900 dark:text-[#F4F4F5] mb-2 cursor-text" onClick={() => {
                setEditingId(resume.id);
                setTempName(resume.name);
              }}>
                {resume.name}
              </h3>
            )}

            <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">Uploaded: {resume.uploaded}</p>
            <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">Size: {resume.size}</p>
            <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mb-4">For: {resume.role}</p>

            <div className="flex flex-wrap gap-2">
              <motion.button className="glass-button-outline px-3 py-1.5 text-sm inline-flex items-center gap-1" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}><Eye className="w-4 h-4" />View</motion.button>
              <motion.button className="glass-button-outline px-3 py-1.5 text-sm inline-flex items-center gap-1" whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}><Download className="w-4 h-4" />Download</motion.button>
              <motion.button className="glass-button-primary px-3 py-1.5 text-sm" onClick={() => setPrimary(resume.id)} whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}>Set as Default</motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-5 border-l-4 border-blue-600">
        <h3 className="font-semibold text-gray-900 dark:text-[#F4F4F5] mb-3">Resume Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-[#A1A1AA]">
          <li>✓ Keep it to 1 page for fresher roles</li>
          <li>✓ Tailor your resume for each role</li>
          <li>✓ Save as FirstName_LastName_Resume.pdf</li>
        </ul>
      </div>
    </HiringLayout>
  );
}

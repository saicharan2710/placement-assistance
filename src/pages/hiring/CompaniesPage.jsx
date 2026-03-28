import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, X } from 'lucide-react';
import HiringLayout from '../../components/hiring/HiringLayout';

const companies = [
  { id: 1, name: 'Tata Consultancy Services', short: 'TCS', industry: 'Technology', roles: 4, ctc: '7-9 LPA', avatar: 'T', color: 'bg-blue-600', founded: '1968', size: '600k+ Employees', roleList: ['Software Engineer', 'System Engineer', 'QA Engineer', 'Support Engineer'] },
  { id: 2, name: 'Infosys', short: 'Infosys', industry: 'Technology', roles: 3, ctc: '6-8 LPA', avatar: 'I', color: 'bg-purple-600', founded: '1981', size: '300k+ Employees', roleList: ['Systems Engineer', 'Digital Specialist', 'Associate Consultant'] },
  { id: 3, name: 'Wipro', short: 'Wipro', industry: 'Technology', roles: 2, ctc: '6-7 LPA', avatar: 'W', color: 'bg-green-600', founded: '1945', size: '250k+ Employees', roleList: ['Project Engineer', 'Automation Engineer'] },
  { id: 4, name: 'Accenture', short: 'Accenture', industry: 'Consulting', roles: 5, ctc: '8-12 LPA', avatar: 'A', color: 'bg-orange-600', founded: '1989', size: '700k+ Employees', roleList: ['Associate Consultant', 'Data Analyst', 'Cloud Engineer', 'Business Analyst', 'DevOps Engineer'] },
  { id: 5, name: 'JP Morgan Chase', short: 'JPMC', industry: 'Finance', roles: 2, ctc: '18-22 LPA', avatar: 'J', color: 'bg-blue-700', founded: '1799', size: '290k+ Employees', roleList: ['Software Engineer Program', 'Analyst Program'] },
  { id: 6, name: 'Deloitte', short: 'Deloitte', industry: 'Consulting', roles: 3, ctc: '10-15 LPA', avatar: 'D', color: 'bg-purple-700', founded: '1845', size: '450k+ Employees', roleList: ['Business Analyst', 'Audit Associate', 'Consulting Analyst'] },
  { id: 7, name: 'Amazon', short: 'Amazon', industry: 'Product', roles: 2, ctc: '25-35 LPA', avatar: 'A', color: 'bg-orange-500', founded: '1994', size: '1.5M+ Employees', roleList: ['SDE Intern', 'SDE 1'] },
  { id: 8, name: 'Microsoft', short: 'Microsoft', industry: 'Product', roles: 1, ctc: '30-40 LPA', avatar: 'M', color: 'bg-blue-500', founded: '1975', size: '220k+ Employees', roleList: ['SWE Intern'] },
  { id: 9, name: 'Siemens', short: 'Siemens', industry: 'Core', roles: 2, ctc: '8-10 LPA', avatar: 'S', color: 'bg-green-500', founded: '1847', size: '300k+ Employees', roleList: ['Graduate Engineer Trainee', 'Design Engineer'] },
];

const filters = ['All', 'Tech', 'Finance', 'Consulting', 'Core', 'Product'];

function mapFilter(filter) {
  if (filter === 'Tech') return 'Technology';
  return filter;
}

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();

  const filteredCompanies = useMemo(() => {
    const term = search.trim().toLowerCase();
    return companies.filter((c) => {
      const matchesSearch = !term || c.name.toLowerCase().includes(term) || c.short.toLowerCase().includes(term);
      const matchesFilter = filter === 'All' || c.industry === mapFilter(filter);
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <HiringLayout>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-[#F4F4F5]">Companies</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="glass-input w-full lg:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === item ? 'glass-pill-blue' : 'glass-pill-grey'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <button
            key={company.id}
            onClick={() => setSelectedCompany(company)}
            className="glass-card p-5 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${company.color} text-white font-bold text-lg flex items-center justify-center`}>
                {company.avatar}
              </div>
              <span className="glass-pill-blue">{company.industry}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#F4F4F5] mb-1">{company.name}</h3>
            <p className="text-sm text-blue-600 dark:text-[#60A5FA] mb-1">{company.roles} roles open</p>
            <p className="text-sm text-green-600 dark:text-[#4ADE80] mb-4">{company.ctc}</p>
            <button
              className="glass-button-outline px-3 py-2 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/hiring/jobs?company=${encodeURIComponent(company.short)}`);
              }}
            >
              View Jobs
            </button>
          </button>
        ))}
      </div>

      {selectedCompany && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[90]" onClick={() => setSelectedCompany(null)} />
          <aside className="fixed right-0 top-0 h-full w-full max-w-[400px] z-[100] bg-white/90 dark:bg-[rgba(10,10,10,0.95)] backdrop-blur-[24px] border-l border-white/20 dark:border-white/10 p-6 overflow-y-auto">
            <button
              className="absolute right-4 top-4 p-2 glass-button-outline rounded-full"
              onClick={() => setSelectedCompany(null)}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-4 mt-6">
              <div className={`w-16 h-16 rounded-2xl ${selectedCompany.color} text-white text-2xl font-bold flex items-center justify-center`}>
                {selectedCompany.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-[#F4F4F5]">{selectedCompany.name}</h2>
                <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">{selectedCompany.short}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-[#A1A1AA] mb-4">
              {selectedCompany.name} is actively hiring from campus for multiple roles. The selection process includes screening, assessment and interviews.
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="glass-pill-blue">{selectedCompany.industry}</span>
              <span className="glass-pill-grey">Founded: {selectedCompany.founded}</span>
              <span className="glass-pill-grey">{selectedCompany.size}</span>
            </div>

            <div className="glass-card p-4 mb-5">
              <h3 className="font-semibold text-gray-900 dark:text-[#F4F4F5] mb-3">Roles offered</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-[#A1A1AA]">
                {selectedCompany.roleList.map((role) => (
                  <li key={role} className="flex items-center gap-2">
                    <BriefcaseBusiness className="w-4 h-4 text-blue-600 dark:text-[#60A5FA]" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="glass-button-primary w-full py-3"
              onClick={() => navigate(`/hiring/jobs?company=${encodeURIComponent(selectedCompany.short)}`)}
            >
              View All Jobs
            </button>
          </aside>
        </>
      )}
    </HiringLayout>
  );
}

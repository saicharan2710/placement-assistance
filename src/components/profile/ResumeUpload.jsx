import React, { useRef, useState } from 'react';
import { Upload, FileText, Eye, Trash2 } from 'lucide-react';

export default function ResumeUpload({ resumeFile, onResumeUpload }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(resumeFile?.name || '');
  const [uploadDate, setUploadDate] = useState(resumeFile?.uploadDate || '');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      setFileName(file.name);
      setUploadDate(today);
      onResumeUpload(file, today);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleRemove = () => {
    setFileName('');
    setUploadDate('');
    onResumeUpload(null, '');
    fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8 m-4 md:m-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
        Your Resume
      </h2>

      {!fileName ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-3" />
          <p className="text-gray-700 dark:text-slate-300 font-semibold mb-2">
            Upload your resume
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            PDF format, max 5MB
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Upload className="w-4 h-4" />
            Upload Resume
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Upload resume"
          />
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
          {/* File Info */}
          <div className="flex items-start gap-4 mb-4">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">
                {fileName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Uploaded on {uploadDate}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors">
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
            >
              Replace
            </button>
            <button
              onClick={handleRemove}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Replace resume"
          />
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
        <p className="text-sm text-gray-700 dark:text-slate-300">
          <span className="font-semibold text-blue-600 dark:text-blue-400">💡 Tip:</span> We
          use your resume to generate personalized interview questions and practice scenarios
          tailored to your experience.
        </p>
      </div>
    </div>
  );
}

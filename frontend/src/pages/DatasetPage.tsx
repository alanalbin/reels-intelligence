import React, { useState, useEffect } from 'react';
import {
  Upload, Download, RefreshCw, FileText, CheckCircle2,
  AlertTriangle, RotateCcw, Database, ShieldCheck, Info
} from 'lucide-react';
import { DatasetValidationReport } from '../types';
import {
  uploadDatasetFile, fetchValidationReport, resetDataset
} from '../services/api';

interface DatasetPageProps {
  onDatasetUpdated: () => void;
}

export const DatasetPage: React.FC<DatasetPageProps> = ({ onDatasetUpdated }) => {
  const [report, setReport] = useState<DatasetValidationReport | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadReport = () => {
    fetchValidationReport()
      .then(setReport)
      .catch(console.error);
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    setUploadSuccessMsg(null);

    try {
      const res = await uploadDatasetFile(file);
      setReport(res);
      setUploadSuccessMsg(`Dataset "${file.name}" successfully parsed, validated, and derived!`);
      onDatasetUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'CSV upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToBenchmark = async () => {
    if (!window.confirm('Reset dataset to the documented 88-reel reference cohort?')) return;
    setIsResetting(true);
    setErrorMsg(null);
    try {
      await resetDataset();
      loadReport();
      setUploadSuccessMsg('Reset to authentic 88-reel reference cohort confirmed.');
      onDatasetUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Reset failed');
    } finally {
      setIsResetting(false);
    }
  };

  const downloadValidationReportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset_validation_report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Reference Dataset Documentation Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-[#D62976]" />
            <h3 className="text-sm font-semibold text-gray-900">Dataset Source & Abstract Reference Specification</h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            Academic Reference Compliant
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          The reference dataset originates from the <strong>Apify Instagram Scraper API</strong>, targeting 9 monitored creators across 5 content categories between <strong>9 March 2024 and 8 September 2026</strong>.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 text-xs">
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block">Total Reels</span>
            <span className="text-base font-semibold text-gray-900 font-tabular">88</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block">Aggregated Views</span>
            <span className="text-base font-semibold text-gray-900 font-tabular">40,966,919</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block">Mean Engagement</span>
            <span className="text-base font-semibold text-[#D62976] font-tabular">7.58%</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block">Creators</span>
            <span className="text-base font-semibold text-gray-900 font-tabular">9 Accounts</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block">Content Niches</span>
            <span className="text-base font-semibold text-gray-900 font-tabular">5 Niches</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block">Null Rate</span>
            <span className="text-base font-semibold text-emerald-600 font-tabular">0.0%</span>
          </div>
        </div>
      </div>

      {/* Upload & Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Upload Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Import Custom Dataset (CSV)</h3>
              <p className="text-xs text-gray-500">Upload new Reel metrics to validate schema and update analytics</p>
            </div>
            <a
              href="/api/dataset/template"
              download
              className="inline-flex items-center space-x-1 text-xs text-[#D62976] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </a>
          </div>

          <label className="border-2 border-dashed border-gray-300 hover:border-[#D62976] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50/50">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-xs font-semibold text-gray-800">
              {isUploading ? 'Validating CSV...' : 'Click to select or drop CSV file'}
            </span>
            <span className="text-[11px] text-gray-400 mt-1">
              Supports UTF-8 CSV with Reel ID, Views, Likes, Comments, Caption
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {uploadSuccessMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded text-xs flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Dataset Controls & Export */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Dataset Management Actions</h3>
            <p className="text-xs text-gray-500 mb-4">Export cleaned data, inspect validation logs, or reset state</p>

            <div className="space-y-2.5 text-xs">
              <a
                href="/api/dataset/export"
                download
                className="w-full flex items-center justify-between p-3 rounded border border-gray-200 hover:bg-gray-50 transition text-gray-800"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Export Current Active Dataset</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">.csv</span>
              </a>

              <button
                onClick={downloadValidationReportJson}
                className="w-full flex items-center justify-between p-3 rounded border border-gray-200 hover:bg-gray-50 transition text-gray-800 text-left"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Download Data Validation Report</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">.json</span>
              </button>

              <button
                onClick={handleResetToBenchmark}
                disabled={isResetting}
                className="w-full flex items-center justify-between p-3 rounded border border-gray-200 hover:bg-gray-50 transition text-gray-800 text-left disabled:opacity-50"
              >
                <div className="flex items-center space-x-2">
                  <RotateCcw className={`w-4 h-4 text-gray-500 ${isResetting ? 'animate-spin' : ''}`} />
                  <span className="font-medium">Reset to Reference Cohort (88 Reels)</span>
                </div>
                <span className="text-[11px] text-[#D62976] font-semibold">Standard Reference</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
            Integrity guarantee: All uploaded datasets are validated against negative numbers, duplicate primary keys, and missing required metrics before entering in-memory state.
          </div>
        </div>
      </div>

      {/* Validation Diagnostic Report Card */}
      {report && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Data Validation Diagnostics & Integrity Audit</h3>
              <p className="text-xs text-gray-500">Source: {report.dataset_source}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
              {report.validation_status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-500 block mb-1">Total Rows Scanned</span>
              <span className="text-base font-semibold text-gray-900 font-tabular">{report.total_rows}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-500 block mb-1">Successfully Imported</span>
              <span className="text-base font-semibold text-emerald-700 font-tabular">{report.imported_rows}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-500 block mb-1">Rejected Rows</span>
              <span className="text-base font-semibold text-gray-900 font-tabular">{report.rejected_rows}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-500 block mb-1">Duplicates Detected</span>
              <span className="text-base font-semibold text-gray-900 font-tabular">{report.duplicates_detected}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-500 block mb-1">Null Rate</span>
              <span className="text-base font-semibold text-gray-900 font-tabular">{report.null_rate_percentage}%</span>
            </div>
          </div>

          {/* Validation Log Messages */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold text-gray-700">Audit Trail:</span>
            <ul className="space-y-1 text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 font-mono text-[11px]">
              {report.validation_messages.map((msg, idx) => (
                <li key={idx} className="flex items-center space-x-1.5">
                  <span className="text-emerald-600">✓</span>
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

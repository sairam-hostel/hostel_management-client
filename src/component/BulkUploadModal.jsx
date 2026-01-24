import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const UPLOAD_CONFIG = {
  student: {
    title: 'Bulk Upload Students',
    endpoint: '/bf1/accounts/students/register',
    templateName: 'Student_Upload_Template.xlsx',
    templateData: [
      {
        name: "John Doe",
        email: "john@example.com",
        roll_number: "21IT001",
        register_number: "810021205001",
        department: "Information Technology (IT)",
        year: "3",
        section: "A",
        batch: "2021-2025",
        hostel_block: "A",
        room_number: "101",
        bed_number: "1",
        warden_name: "Mr. Smith",
        floor: "1",
        status: "in",
        gender: "Male",
        phone: "9876543210",
        dob: "2003-05-15", // YYYY-MM-DD
        blood_group: "O+",
        father_name: "Father Name",
        father_phone: "9876543211",
        address_line_1: "123 Main St",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001"
      }
    ],
    mapRow: (row) => ({
      ...row,
      password: row.password || 'Student@123',
      year: String(row.year),
      status: row.status || 'in'
    })
  },
  faculty: {
    title: 'Bulk Upload Faculty',
    endpoint: '/bf1/accounts/faculty/register',
    templateName: 'Faculty_Upload_Template.xlsx',
    templateData: [
      {
        name: "Dr. Jane Doe",
        email: "jane@example.com",
        phone: "9876543210",
        role: "faculty", // faculty, admin, warden
        department: "Information Technology (IT)",
        designation: "Assistant Professor",
        qualification: "Ph.D",
        experience_years: "5",
        joining_date: "2020-06-15",
        gender: "Female",
        dob: "1985-05-15",
        blood_group: "O+",
        hostel_block: "A", // Optional assignment
        assigned_floors: "", // e.g., "1, 2"
        address_line_1: "Faculty Quarters",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600001"
      }
    ],
    mapRow: (row) => ({
      ...row,
      password: row.password || 'StrongPass@123',
      role: row.role || 'faculty',
      assigned_floors: row.assigned_floors 
        ? String(row.assigned_floors).split(',').map(num => parseInt(num.trim())).filter(n => !isNaN(n))
        : []
    })
  }
};

const BulkUploadModal = ({ isOpen, onClose, onSuccess, type = 'student' }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ total: 0, current: 0, success: 0, failed: 0 });
  const [logs, setLogs] = useState([]);
  const { showToast } = useToast();

  const config = UPLOAD_CONFIG[type] || UPLOAD_CONFIG.student;

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(config.templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, config.templateName);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLogs([]);
      setProgress({ total: 0, current: 0, success: 0, failed: 0 });
    }
  };

  const processFile = async () => {
    if (!file) return;
    setUploading(true);
    setLogs([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setLogs(prev => [...prev, { type: 'error', message: 'File is empty or invalid format.' }]);
          setUploading(false);
          return;
        }

        setProgress({ total: jsonData.length, current: 0, success: 0, failed: 0 });

        let failedCount = 0;

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          setProgress(prev => ({ ...prev, current: i + 1 }));

          try {
             const payload = config.mapRow(row);
             
             await api.post(config.endpoint, payload);
             
             setProgress(prev => ({ ...prev, success: prev.success + 1 }));
             setLogs(prev => [...prev, { type: 'success', message: `Row ${i + 2}: Added ${payload.name}` }]); 

          } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
            failedCount++;
            setProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
            setLogs(prev => [...prev, { type: 'error', message: `Row ${i + 2}: Failed - ${errorMsg}` }]);
          }
        }
        
        if (failedCount === 0) {
            if (onSuccess) onSuccess(); 
            showToast(`${config.title} completed successfully`, 'success');
        } else {
            showToast(`${config.title} completed with ${failedCount} errors`, 'warning');
        }

      } catch (err) {
        setLogs(prev => [...prev, { type: 'error', message: `Critical Error: ${err.message}` }]);
        showToast('Critical Error in Upload', 'error');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileSpreadsheet className="text-purple-600" />
            {config.title}
          </h2>
          {!uploading && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* Instructions */}
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm border border-blue-100">
            <p className="font-semibold mb-1">Instructions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Download the template file to see the required format.</li>
              <li>Fill in the details. <b>Email and Name are typically required.</b></li>
              <li>Do not modify the header row.</li>
              <li>Upload the filled Excel file to start the import process.</li>
            </ul>
          </div>

          {/* File Input */}
          <div className="mb-6">
            {!uploading ? (
              <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    {!file ? (
                        <label 
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const droppedFile = e.dataTransfer.files[0];
                            if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
                                setFile(droppedFile);
                                setLogs([]);
                                setProgress({ total: 0, current: 0, success: 0, failed: 0 });
                            }
                        }}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">.xlsx, .xls files</p>
                            </div>
                            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                        </label>
                    ) : (
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="text-green-600" size={24} />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setFile(null)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                title="Remove file"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 border border-purple-200 transition-colors h-fit whitespace-nowrap"
                  >
                    <Download size={16} />
                    Download Template
                  </button>
              </div>
            ) : (
                <div className="text-center py-8">
                    <Loader className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700">Processing Data...</p>
                    <p className="text-gray-500">
                        {progress.current} of {progress.total} processed
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 max-w-md mx-auto">
                        <div 
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
                        <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={14} /> {progress.success} Successful
                        </span>
                        <span className="text-red-600 flex items-center gap-1">
                            <AlertCircle size={14} /> {progress.failed} Failed
                        </span>
                    </div>
                </div>
            )}
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-700">
                    Process Log
                </div>
                <div className="max-h-48 overflow-y-auto p-2 bg-gray-50 font-mono text-xs">
                    {logs.map((log, index) => (
                        <div key={index} className={`mb-1 ${log.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            [{log.type.toUpperCase()}] {log.message}
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
            {!uploading && (
                <>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button 
                        onClick={processFile}
                        disabled={!file}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Upload
                    </button>
                </>
            )}
            {uploading && progress.current === progress.total && (
                 <button 
                 onClick={onClose}
                 className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
             >
                 Done
             </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;

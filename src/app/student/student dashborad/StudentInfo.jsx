import React from 'react';

// JSON-like student data (this can come from API later)
const STUDENT_INFO = {
  name: "Student Name",
  rollNumber: "SEC21CJ001",
  department: "Computer Science and Engineering",
  college: "Sri Sairam Engineering College",
  mentor: "Dr. Mentor Name",
  academicYear: "2022-2027",
};

const StudentInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        
        {/* Student Details */}
        <div className="flex flex-col justify-center px-4">
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Student Name</p>
          <h2 className="text-lg font-bold text-gray-900">{STUDENT_INFO.name}</h2>
          <p className="text-sm font-medium text-gray-600 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1 w-fit">
            {STUDENT_INFO.rollNumber}
          </p>
        </div>

        {/* Academic Info */}
        <div className="flex flex-col justify-center px-4 pt-4 md:pt-0">
          <div className="mb-3">
            <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Department</p>
            <h3 className="text-md font-semibold text-gray-900">{STUDENT_INFO.department}</h3>
          </div>
          <div>
            <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">College</p>
            <p className="text-sm font-semibold text-gray-900">{STUDENT_INFO.college}</p>
          </div>
        </div>

        {/* Mentorship & Year */}
        <div className="flex flex-col justify-center px-4 pt-4 md:pt-0">
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Mentorship & Year</p>
          <div className="flex flex-col gap-2 mt-1">
            <div>
              <span className="text-xs text-gray-500">Mentor:</span>
              <span className="text-sm font-medium text-gray-900 ml-2">
                {STUDENT_INFO.mentor}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Academic Year:</span>
              <span className="text-sm font-medium text-gray-900 ml-2">
                {STUDENT_INFO.academicYear}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentInfo;
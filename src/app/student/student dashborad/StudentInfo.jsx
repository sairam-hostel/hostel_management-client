import React from 'react';

const StudentInfo = ({ data }) => {
  const student = {
    name: data?.name || "Student Name",
    rollNumber: data?.roll_number || "SEC21CJ001",
    department: data?.department || "Computer Science and Engineering",
    college: "Sri Sairam Engineering College",
    mentor: "Dr. Mentor Name",
    academicYear: data?.batch ? `${data.batch} - ${parseInt(data.batch) + 4}` : "2022-2027",

    // New fields
    registerNumber: data?.register_number,
    year: data?.year,
    section: data?.section,
    email: data?.email,
    phone: data?.phone,
    dob: data?.dob ? new Date(data.dob).toLocaleDateString() : null,
    bloodGroup: data?.blood_group,
    gender: data?.gender,
    nationality: data?.nationality,
    religion: data?.religion,
    community: data?.community,
    address: data ? `${data.address_line_1}, ${data.address_line_2}, ${data.city}, ${data.state} - ${data.pincode}` : null,

    // Schooling
    schoolName: data?.school_name,
    schoolBoard: data?.school_board,
    schoolPercentage: data?.school_percentage,

    // Contacts
    whatsapp: data?.whatsapp_number,
    alternatePhone: data?.alternate_phone
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 mb-6">

        {/* Student Details */}
        <div className="flex flex-col justify-center px-4">
          <h2 className="text-lg font-bold text-gray-900">{student.name}</h2>
          <div className="flex flex-wrap gap-4 mt-2  flex-col ">
            <p className="text-sm font-medium text-gray-600 bg-gray-100 inline-block px-2 py-0.5 rounded w-fit">
              {student.rollNumber}
            </p>
            {student.registerNumber && (
              <p className="text-sm font-medium text-gray-600 bg-gray-100 inline-block px-2 py-0.5 rounded w-fit">
                {student.registerNumber}
              </p>
            )}
          </div>
          {/* {student.email && <p className="text-xs text-gray-500 mt-2">{student.email}</p>}
          <div className="flex flex-col gap-1 mt-1">
            {student.phone && <p className="text-xs text-gray-500">Ph: {student.phone}</p>}
            {student.whatsapp && <p className="text-xs text-gray-500">WA: {student.whatsapp}</p>}
          </div> */}
        </div>

        {/* Academic Info */}
        <div className="flex flex-col justify-center px-4 pt-4 md:pt-0">
          <div className="mb-3">
            <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Department</p>
            <h3 className="text-md font-semibold text-gray-900">{student.department}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              {student.year && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Year: {student.year}</span>}
              {student.section && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Sec: {student.section}</span>}
            </div>
          </div>
          <div>
            <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">College</p>
            <p className="text-sm font-semibold text-gray-900">{student.college}</p>
          </div>
        </div>

        {/* Mentorship & Year */}
        <div className="flex flex-col justify-center px-4 pt-4 md:pt-0">
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Mentorship & Year</p>
          <div className="flex flex-col gap-2 mt-1">
            <div>
              <span className="text-xs text-gray-500">Mentor:</span>
              <span className="text-sm font-medium text-gray-900 ml-2">
                {student.mentor}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Academic Year:</span>
              <span className="text-sm font-medium text-gray-900 ml-2">
                {student.academicYear}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details Section - Only show if data is there */}
      {data && (
        <div className="border-t border-gray-100 pt-4 px-4 w-full">
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-3">Personal Information</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {student.email && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-900 break-all">{student.email}</p>
              </div>
            )}
            {student.phone && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{student.phone}</p>
              </div>
            )}
            {student.alternatePhone && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Alternate Phone</p>
                <p className="text-sm font-semibold text-gray-900">{student.alternatePhone}</p>
              </div>
            )}
            {student.whatsapp && (
              <div>
                <p className="text-xs text-gray-400 font-medium">WhatsApp</p>
                <p className="text-sm font-semibold text-gray-900">{student.whatsapp}</p>
              </div>
            )}
            {student.dob && (
              <div>
                <p className="text-xs text-gray-400 font-medium">DOB</p>
                <p className="text-sm font-semibold text-gray-900">{student.dob}</p>
              </div>
            )}
            {student.bloodGroup && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Blood Group</p>
                <p className="text-sm font-semibold text-gray-900">{student.bloodGroup}</p>
              </div>
            )}
            {student.gender && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Gender</p>
                <p className="text-sm font-semibold text-gray-900">{student.gender}</p>
              </div>
            )}
            {student.community && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Community</p>
                <p className="text-sm font-semibold text-gray-900">{student.community}</p>
              </div>
            )}
            {student.nationality && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Nationality</p>
                <p className="text-sm font-semibold text-gray-900">{student.nationality}</p>
              </div>
            )}
            {student.religion && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Religion</p>
                <p className="text-sm font-semibold text-gray-900">{student.religion}</p>
              </div>
            )}
          </div>
          {student.address && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 font-medium">Address</p>
              <p className="text-sm font-semibold text-gray-900">{student.address}</p>
            </div>
          )}

          {/* School Info */}
          {(student.schoolName || student.schoolBoard) && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-3">Previous Education</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {student.schoolName && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium">School Name</p>
                    <p className="text-sm font-semibold text-gray-900">{student.schoolName}</p>
                  </div>
                )}
                {student.schoolBoard && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Board</p>
                    <p className="text-sm font-semibold text-gray-900">{student.schoolBoard}</p>
                  </div>
                )}
                {student.schoolPercentage && (
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Percentage</p>
                    <p className="text-sm font-semibold text-gray-900">{student.schoolPercentage}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentInfo;
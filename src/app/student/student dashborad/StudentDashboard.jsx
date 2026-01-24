import React, { useEffect, useState } from 'react'
import api from '../../../utils/api'
import StudentInfo from './StudentInfo'
import ParentInfo from './ParentInfo'
import HostelInfo from './HostelInfo'
import LeaveInfo from './LeaveInfo'

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/bs1/profile');
        if (response.data.success) {
          setStudentData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentInfo data={studentData} />
      
      {/* Parents & Hostel */}
      <section className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-[70%]'>
          <ParentInfo data={studentData} />
        </div>
        <div className='w-full lg:w-[30%]'>
          <HostelInfo data={studentData} />
        </div>
      </section>

      <LeaveInfo />
    </div>
  )
}

export default StudentDashboard
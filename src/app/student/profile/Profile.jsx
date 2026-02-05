import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
import StudentInfo from '../student dashborad/StudentInfo';
import ParentInfo from '../student dashborad/ParentInfo';
import HostelInfo from '../student dashborad/HostelInfo';

const Profile = () => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/bs1/profile');
                if (response.data.success) {
                    setStudentData(response.data.data);
                    // Optional: Update cache if name changed, similar to Dashboard
                    if (response.data.data?.name) {
                        localStorage.setItem('studentName', response.data.data.name);
                    }
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
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            </div>

            {/* Student Details */}
            <StudentInfo data={studentData} />

            {/* Parents & Hostel Details */}
            <section className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-[70%]'>
                    <ParentInfo data={studentData} />
                </div>
                <div className='w-full lg:w-[30%]'>
                    <HostelInfo data={studentData} />
                </div>
            </section>
        </div>
    );
};

export default Profile;

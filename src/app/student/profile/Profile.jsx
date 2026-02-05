import React, { useEffect, useState } from 'react';
import {
    User, Mail, Phone, Calendar, MapPin,
    BookOpen, Home, Briefcase,
    PhoneCall, Edit3, ArrowLeft, Users,
    GraduationCap, Award, Star, FileText,
    School, HeartHandshake, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const Profile = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/bs1/profile');
                if (response.data.success) {
                    setStudent(response.data.data);
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
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    if (!student) return null;

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper for Rating Stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
        ));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">

            {/* Top Navigation / Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            {student.role || 'Student'} &bull; {student.department}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 1: Top (Profile + Personal) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Header Card (Profile Pic) */}
                <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 p-12 bg-black/5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold mb-6 border-4 border-white/20 shadow-inner">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                    </div>

                    <h2 className="relative z-10 text-2xl font-bold mb-2">{student.name}</h2>
                    <p className="relative z-10 text-blue-100 text-sm mb-6 max-w-[80%] mx-auto leading-relaxed">
                        {student.register_number} <br />
                        {student.department}
                    </p>

                    <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase border border-white/10">
                        <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)] ${student.status === 'in' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        Status: {student.status === 'in' ? 'Inside Campus' : 'Outside'}
                    </div>
                </div>

                {/* 2. Personal Details */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <User className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Personal Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8">
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Email</p>
                            <p className="text-sm font-bold text-gray-900 break-all">{student.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Phone</p>
                            <p className="text-sm font-bold text-gray-900">{student.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">WhatsApp</p>
                            <p className="text-sm font-bold text-gray-900">{student.whatsapp_number || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Gender</p>
                            <p className="text-sm font-bold text-gray-900 capitalize">{student.gender || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Date of Birth</p>
                            <p className="text-sm font-bold text-gray-900">{formatDate(student.dob)}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Blood Group</p>
                            <p className="text-sm font-bold text-gray-900">{student.blood_group || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Religion</p>
                            <p className="text-sm font-bold text-gray-900">{student.religion || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Community</p>
                            <p className="text-sm font-bold text-gray-900">{student.community || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Nationality</p>
                            <p className="text-sm font-bold text-gray-900">{student.nationality || 'Indian'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Middle (Academic + Hostel) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 3. Academic Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Briefcase className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Academic Info</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
                        <div className="col-span-1 sm:col-span-2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Department</p>
                                    <p className="text-sm font-bold text-gray-900">{student.department || 'CSE'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Roll Number</p>
                                    <p className="text-sm font-bold text-gray-900">{student.roll_number || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Register No</p>
                            <p className="text-sm font-bold text-gray-900">{student.register_number || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Current Year</p>
                            <p className="text-sm font-bold text-gray-900">{student.year ? `${student.year} Year` : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Section</p>
                            <p className="text-sm font-bold text-gray-900">{student.section || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Batch</p>
                            <p className="text-sm font-bold text-gray-900">{student.batch || '2022-2026'}</p>
                        </div>

                        {/* Schooling */}
                        <div className="col-span-1 sm:col-span-2 pt-4 border-t border-dashed border-gray-200">
                            <p className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-2">
                                <School size={14} /> Previous Education
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">School Name</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate">{student.school_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Percentage</p>
                                    <p className="text-sm font-semibold text-gray-900">{student.school_percentage ? `${student.school_percentage}%` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Hostel Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Home className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Hostel Responsibility</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-8">
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Assigned Block</p>
                            <p className="text-sm font-bold text-gray-900">{student.hostel_block || 'Not Assigned'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Assigned Floor</p>
                            <p className="text-sm font-bold text-gray-900">{student.floor || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Room No</p>
                            <p className="text-sm font-bold text-gray-900">{student.room_number || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Bed No</p>
                            <p className="text-sm font-bold text-gray-900">{student.bed_number || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Mess Type</p>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${student.food_type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <p className="text-sm font-bold text-gray-900 capitalize">{student.food_type || 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Admission Type</p>
                            <p className="text-sm font-bold text-gray-900 capitalize">{student.admission_type || 'Regular'}</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Section 3: Performance & Faculty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Academic Performance */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <GraduationCap className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Academic Performance</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-8">
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">CGPA</p>
                            <p className="text-2xl font-bold text-purple-700">{student.cgpa || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Current GPA</p>
                            <p className="text-2xl font-bold text-gray-800">{student.gpa || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Total Marks</p>
                            <p className="text-sm font-bold text-gray-900">{student.total_marks || 0}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Attendance</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-gray-900">{student.attendance_percentage}%</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${student.attendance_percentage >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {student.attendance_percentage >= 75 ? 'Good' : 'Low'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Result Status</p>
                            <span className={`px-2 py-1 text-xs font-bold rounded ${student.result_status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {student.result_status || 'N/A'}
                            </span>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Academic Status</p>
                            <p className="text-sm font-bold text-gray-900">{student.academic_status || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Faculty & Mentorship */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <HeartHandshake className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Faculty & Mentorship</h3>
                    </div>
                    <div className="space-y-6">
                        {/* Mentor */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mentor</p>
                                <p className="text-sm font-bold text-gray-900">{student.mentor_name || 'N/A'}</p>
                                {student.mentor_phone && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Phone size={10} /> {student.mentor_phone}</p>}
                                {student.mentor_email && <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} /> {student.mentor_email}</p>}
                            </div>
                        </div>
                        {/* Class Coordinator */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Class Coordinator</p>
                                <p className="text-sm font-bold text-gray-900">{student.class_coordinator_name || 'N/A'}</p>
                                {student.class_coordinator_phone && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Phone size={10} /> {student.class_coordinator_phone}</p>}
                                {student.class_coordinator_email && <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} /> {student.class_coordinator_email}</p>}
                            </div>
                        </div>
                        {/* HOD */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">HOD</p>
                                <p className="text-sm font-bold text-gray-900">{student.hod_name || 'N/A'}</p>
                                {student.hod_phone && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Phone size={10} /> {student.hod_phone}</p>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Section 4: Behavioral & Scholarships */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Behavioral Report */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <ShieldCheck className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Behavioral Report</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Behavior Rating</p>
                                <div className="flex gap-1">{renderStars(student.behavior_rating || 0)}</div>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Discipline Rating</p>
                                <div className="flex gap-1">{renderStars(student.discipline_rating || 0)}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-t border-gray-50 pt-4">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Attitude</p>
                                <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
                                    {student.attitude || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Trust Level</p>
                                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                                    {student.trust_level || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {student.faculty_remark && (
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Faculty Remark</p>
                                <p className="text-sm text-gray-800 italic">"{student.faculty_remark}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scholarships */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Award className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Scholarships</h3>
                    </div>

                    {student.scholarships && student.scholarships.length > 0 ? (
                        <div className="space-y-4">
                            {student.scholarships.map((scholarship, index) => (
                                <div key={scholarship._id || index} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{scholarship.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1 capitalize">{scholarship.category}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                            {scholarship.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-sm">
                                        <span className="font-semibold text-gray-900">₹{scholarship.amount?.toLocaleString()}</span>
                                        <span className="text-gray-500">{scholarship.academic_year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <Award size={48} className="mb-2 opacity-20" />
                            <p className="text-sm">No scholarships availed</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Section 5: Bottom (Contact + Address) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Additional Contact */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <PhoneCall className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Additional Contact</h3>
                    </div>
                    <div className="space-y-8">
                        {/* Father */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase flex items-center gap-2">
                                <Users size={14} /> Father
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Name / Phone</p>
                                    <p className="text-sm font-bold text-gray-900">{student.father_name}</p>
                                    <p className="text-sm text-gray-600">{student.father_phone}</p>
                                </div>
                                <div className="break-all">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Email</p>
                                    <p className="text-sm font-medium text-gray-700">{student.father_email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Mother */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase flex items-center gap-2">
                                <Users size={14} /> Mother
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Name / Phone</p>
                                    <p className="text-sm font-bold text-gray-900">{student.mother_name}</p>
                                    <p className="text-sm text-gray-600">{student.mother_phone}</p>
                                </div>
                                <div className="break-all">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Email</p>
                                    <p className="text-sm font-medium text-gray-700">{student.mother_email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Guardian (if exists) */}
                        {(student.guardian_name) && (
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase flex items-center gap-2">
                                    <Users size={14} /> Guardian
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Name / Phone</p>
                                        <p className="text-sm font-bold text-gray-900">{student.guardian_name}</p>
                                        <p className="text-sm text-gray-600">{student.guardian_phone}</p>
                                    </div>
                                    <div className="break-all">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Email</p>
                                        <p className="text-sm font-medium text-gray-700">{student.guardian_email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Assignments */}
                        <div className="pt-4 border-t border-dashed border-gray-200">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Hostel Contacts</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Warden Name</p>
                                    <p className="text-sm font-bold text-gray-900">{student.warden_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Warden Phone</p>
                                    <p className="text-sm font-bold text-gray-900">{student.assigned_warden_phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <MapPin className="text-purple-600" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Address</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-y-8">
                        <div>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Current Address</p>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed text-lg">
                                {student.address_line_1 ? (
                                    <>
                                        {student.address_line_1}, {student.address_line_2 && `${student.address_line_2}`}
                                    </>
                                ) : 'N/A'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">City</p>
                                <p className="text-sm font-bold text-gray-900">{student.city || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">State</p>
                                <p className="text-sm font-bold text-gray-900">{student.state || 'Tamil Nadu'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Pincode</p>
                                <p className="text-sm font-bold text-gray-900">{student.pincode || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Permanent Address</p>
                                <p className="text-sm font-bold text-gray-900">{student.permanent_address || 'Same as above'}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                                    <PhoneCall size={16} />
                                </div>
                                <h4 className="text-sm font-bold text-gray-800">Emergency Contact Priority</h4>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                <p className="text-xs text-orange-800 font-medium mb-1 uppercase tracking-wide">Primary Contact</p>
                                <p className="text-lg font-bold text-gray-900 capitalize">
                                    {student.emergency_contact_priority || 'Father'}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {student.emergency_contact_priority === 'father' ? student.father_phone :
                                        student.emergency_contact_priority === 'mother' ? student.mother_phone :
                                            student.emergency_contact_priority === 'guardian' ? student.guardian_phone :
                                                student.father_phone}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;

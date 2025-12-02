import React from 'react'
import StudentInfo from './StudentInfo'
import ParentInfo from './ParentInfo'
import HostelInfo from './HostelInfo'
import LeaveInfo from './LeaveInfo'

const StudentDashboard = () => {
  return (
    <div>
      <StudentInfo />
     <section className='flex gap-6 mb-6'>
       <div className='flex-8'>
        <ParentInfo />
       </div>
       <div className='flex-2'>
        <HostelInfo />
       </div>
     </section>
     <LeaveInfo />
    </div>
  )
}

export default StudentDashboard
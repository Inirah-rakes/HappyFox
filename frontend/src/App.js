import React from 'react';
import './App.css'; // Your existing CSS
import {Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout'; 
import AdminLayout from './Components/AdminLayout'; 
import Home from './Pages/Home'; // Import the new Home component
import CourseDetail from './Pages/CourseDetails';
import Placements from './Pages/Placements';
import DriveDetail from './Pages/DriveDetail'; // New import
import CompanyPrep from './Pages/CompanyPrep'; 
import Learning from './Pages/Learning'; // Assuming this is already created from previous step
import StudentDataSender from './Pages/ResumeBuilder';
import MyProfile from './Pages/MyProfile';
import LoginPage from './Pages/LoginPage';
import AdminHome from './Pages/AdminHome';
import PlacementMgt from './Pages/PlacementMgt';
import StudentTracking from './Pages/StudentTracking';
import OverviewReport from './Pages/OverviewReport';
import Jobs from './Pages/Jobs';
import IDE from './Pages/IDE';
import RoadmapCreator from './Pages/Roadmap'; // New import for roadmap creator
function App() {
  return (

      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route element = {<Layout/>}>
        <Route path ="/home" element={<Home/>}/>
        <Route path="/learning" element={<Learning />} />
        <Route path="/roadmap" element={<RoadmapCreator />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/resume-builder" element={<StudentDataSender />} />
         <Route path="/drive/:id" element={<DriveDetail />} /> {/* New route for drive details */}
      <Route path="/prep/:id" element={<CompanyPrep />} /> {/* New route for company prep */}
        <Route path="/my-profile" element={<MyProfile />} />
         <Route path ="/ide" element={<IDE/>} />
        {/* Add more routes as you build pages */}
        </Route>

        <Route element={<AdminLayout />}>
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/admin/jobs" element={<Jobs />} />
        <Route path="/admin/placement-management" element={  <PlacementMgt/>}/>
        <Route path="/admin/student-tracking" element={<StudentTracking/>} />
        <Route path="/admin/overview-reports" element={<OverviewReport/>} />
      </Route>
      </Routes>
 
  );
}

export default App;

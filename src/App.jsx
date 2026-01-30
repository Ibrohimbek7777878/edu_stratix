import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DynamicBackground from './components/DynamicBackground'; 

// Sahifalar importi...
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import LiveStream from './pages/LiveStream';
import Messages from './pages/Messages';
import UploadCourse from './pages/UploadCOurse';
import Wallet from './pages/Wallet';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import AddLesson from './pages/AddLesson';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import StaticPage from './pages/StaticPage';
import ParentControl from './pages/ParentControl';
import AiAssistant  from './pages/AIAssistant';
import AdminPanel from './pages/AdminPanel';
import CreateAdmin from './pages/CreateAdmin';
import Parents from './pages/Parents';
import StudentSignup from './pages/StudentSignup';

function App() {
  return (
    <div className="App relative min-h-screen">
      {/* 1. DINAMIK FON (Bu Routes ichida bo'lmasligi KERAK) */}
      <DynamicBackground />

      {/* 2. ASOSIY SAHIFALAR */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ... Boshqa barcha route'lar ... */}
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/create-admin" element={<CreateAdmin />} />

          {/* Himoyalangan */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <LiveStream />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* O'qituvchi */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:id/add-lesson"
            element={
              <ProtectedRoute>
                <AddLesson />
              </ProtectedRoute>
            }
          />
          <Route path="/parents" element={<Parents />} />
          <Route
            path="/parent-control"
            element={
              <ProtectedRoute>
                <ParentControl />
              </ProtectedRoute>
            }
          />
          <Route path="/signup-student" element={<StudentSignup />} />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AiAssistant />
              </ProtectedRoute>
            }
          />

          {/* Info */}
          <Route path="/info/:page" element={<StaticPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;


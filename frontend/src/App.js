import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import LearningPlanList from './components/LearningPlanList';
import LearningPlanDetail from './components/LearningPlanDetail';
import AddLearningPlan from './components/AddLearningPlan';
import EditLearningPlan from './components/EditLearningPlan';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import Notifications from './components/Notifications';
import FollowersList from './components/FollowersList';
import FollowingList from './components/FollowingList';
import OAuthCallback from './components/OAuthCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home and Authentication Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />



        {/* Learning Plan Routes */}
        <Route path="/learning-plans" element={<LearningPlanList />} />
        <Route path="/learning-plan/:planId" element={<LearningPlanDetail />} />
        <Route path="/add-learning-plan" element={<AddLearningPlan />} />
        <Route path="/edit-learning-plan/:planId" element={<EditLearningPlan />} />

        {/* User Profile Routes */}
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/followers/:userId" element={<FollowersList />} />
        <Route path="/following/:userId" element={<FollowingList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import FacilityAssetList from './components/FacilityAssetList';
import FacilityAssetDetail from './components/FacilityAssetDetail';
import AddFacilityAssetEntry from './components/AddFacilityAssetEntry';
import EditFacilityAssetEntry from './components/EditFacilityAssetEntry';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import Notifications from './components/Notifications';
import FollowersList from './components/FollowersList';
import FollowingList from './components/FollowingList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home and Authentication Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Facility & Asset Routes */}
        <Route path="/facility-assets" element={<FacilityAssetList />} />
        <Route path="/facility-asset/:assetId" element={<FacilityAssetDetail />} />
        <Route path="/add-facility-asset" element={<AddFacilityAssetEntry />} />
        <Route path="/edit-facility-asset/:assetId" element={<EditFacilityAssetEntry />} />

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

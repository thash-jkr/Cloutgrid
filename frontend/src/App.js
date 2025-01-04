import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import Login from "./components/authentication/login";
import Logout from "./components/authentication/logout";
import Register from "./components/authentication/register";
import Profile from "./components/profile/profile";
import Profiles from "./components/profile/profiles";
import Feed from "./components/feed/feed";
import CreatorUserRegisterForm from "./components/authentication/registerCreator";
import BusinessUserRegisterForm from "./components/authentication/registerBusiness";
import JobList from "./components/jobs/jobList";
import JobCreate from "./components/jobs/jobCreate";
import JobDetail from "./components/jobs/jobDetail";
import MyJobs from "./components/jobs/myJobs";
import JobApplicants from "./components/jobs/jobApplicants";
import PasswordResetRequest from "./components/authentication/password_reset/passwordReset";
import PasswordResetConfirm from "./components/authentication/password_reset/confirmReset";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/creator" element={<CreatorUserRegisterForm />} />
        <Route
          path="/register/business"
          element={<BusinessUserRegisterForm />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profiles/:username" element={<Profiles />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/job/create" element={<JobCreate />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/my-jobs/:jobId" element={<JobApplicants />} />
        <Route path="/forgot-password" element={<PasswordResetRequest />} />
        <Route path="/reset-password/:uid/:token" element={<PasswordResetConfirm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

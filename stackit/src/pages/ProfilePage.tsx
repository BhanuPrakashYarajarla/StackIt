import React from "react";

const ProfilePage = () => {
  // TODO: Fetch user details, posted questions, and answered questions from backend
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">User Profile</h2>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">User Details</h3>
        {/* TODO: Show user details here */}
      </div>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Questions Posted</h3>
        {/* TODO: List user's posted questions here */}
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Questions Answered</h3>
        {/* TODO: List user's answered questions here */}
      </div>
    </div>
  );
};

export default ProfilePage; 
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Loginpage from "./components/Loginpage";
import Home from "./components/Home";
import Miscfiles from "./components/Miscfiles";
import Performance from "./components/Performance";
import Selection from "./components/Selection";
import Commitment from "./components/Commitment";
import FinalReport from "./components/FinalReport";
import Chats from "./components/dashboard/Chats";
import UserHome from "./components/dashboard/UserHome";
import UserFinalReport from "./components/dashboard/UserFinalReport";
import UserPerformance from "./components/dashboard/UserPerformance";
import UserMiscfiles from "./components/dashboard/UserMiscfiles";
import UserCommitment from "./components/dashboard/UserCommitment";
import MyChats from "./components/MyChats";
import Filtering from "./components/Filtering";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div className="overflow">
     <Router>
  <Routes>
    {/* Login route (no layout) */}
    <Route path="/want-to-log-in" element={<Loginpage />} />

    {/* All other routes use the Layout */}
    <Route element={<Layout />}>
  <Route path="Disclosure" element={<Filtering />} />
  <Route path="FinalReport" element={<FinalReport />} />
  <Route path="info" element={<MyChats />} />
  <Route path="Performance" element={<Home />} />
  <Route path="TeamBuild" element={<Performance />} />
  <Route path="Hygine" element={<Miscfiles />} />
  <Route path="Compliance" element={<Commitment />} />
  <Route path="Selection" element={<Selection />} />
  <Route path="MyChats" element={<MyChats />} />

  <Route path="profile/:name/Review" element={<UserFinalReport />} />
  <Route path="profile/:name/Performance" element={<UserHome />} />
  <Route path="profile/:name/TeamBuild" element={<UserPerformance />} />
  <Route path="profile/:name/Hygine" element={<UserMiscfiles />} />
  <Route path="profile/:name/Compliance" element={<UserCommitment />} />
  <Route path="profile/:name/Chats" element={<Chats />} />
</Route>


    {/* 404 route (no layout) */}
    <Route path="*" element={<NotFound />} />
    <Route path="/" element={<NotFound />} />
  </Routes>
</Router>

    </div>
  );
}

export default App;

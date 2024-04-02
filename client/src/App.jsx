import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  Home,
  About,
  Dashboard,
  SignIn,
  SignUp,
  Projects,
  CreatePost,
  UpdatePost,
  Search,
} from "./pages/index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Private from "./components/Private";
import AdminPrivate from "./components/AdminPrivate";
import Post from "./pages/Post";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<Private />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivate />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:slugId" element={<Post />} />
        <Route path="*" element={<Navigate to="/signin" />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./Components/Header";
import axios from "axios";
import FooterCom from "./Components/Footer";
// import { UserContextProvider } from "./UserContext";
import PrivateRoute from "./Components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import AdminPrivateRoute from "./Components/AdminPrivateRoute";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./Components/ScrollToTop";
import Search from "./pages/Search";
import CheckToken from "./Components/CheckToken";
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App()
{
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route element={<CheckToken />}>
            <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route element={<AdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          </Route>
        </Routes>
        <FooterCom />
      </BrowserRouter>
    </>
  );
}

export default App;

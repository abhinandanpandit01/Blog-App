import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/Theme";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";
import { signOutSuccess } from "../redux/UserSlice";

export default function Header()
{
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const path = useLocation().pathname;
  const naviagte = useNavigate()
  const [searchTerm,setSearchTerm] = useState("")
  const location = useLocation()
  const handleSignOut = async () =>
  {
    try
    {
      await axios.post("/api/user/signOut").then(() =>
      {
        dispatch(signOutSuccess())
        naviagte("/signIn")
      })
    } catch (err)
    {
      console.log(err)
    }
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    const urlParam = new URLSearchParams(location.search)
    urlParam.set("searchTerm",searchTerm)
    naviagte(`${location.pathname}?${urlParam.toString()}`)
  }
  useState(()=>{
    const urlPramas = new URLSearchParams(location.search)
    const searchTermFromUrl = urlPramas.get("searchTerm")
    if(searchTermFromUrl)setSearchTerm(searchTermFromUrl)

  },[location.search])
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="bg-gradient-to-r from-blue-600 to-violet-600 px-1 py-2 rounded-lg bg-clip-text text-transparent font-bold">
          Blog<span>X</span>
        </span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          placeholder="Search ..."
          rightIcon={IoSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="p-1 lg:hidden outline-none" color="gray" pill>
        <IoSearch fontSize="1.5em" />
      </Button>
      <div className="flex gap-3 md:order-3">
        <Button
          pill
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          onClick={() =>
          {
            dispatch(toggleTheme());
          }}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profileImg} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-semibold truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Log Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signIn">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as="div">
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as="div">
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as="div">
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

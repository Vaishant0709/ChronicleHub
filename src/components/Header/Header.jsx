import React from "react";
import {Container , Logo , LogoutBtn } from '../index'
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header(){
  const authStatus=useSelector((state)=>{
    console.log("Redux State:",state);
    return state.auth?.status||false
  });
  const navigate=useNavigate()

  const navItems=[
    {
      name:'Home',
      slug:'/',
      active:true
    },
    {
      name:'Login',
      slug:'/login',
      active:!authStatus
    },
    {
      name:"Signup",
      slug:"/signup",
      active:!authStatus
    },
    {
      name : "All Posts",
      slug:"/all-posts",
      active:authStatus
    },
    {
      name:"Add Post",
      slug:"/add-post",
      active:authStatus
    }
  ]

  return (
    <header className="py-3 shadow bg-gray-500">
      <Container>
        <nav className="flex">
          <div className="mr-4">
            <Link to='/'>
              <Logo width='70px'/>
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2">
    <Link to='/'>
    <h3 className="text-gray-700 text-3xl font-semibold tracking-wide">ChronicleHub</h3>
    </Link>
  </div>
          <ul className="flex ml-auto">
            {navItems.map((item)=>
            item.active ?(
              <li key={item.name}>
                <button
                onClick={()=> navigate(item.slug)}
                className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
                >{item.name}</button>
              </li>
            ) :null
            )}
            {authStatus && (
              <li><LogoutBtn/></li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header;
// src/components/NavBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className=" flex justify-between items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg h-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-white text-2xl font-semibold tracking-wide hover:text-gray-200 transition-all duration-300"
        >
          Contact-Book
        </Link>
        <div>
          {!token ? (
            <>
              <Link 
                to="/login" 
                className="text-white px-4 py-2 mx-1 hover:bg-purple-600 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-white px-4 py-2 mx-1 hover:bg-purple-600 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
              >
                Register
              </Link>
            </>
          ) : (
            <div>
                <Link 
                to="/view" 
                className="text-white px-4 py-2 mx-1 hover:bg-purple-600 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
              >
                View
              </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 mx-1 rounded-lg shadow-md hover:bg-red-600 hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
            >
              Logout
            </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

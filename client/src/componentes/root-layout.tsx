import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const RootLayout: React.FC = () => {
  return (
    <div className="container">
      <header className="header">
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/commands">Commands</NavLink>
            </li>
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;

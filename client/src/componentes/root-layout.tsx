import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const RootLayout: React.FC = () => {
  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1>CLI</h1>
          <NavLink to="/commands">Commands</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="admin">Admin</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;

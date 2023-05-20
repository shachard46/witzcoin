import { makeStyles } from "@material-ui/core/styles";
import { ClassNameMap } from "@material-ui/styles";
import { createContext } from "react";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(7),
    width: "wrap-content",
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    backgroundColor: "#e0e0e0",
    borderRadius: theme.spacing(1),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  textField: {
    backgroundColor: "white",
    borderRadius: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const ThemeContext = createContext<ClassNameMap>({});

const RootLayout: React.FC = () => {
  const classes = useStyles();
  return (
    <div className="container">
      <header className="header">
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/commands">Commands</NavLink>
            </li>
            <li>
              <NavLink to="/perms">Admin</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <ThemeContext.Provider value={classes}>
          <Outlet />
        </ThemeContext.Provider>
      </main>
    </div>
  );
};

export default RootLayout;

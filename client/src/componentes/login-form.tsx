import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import axios from "axios";

interface User {
  username: string;
  password: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(7),
    width: "wrap-content",
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    backgroundColor: "#e0e0e0",
    borderRadius: theme.spacing(1),
  },
  textField: {
    backgroundColor: "white",
    borderRadius: theme.spacing(1),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const login = (user: User) => {
  axios({
    method: "post",
    url: "/login",
    data: { ...user },
  });
};

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = user;
    temp.username = event.target.name;
    setUser(temp);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = user;
    temp.password = event.target.name;
    setUser(temp);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login(user);
    navigate("/commands");
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <div>
        <Typography component="h1" variant="h5" align="center">
          Log In
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          className={classes.textField}
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={user.username}
          onChange={handleUsernameChange}
        />
        <FormControl variant="outlined" margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            className={classes.textField}
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={handlePasswordChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleShowPasswordToggle} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Log In
        </Button>
      </div>
    </Container>
  );
};

export default LoginForm;

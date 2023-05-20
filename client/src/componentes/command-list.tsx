import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@material-ui/core";
import { ThemeContext } from "./root-layout";
import { CommandsContext } from "../App";

const CommandList: React.FC = () => {
  const classes = useContext(ThemeContext);
  const commands = useContext(CommandsContext);
  const navigate = useNavigate();
  const handleCommand = (name: string): void => {
    navigate(`/commands/${name}`);
  };

  return (
    <Container maxWidth="xs" component="main" className={classes.root}>
      <Typography align="center" component="h1" variant="h5">
        Commands:
      </Typography>
      {commands.map((command) => (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            handleCommand(command.name);
          }}
        >
          {command.name}
        </Button>
      ))}
    </Container>
  );
};

export default CommandList;

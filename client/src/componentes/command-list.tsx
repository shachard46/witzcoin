import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, makeStyles } from "@material-ui/core";
import { Command } from "./command";
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(15),
    width: "wrap-content",
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
    backgroundColor: "#e0e0e0",
    borderRadius: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 0),
  },
}));

const CommandList: React.FC<{ commands: Command[] }> = ({ commands }) => {
  const classes = useStyles();
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

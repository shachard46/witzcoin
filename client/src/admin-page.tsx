import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(15),
    width: 'wrap-content',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    backgroundColor: '#e0e0e0', 
    borderRadius: theme.spacing(1)
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  textField: {
    backgroundColor: 'white',
    borderRadius: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const AdminPage: React.FC = () => {
  const classes = useStyles();
  const [allowIp, setAllowIp] = useState("");
  const [blockIp, setBlockIp] = useState("");

  const handleAllowIPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowIp(event.target.value);
  };

  const handleBlockIPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockIp(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <form>
        <Typography
          align="center"
          component="h1"
          variant="h5"
        >
          IP Managment
        </Typography>
        <FormControl className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                className={classes.textField}
                fullWidth
                id="allow_ip"
                label="Allow IP"
                name="allow_ip"
                autoComplete="192.100.1.12"
                autoFocus
                value={allowIp}
                onChange={handleAllowIPChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                className={classes.textField}
                fullWidth
                id="block_ip"
                label="Block IP"
                name="block_ip"
                autoComplete="192.100.1.12"
                autoFocus
                value={blockIp}
                onChange={handleBlockIPChange}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Change IP Permissions
            </Button>
          </Grid>
        </FormControl>
      </form>
    </Container>
  );
};

export default AdminPage;

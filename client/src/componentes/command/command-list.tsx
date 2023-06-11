import { Button, Container, List, Paper, Typography } from '@material-ui/core'
import React, { MouseEventHandler, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ProtectedPage } from '../protected/protected-page'
import { ThemeContext } from '../root-layout'
import { useCommands } from './commands-provider'
import { useApi } from '../api/api-provider'

const CommandList: React.FC = () => {
  const classes = useContext(ThemeContext)
  const [commands, refreshCommands] = useCommands()
  const api = useApi()

  useEffect(() => {
    refreshCommands()
  }, [commands, refreshCommands])
  const handleDelete: MouseEventHandler<HTMLButtonElement> = (event): void => {
    const a = event.name
    throw new Error('Function not implemented.')
  }

  return (
    <ProtectedPage level={1}>
      <Container maxWidth='xs' component='main' className={classes.root}>
        <Typography
          align='center'
          component='h1'
          variant='h5'
          className='title'
        >
          Commands:
        </Typography>
        <Paper className='paper'>
          <List className='command-links'>
            {commands.map(command => (
              <li key={'li' + commands.indexOf(command)}>
                <NavLink
                  to={`/p/command/?name=${command.name}`}
                  color='primary'
                  key={'link' + commands.indexOf(command)}
                  className={classes.submit}
                >
                  {command.name}
                </NavLink>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                  onClick={handleDelete}
                >
                  Log In
                </Button>
                ƒ
              </li>
            ))}
          </List>
        </Paper>
      </Container>
    </ProtectedPage>
  )
}

export default CommandList

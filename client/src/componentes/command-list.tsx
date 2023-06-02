import { Container, List, Paper, Typography } from '@material-ui/core'
import React, { useContext, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CommandsContext } from '../App'
import { deepEqual } from '../utils'
import api from './hooks/api'
import { Command } from './command/command'
import { ThemeContext } from './root-layout'
import useCommands from './hooks/get-commands'

const CommandList: React.FC = () => {
  const classes = useContext(ThemeContext)
  const [commands, setCommands] = useContext(CommandsContext)
  useCommands(api, commands, setCommands)
  const navigate = useNavigate()
  const handleCommand = (name: string): void => {
    navigate(`/commands/${name}`)
  }
  return (
    <Container maxWidth='xs' component='main' className={classes.root}>
      <Typography align='center' component='h1' variant='h5' className='title'>
        Commands:
      </Typography>
      <Paper className='paper'>
        <List className='command-links'>
          {commands.map(command => (
            <li key={'li' + commands.indexOf(command)}>
              <NavLink
                to={`/command/?name=${command.name}`}
                color='primary'
                key={'link' + commands.indexOf(command)}
                className={classes.submit}
                onClick={() => {
                  handleCommand(command.name)
                }}
              >
                {command.name}
              </NavLink>
            </li>
          ))}
        </List>
      </Paper>
    </Container>
  )
}

export default CommandList

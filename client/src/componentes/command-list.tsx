import { Container, List, Paper, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CommandsContext } from '../App'
import { ThemeContext } from './root-layout'

const CommandList: React.FC = () => {
  const classes = useContext(ThemeContext)
  const commands = useContext(CommandsContext)
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
          {/* <ul > */}
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
          {/* </ul> */}
        </List>
      </Paper>
    </Container>
  )
}

export default CommandList

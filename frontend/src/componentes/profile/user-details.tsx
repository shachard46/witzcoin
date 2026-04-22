import { Paper, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { User } from '../transaction/models'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: 'auto',
  marginBottom: theme.spacing(1),
  maxWidth: 480,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
}))

const PositiveBalance = styled('span')(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 600,
}))

const NegativeBalance = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 600,
}))
const AccountDetails: React.FC<{ user: User }> = ({ user }) => {
  const displayName =
    user.fullName?.trim() || user.email?.trim() || user.username
  return (
    <StyledPaper>
      <Stack spacing={2} alignItems='center'>
        <Typography variant='h5' sx={{ mb: 0.5 }}>
          הפרופיל של {displayName}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          Account id (legacy): {user.username}
        </Typography>
        <Typography variant='body1' sx={{ lineHeight: 1.7 }}>
          עו"ש:{' '}
          {user.balance >= 0 ? (
            <PositiveBalance>${user.balance.toFixed(2)}</PositiveBalance>
          ) : (
            <NegativeBalance>${user.balance.toFixed(2)}</NegativeBalance>
          )}
        </Typography>
        <Typography variant='body1' sx={{ lineHeight: 1.7 }}>
          סכום מעסקאות ממתינות:{' '}
          {user.pending >= 0 ? (
            <PositiveBalance>${user.pending.toFixed(2)}</PositiveBalance>
          ) : (
            <NegativeBalance>${user.pending.toFixed(2)}</NegativeBalance>
          )}
        </Typography>
      </Stack>
    </StyledPaper>
  )
}

export default AccountDetails

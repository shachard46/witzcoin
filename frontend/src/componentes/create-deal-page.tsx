import {
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import React, { useContext, useState } from 'react'

const categories = ['אוכל', 'מטלה', 'חד פעמי', 'ממושך', 'מביך']

const CreateDealPage: React.FC = () => {
  const [buyerUsername, setBuyerUsername] = useState('')
  const [sellerUsername, setSellerUsername] = useState('')
  const [witnessusername, setWitnessUsername] = useState('')
  const [dealName, setDealName] = useState('')
  const [category, setCategory] = React.useState<string[]>([])
  const [dealInfo, setDealInfo] = useState('')
  const handleInputChange = (set: Function) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      set(event.target.value)
    }
  }
  const handleBuyerUsernameChange = handleInputChange(setBuyerUsername)
  const handleSellerUsernameChange = handleInputChange(setSellerUsername)
  const handleWitnessUsernameChange = handleInputChange(setWitnessUsername)
  const handleDealNameChange = handleInputChange(setDealName)
  const handleDealInfoChange = handleInputChange(setDealInfo)
  const handleCategoryChange = (
    event: SelectChangeEvent<typeof categories>,
  ) => {
    const {
      target: { value },
    } = event
    setCategory(
          typeof value === 'string' ? value.split(',') : value,
    )
  }

  const categories_items = categories.map(item => {
    return (
      <MenuItem value={item}>
        <Checkbox checked={category.indexOf(item) > -1} />{' '}
        <ListItemText primary={item} />{' '}
      </MenuItem>
    )
  })
  return (
    <div className='deal-container'>
      <Container component='main' maxWidth='md' className='root'>
        <div>
          <Typography component='h1' variant='h5' align='center'>
            יצירת עסקה
          </Typography>
          <TextField
            variant='outlined'
            margin='normal'
            required
            className='textField'
            fullWidth
            id='deal_name'
            label='שם העסקה'
            name='deal_name'
            autoComplete='שם העסקה'
            autoFocus
            value={dealName}
            onChange={handleDealNameChange}
          />
          <div className='usernames-row row'>
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='deal-username'
              fullWidth
              id='buyer_username'
              label='שם הקונה'
              name='buyer_username'
              autoComplete='שם הקונה'
              autoFocus
              value={buyerUsername}
              onChange={handleBuyerUsernameChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='deal-username'
              fullWidth
              id='witness_username'
              label='שם העד'
              name='witness_username'
              autoComplete='שם העד'
              autoFocus
              value={witnessusername}
              onChange={handleWitnessUsernameChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='deal-username'
              fullWidth
              id='seller_username'
              label='שם המוכר'
              name='seller_username'
              autoComplete='שם המוכר'
              autoFocus
              value={sellerUsername}
              onChange={handleSellerUsernameChange}
            />
          </div>
          <FormControl fullWidth>
            <InputLabel id='category-label'>קטגוריה</InputLabel>
            <Select
              labelId='category-label'
              id='category-select'
              className='row'
              value={category}
              multiple
              renderValue={selected => selected.join(', ')}
              label='קטגוריה'
              onChange={handleCategoryChange}
            >
              {categories_items}
            </Select>
          </FormControl>
          <TextField
            variant='outlined'
            margin='normal'
            required
            className='deal-notes row'
            fullWidth
            multiline
            minRows={5}
            id='deal_elab'
            label='פירוט העסקה'
            name='deal_elab'
            autoComplete='פירוט העסקה'
            autoFocus
            value={dealInfo}
            onChange={handleDealInfoChange}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className='submit'
            onClick={props => {}}
          >
            לחיצת ידיים
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default CreateDealPage

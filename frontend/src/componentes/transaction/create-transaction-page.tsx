import {
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useNavigate } from 'react-router-dom'

import React, { useEffect, useState } from 'react'
import { useApi } from '../api/api-provider'
import { Approver, Transaction } from './models'
import { useToken } from '../auth/token-provider'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { Breadcrumb } from 'antd'

// const categories = ['אוכל', 'מטלה', 'חד פעמי', 'ממושך', 'מביך']

const CreateDealPage: React.FC = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [token] = useToken()
  const [categories, setCategories] = useState<[]>([])
  const [currency, setCurrency] = React.useState('')

  const [transaction, setTrasaction] = useState<Transaction>({
    id: 0,
    buyerUser: '',
    sellerUser: '',
    witnessUser: '',
    category: [],
    details: '',
    price: 0,
    status: Approver.ALL,
    transactionName: '',
  })
  useEffect(() => {
    api.get<[]>('/categories').then(res => setCategories(res.data))
  }, [])
  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string)
  }
  const handleInputChange = (fieldName: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      {
        setTrasaction(prev => ({
          ...prev,
          [fieldName]: event.target.value,
        }))
      }
    }
  }
  const handleBuyerUsernameChange = handleInputChange('buyerUser')
  const handleSellerUsernameChange = handleInputChange('sellerUser')
  const handleWitnessUsernameChange = handleInputChange('witnessUser')
  const handleTransactionNameChange = handleInputChange('transactionName')
  const handleDetailsChange = handleInputChange('details')
  const handlePriceChange = handleInputChange('price')
  const handleCategoryChange = (
    event: SelectChangeEvent<typeof categories>,
  ) => {
    const {
      target: { value },
    } = event
    setTrasaction(prev => ({
      ...prev,
      category: typeof value === 'string' ? value.split(',') : value,
    }))
  }
  const handleSubmit = async (event: React.FormEvent, currency: number) => {
    event.preventDefault()
    transaction.price = currency == 0 ? 0 : transaction.price / currency
    const res = await api.post('/transactions', {
      transaction: transaction,
      issuingUsername: token ? token.data.username : '',
    })
    if (res) navigate('/p/profile')
    return
    // need to add socket.io.emit
  }
  const categories_items = categories.map(item => {
    return (
      <MenuItem value={item} id={categories.indexOf(item).toString()}>
        <Checkbox checked={transaction.category.indexOf(item) > -1} />{' '}
        <ListItemText primary={item} />{' '}
      </MenuItem>
    )
  })
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div className='deal-container'>
        <Container component='main' maxWidth='md'>
          <div>
            <Breadcrumb
              items={[
                {
                  title: 'Witzcoin Trading',
                },
                {
                  title: <a href=''>Transactoins</a>,
                },
              ]}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='textField'
              fullWidth
              id='transaction_name'
              label='שם העסקה'
              name='transaction_name'
              autoComplete='שם העסקה'
              autoFocus
              value={transaction.transactionName}
              onChange={handleTransactionNameChange}
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
                value={transaction.buyerUser}
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
                value={transaction.witnessUser}
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
                value={transaction.sellerUser}
                onChange={handleSellerUsernameChange}
              />
            </div>
            <FormControl fullWidth>
              <InputLabel id='category-label'>קטגוריה</InputLabel>
              <Select
                labelId='category-label'
                id='category-select'
                className='row'
                value={transaction.category}
                multiple
                renderValue={selected => selected.join(', ')}
                label='קטגוריה'
                onChange={handleCategoryChange}
              >
                {categories_items}
              </Select>
            </FormControl>
            <Grid container spacing={2} alignItems={'center'}>
              <Grid item xs={10}>
                <TextField
                  variant='outlined'
                  margin='normal'
                  required
                  className='deal-notes row'
                  fullWidth
                  id='price'
                  label='מחיר'
                  name='price'
                  autoComplete='0'
                  autoFocus
                  value={transaction.price}
                  onChange={handlePriceChange}
                />
              </Grid>
              <Grid item xs={2}>
                <Select
                  labelId='currencylabel'
                  variant='outlined'
                  className='deal-notes'
                  autoFocus
                  fullWidth
                  id='currency'
                  value={currency}
                  label='currency'
                  onChange={handleCurrencyChange}
                >
                  <MenuItem value={1}>Witzcoin</MenuItem>
                  <MenuItem value={1 / 30}>ShWitzcoin</MenuItem>
                  <MenuItem value={0}>Adamium</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='deal-notes row'
              fullWidth
              multiline
              minRows={5}
              id='details'
              label='פירוט העסקה'
              name='details'
              autoComplete='פירוט העסקה'
              autoFocus
              value={transaction.details}
              onChange={handleDetailsChange}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className='submit'
              onClick={event =>
                handleSubmit(event, Number.parseFloat(currency))
              }
            >
              לחיצת ידיים
            </Button>
          </div>
        </Container>
      </div>
    </ProtectedPage>
  )
}

export default CreateDealPage

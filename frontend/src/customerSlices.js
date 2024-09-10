import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { client } from './api'

const initialState = {
  data: [],
  single: {},
  status: 'idle',
  error: null,
  currentRequestId: null
}

// CUSTOMERS
const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'idle') {
          state.status = 'pending'
          state.currentRequestId = requestId
        }
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.data = action.payload
          state.currentRequestId = null
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.error = action.error
          state.currentRequestId = null
        }
      })
      .addCase(fetchCustomerById.pending, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'idle') {
          state.status = 'pending'
          state.currentRequestId = requestId
        }
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.single = action.payload
          state.currentRequestId = null
        }
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.error = action.error
          state.currentRequestId = null
        }
      })
      .addCase(createCustomer.pending, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'idle') {
          state.status = 'pending'
          state.currentRequestId = requestId
        }
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.data = state.data.concat(action.payload)
          state.currentRequestId = null
        }
      })
      .addCase(createCustomer.rejected, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.error = action.error
          state.currentRequestId = null
        }
      })
      // Update customer
      .addCase(updateCustomer.pending, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'idle') {
          state.status = 'pending'
          state.currentRequestId = requestId
        }
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.single = action.payload
          state.currentRequestId = null
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.error = action.error
          state.currentRequestId = null
        }
      })
      // Create customer contact
      .addCase(createCustomerContact.pending, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'idle') {
          state.status = 'pending'
          state.currentRequestId = requestId
        }
      })
      .addCase(createCustomerContact.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          const { customerId, result: contactData } = action.payload;
          if (state.single?.contacts) {
            state.single.contacts.push(contactData)
          } else {
            state.single.contacts = [contactData]
          }
          state.currentRequestId = null
        }
      })
      .addCase(createCustomerContact.rejected, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.error = action.error
          state.currentRequestId = null
        }
      })
      // Fetch customer contact
      .addCase(fetchCustomerContacts.pending, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'idle') {
          state.status = 'pending'
          state.currentRequestId = requestId
        }
      })
      .addCase(fetchCustomerContacts.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          const { customerId, result: contactData } = action.payload;
          state.single.contacts = contactData
          state.currentRequestId = null
        }
      })
      .addCase(fetchCustomerContacts.rejected, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.error = action.error
          state.currentRequestId = null
        }
      })
      // Delete customer contact
      .addCase(deleteCustomerContact.pending, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'idle') {
          state.status = 'pending'
          state.currentRequestId = requestId
        }
      })
      .addCase(deleteCustomerContact.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          const { customerId, result: contactData } = action.payload;
          state.single.contacts = contactData
          state.currentRequestId = null
        }
      })
      .addCase(deleteCustomerContact.rejected, (state, action) => {
        const { requestId } = action.meta
        if (state.status === 'pending' && state.currentRequestId === requestId) {
          state.status = 'idle'
          state.error = action.error
          state.currentRequestId = null
        }
      })
  },
})
export const customerReducer = customersSlice.reducer

export const fetchCustomers = createAsyncThunk(
  'customers',
  async () => {
    const result = await client('/api/customers')
    return result
  },
  {
    condition: (_args, { getState }) => {
      const { customers } = getState()
      return customers.status !== 'pending'
    }
  }
)

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id) => {
    const result = await client(`/api/customers/${id}`)
    return result
  },
  {
    condition: (id, { getState }) => {
      const { customers } = getState()
      return customers.status !== 'pending' && !customers.data.some(customer => customer.id === id)
    }
  }
)

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data) => {
    const result = await client(`/api/customers`, { data, method: 'POST' })
    return result
  }
)

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }) => {
    const result = await client(`/api/customers/${id}`, { data, method: 'PUT' })
    return result
  }
)

// MB-TODO: create action for creating customer contacts. NOTE: remember to add them to `customerSlice`
export const createCustomerContact = createAsyncThunk(
  'customerContacts/create',
  async ({ id, data }) => {
    const result = await client(`/api/customers/${id}/contacts`, { data, method: 'POST' })
    return { customerId: id, result }
  }
)

export const fetchCustomerContacts = createAsyncThunk(
  'customerContacts/fetch',
  async (id) => {
    const result = await client(`/api/customers/${id}/contacts`)
    return { customerId: id, result }
  }
)

export const deleteCustomerContact = createAsyncThunk(
  'customerContacts/delete',
  async ({ id, contactId }) => {
    const result = await client(`/api/customers/${id}/contacts/${contactId}`, { method: 'DELETE' })
    return { customerId: id, result }
  }
)

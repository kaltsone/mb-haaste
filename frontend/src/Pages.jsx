import CustomerTable from './CustomerTable'
import ContactTable from './ContactTable'
import CustomerContactTable from './CustomerContactTable'
import { useParams } from 'react-router-dom'
import MBTodo from './MBTodo'
import { useDispatch } from 'react-redux'
import { updateCustomer } from './customerSlices'
import { useCustomer, useCustomers, useContacts } from './hooks'
import NewCustomer from './NewCustomer'

export const Customers = () => {
  const { data: customers, status, error, refetch } = useCustomers()
  return (
    <div className='m-5'>
      <h1 className='fw-bold'>Customers</h1>
      <div className='d-flex justify-content-between'>
        <button className='btn btn-success' onClick={refetch}>
          <i className="bi bi-arrow-clockwise" />
          {' '}
          Refresh
        </button>
        <NewCustomer />
      </div>
      <div>
        {error
          ? <div className="alert alert-danger d-inline-block" role="alert">{error.message}</div>
          : null
        }
        {status === 'pending'
          ? 'Loading...'
          : <CustomerTable customers={customers} />
        }
      </div>
    </div>
  )
}

export const Customer = () => {
  const { customerId } = useParams()
  const { customer } = useCustomer(customerId)
  const dispatch = useDispatch()

  const toggleCustomerActivity = () => {
    dispatch(updateCustomer({ id: customerId, data: { id: customer.id, name: customer.name, country: customer.country, isActive: !customer.isActive } }))
  }


  return (
    <div className='m-5'>
      <h1 className='fw-bold'>Customer</h1>
      {customer
        ? <div>
          <form className='mb-5' onSubmit={event => {
            toggleCustomerActivity()
            // MB-TODO: Handle customer update
            event.preventDefault()
          }}>
            <MBTodo
              isCompleted={false}
              task='Create solution to update customers `isActivity` field. NOTE: update api `/api/customer/:customerId` expects complete customer data to be sent along request body' />
            <div className='d-flex flex-row gap-4 mb-3'>
              <div>
                <label htmlFor="name" className="form-label">Name</label>
                <input className="form-control" id="name" value={customer.name || ''} readOnly />
              </div>
              <div>
                <label htmlFor="name" className="form-label">Country</label>
                <input className="form-control" id="country" value={customer.country || ''} readOnly />
              </div>
              <div>
                <label htmlFor="isActive" className="form-label">Activity</label>
                <input className="form-control" id="isActive" value={customer.isActive ? 'Active' : 'Inactive'} />
              </div>
            </div>
            <button className='btn btn-primary' type='submit'>Set {!customer.isActive ? 'Active' : 'Inactive'}</button>
          </form>
          <div>
            <p className='fw-bold'>Customer contacts</p>
            <MBTodo
              isCompleted={false}
              task='Continue CustomerContact table implementation' />
            <CustomerContactTable customerContacts={customer.contacts} customerId={customerId} />
          </div>
        </div>
        : null
      }
    </div>
  )
}

export const Contacts = () => {
  const { data: contacts, status, error, refetch } = useContacts()
  return (
    <div className='m-5'>
      <h1 className='fw-bold'>Contacts</h1>
      <button className='btn btn-success' onClick={refetch}>
        <i className="bi bi-arrow-clockwise" />
        {' '}
        Refresh
      </button>
      {error
        ? <div className="alert alert-danger d-inline-block" role="alert">{error.message}</div>
        : null
      }
      <div>
        {status === 'pending'
          ? 'Loading...'
          : <ContactTable contacts={contacts} />
        }
      </div>
    </div>
  )
}
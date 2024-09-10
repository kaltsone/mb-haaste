import { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useDispatch } from 'react-redux';
import { useContacts } from './hooks';
import { createCustomerContact, deleteCustomerContact } from './customerSlices';

const Table = ({ customerContacts, customerId }) => {
  const dispatch = useDispatch();
  const [addingItem, setAddingItem] = useState(false);
  const { data: allContacts } = useContacts()
  // MB-TODO: Implement fetch customer's contacts
  // MB-TODO: Implement add contact to customer
  // MB-TODO: Implement remove contact of customer
  const addContact = (contactData) => {
    dispatch(createCustomerContact({ id: customerId, data: contactData }))
  }

  const deleteContact = (contactId) => {
    dispatch(deleteCustomerContact({ id: customerId, contactId: contactId }))
  }

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {customerContacts && customerContacts.map((customerContact, index) => {
          return (
            <tr key={index}>
              <td scope="row">{index + 1}</td>
              <td>{customerContact.firstName} {customerContact.lastName}</td>
              <td>
                <button
                  className='btn btn-danger'
                  onClick={() => deleteContact(customerContact.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        })}
        <tr key={'add-row'}>
          {!addingItem ? <>
            <td scope="row"></td>
            <td>
              <button className='btn btn-outline-primary' onClick={() => setAddingItem(true)}>
                <i className="bi bi-plus" />
                {' '}
                Add new contact
              </button>
            </td>
            <td></td>
          </>
            : <> <td></td>
              <td>
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Select from existing
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {allContacts.map((contact, index) => {
                      return (
                        <li><a className="dropdown-item" onClick={() => addContact(contact)}>{contact.firstName} {contact.lastName}</a></li>
                      )
                    })}
                  </ul>
                  {/* TODO: Add a possibility to manually create a new contact, which is then added to customer's contacts */}
                </div>
              </td>
            </>
          }
        </tr>
      </tbody>
    </table>
  )
}

Table.propTypes = {
  customerId: PropTypes.number.isRequired,
  customerContacts: PropTypes.array.isRequired
}


export default Table
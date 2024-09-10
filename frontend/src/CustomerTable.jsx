import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';
import MBTodo from './MBTodo';

const Table = ({ customers }) => {
  const navigate = useNavigate();
  const [filterActive, setFilterActive] = useState(null);

  const clicker = (customer) => {
    navigate(customer.id);
  }

  const toggleFilter = () => {
    setFilterActive(previousState => {
      if (previousState === null) return true;
      if (previousState === true) return false;
      return null;
    })
  }

  const filteredCustomers = customers.filter(customer => {
    if (filterActive === null) return customer;
    return customer.isActive === filterActive;
  })

  return (
    <>
      <div className='card my-3'>
        <div className='card-body'>
          <i className="bi bi-filter" />
          {' '}
          Filters
          <div>
            <MBTodo isCompleted={true} task='Create solution to filters customers by activity' />
          </div>
        </div>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Country</th>
            <th scope="col" type='button' onClick={() => toggleFilter()}>
              <i class="bi bi-funnel"></i>
              {' '}
              Is Active
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => {
            return (
              <tr
                key={index}
                className=''
                onClick={() => clicker(customer)}
              >
                <tr scope="row">{index + 1}</tr>
                <td>{customer.name}</td>
                <td>{customer.country}</td>
                <td>{customer.isActive ? '✅' : '❌'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

Table.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    country: PropTypes.string,
    isActive: PropTypes.bool
  }))
}


export default Table
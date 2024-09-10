import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCustomerById, fetchCustomers, fetchCustomerContacts } from './customerSlices'
import { fetchContacts } from './contactSlices'

export const useCustomers = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchCustomers())
    }, [dispatch])
    const refetch = () => dispatch(fetchCustomers())
    const { data, status, error } = useSelector(state => state.customers)
    return { data, status, error, refetch }
}

export const useCustomer = (id) => {
    const dispatch = useDispatch()
    useEffect(() => {
        if (id) {
            dispatch(fetchCustomerById(id)).then(() => dispatch(fetchCustomerContacts(id)));
        }
    }, [id, dispatch])
    const { single: customer, status, error } = useSelector(state => state.customers)
    return { customer, status, error }
}

export const useContacts = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchContacts())
    }, [dispatch])
    const refetch = () => dispatch(fetchContacts())
    const { data, status, error } = useSelector(state => state.contacts)
    return { data, status, error, refetch }
}
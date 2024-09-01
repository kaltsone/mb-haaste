import express from 'express';
import { Contacts, CustomerContacts, Customers } from './models.js';
import { NotFound, NotImplemented, NotAllowed } from './errorHandler.js';

const routes = express.Router()

routes.get('/ping', (_req, res) => {
  return res.send({ message: 'pong' })
})

// Customers
routes.get('/api/customers', async (_req, res) => {
  const customers = await Customers.getAll()
  return res.send(customers)
})

routes.get('/api/customers/:customerId', async (req, res) => {
  const { customerId } = req.params
  const customer = await Customers.get(customerId)
  if (!customer) {
    throw new NotFound('Customer Not Found')
  }
  return res.send(customer)
})

routes.post('/api/customers', async (req, res) => {
  const customers = await Customers.add(req.body)
  return res.send(customers)
})

// MB-TODO: Create route for updating customer
routes.put('/api/customers/:customerId', async (req, res) => {
  const { customerId } = req.params
  // Check if Customer exists
  const customer = await Customers.get(customerId)
  if (!customer) {
    throw new NotFound('Customer Not Found')
  }
  if ("id" in req.body && req.body.id !== customer.id) {
    throw new NotAllowed('Updating customer ID is not allowed')
  }
  const customers = Customers.update(customer.id, req.body)
  return res.send(customers)
})

// Contacts
routes.get('/api/contacts', async (_req, res) => {
  const contacts = await Contacts.getAll()
  return res.send(contacts)
})

routes.get('/api/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params
  const contact = await Contacts.get(contactId)
  if (!contact) {
    throw new NotFound('Contact not found')
  }
  return res.send(contact)
})

routes.post('/api/contacts', async (req, res) => {
  const contacts = await Contacts.add(req.body)
  return res.send(contacts)
})

/**
 *  MB-TODO: Let's assume application uses relation database (like PostgreSQL). The database has following tables:
 *  - customer (customer_id SERIAL PRIMARY KEY, name TEXT NOT NULL, country TEXT, is_active BOOLEAN)
 *  - contact (contact_id SERIAL PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL)
 *  - customer_contact (customer_id REFERENCES customer, contact_id REFERENCES contact, PRIMARY KEY(customer_id, contact_id))
*/

// MB-TODO: Write a SQL query in comment how to fetch a contacts of customer using provided database pseudo schema
// MB-TODO: Create route for fetching contacts of a customer `/api/customers/:customerId/contacts`
routes.get('/api/customers/:customerId/contacts', async (req, res) => {
  /** SELECT cn.contact_id, cn.first_name, cn.last_name
   * FROM contact cn
   * JOIN customer_contact cc ON cn.contact_id = cc.contact_id
   * WHERE cc.customer_id = 123
   */
  const { customerId } = req.params
  const customerContacts = await CustomerContacts.getAll(customerId)
  if (!customerContacts) {
    throw new NotFound(`No customer contacts found for ${customerId}`)
  }
  const contacts = customerContacts.map((c) => Contacts.get(c.contactId))
  return res.send(contacts)
})

// MB-TODO: Write a SQL query in comment how to upsert a contacts to a customer using provided database pseudo schema
// MB-TODO: Create route for adding contact to a customer `/api/customers/:customerId/contacts`
routes.post('/api/customers/:customerId/contacts', async (req, res) => {
  /**
   * MERGE INTO contact as Target
      USING (
        SELECT contact_id, first_name, last_name
        FROM (VALUES (?, ?, ?))
        AS vals (contact_id, first_name, last_name)
        ) AS Source
        ON (source.contact_id = Target.contact_id)
        WHEN NOT MATCHED THEN
          INSERT (contact_id, first_name, last_name)
          VALUES (?, ?, ?)
        WHEN MATCHED THEN
          UPDATE SET
            first_name = ?,
              last_name = ?;
              
      -- Upsert data to customer_contact
      MERGE INTO customer_contact as Target
      USING (
        SELECT customer_id, contact_id
        FROM (VALUES (?, ?))
        AS vals (customer_id, contact_id)
        ) AS Source
      ON (source.contact_id = Target.contact_id)
      WHEN NOT MATCHED THEN
        INSERT (customer_id, contact_id)
        VALUES (?, ?);
          
      SELECT cn.contact_id, cn.first_name, cn.last_name
      FROM contact cn
      JOIN customer_contact cc ON cn.contact_id = cc.contact_id
      WHERE cc.customer_id = ?;

      NOTE: To improve, implement TRANSACTION to confirm each query was succesfull and the db doesn't break
   */
  const { customerId } = req.params
  const { contactId, firstName, lastName } = req.body // contactId can be null
  if (!contactId) {
    // If no contact ID given, create a new contact
    const contact = await Contacts.add({ firstName, lastName })
    // Add new contact to customer's contacts
    CustomerContacts.add(customerId, contact.id)
    return res.send(contact)
  }
  const contact = await Contacts.get(contactId)
  // Contact ID given, get it from database
  if (!contact) {
    throw new NotFound(`Contact not found with id ${contactId}`)
  }
  CustomerContacts.add(customerId, contact.id)
  return res.send(contact)
})

// MB-TODO: Write a SQL query in comment how to delete a contact of customer using provided database pseudo schema
// MB-TODO:s Create route for deleting contact of customer `/api/customers/:customerId/contacts/:contactId`
routes.delete('/api/customers/:customerId/contacts/:contactId', async (req, res) => {
  /*
  DELETE FROM customer_contact WHERE customer_id = ? AND contact_id = ?;

  SELECT cn.contact_id, cn.first_name, cn.last_name
  FROM contact cn
  JOIN customer_contact cc ON cn.contact_id = cc.contact_id
  WHERE cc.customer_id = ?;

  NOTE: To improve this query, check if any other customer has this contact, and if not, the contact can be deleted completely
  **/
  const { customerId, contactId } = req.params
  CustomerContacts.delete(customerId, contactId)
  // get customer's currect contacts and return them to client
  const customerContacts = await CustomerContacts.getAll(customerId)
  const contacts = customerContacts.map((c) => Contacts.get(c.contactId))
  return res.send(contacts)
})

export default routes

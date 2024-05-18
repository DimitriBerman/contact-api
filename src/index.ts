import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { v4 as uuid } from 'uuid';

import { Contact } from "./contact";

const app: Express = express();
const API_PORT = 4000;
const jsonParser = bodyParser.json();

app.listen(API_PORT, () => {
    console.log(`Contacts-API is listening on port ${API_PORT}`);
});

const CONTACTS_PATH = "/contacts";
const CONTACT_ID_PATH = CONTACTS_PATH + "/:id";

const contactsStore: Map<string, Contact> = new Map();

app.post(CONTACTS_PATH, jsonParser, (req: Request, res: Response) => {
    try {
        const contact: Contact = { ...req.body };

        contact.id = uuid();

        contactsStore.set(contact.id, contact);

        res.status(200).json(contact);
    }
    catch (err) {
        const error = ensureError(err)

        throw new Error(`Running POST operation failed: ${error.message}`)
    }
});

app.get(CONTACT_ID_PATH, (req: Request, res: Response) => {
    try {
        let contact: Contact | undefined = contactsStore.get(req.params.id);

        if (contact == null) {
            res.status(404).send('Contact not found');
            return;
        }

        res.status(200).json(contact);
    }
    catch (err) {
        const error = ensureError(err)

        throw new Error(`Running GET operation failed: ${error.message}`)
    }
});

app.delete(CONTACT_ID_PATH, (req: Request, res: Response) => {
    try {
        let contact: Contact | undefined = contactsStore.get(req.params.id);

        if (contact == null) {
            res.status(404).send('Contact not found');
            return;
        }

        contactsStore.delete(req.params.id);

        res.status(204).send();
    }
    catch (err) {
        const error = ensureError(err)

        throw new Error(`Running DELETE operation failed: ${error.message}`)
    }
});

app.put(CONTACT_ID_PATH, jsonParser, (req: Request, res: Response) => {
    try {
        let storedContact: Contact | undefined = contactsStore.get(req.params.id);

        if (storedContact == null) {
            res.status(404).send('Contact not found');
            return;
        }

        const contact: Contact | undefined = { ...req.body };

        storedContact!.name = contact!.name;
        storedContact!.email = contact!.email;

        contactsStore.set(storedContact!.id, storedContact!);

        res.status(200).json(storedContact);
    }
    catch (err) {
        const error = ensureError(err)

        throw new Error(`Running PUT operation failed: ${error.message}`)
    }
});

function ensureError(value: unknown): Error {
    if (value instanceof Error) return value

    let stringified = '[Unable to stringify the thrown value]'
    try {
        stringified = JSON.stringify(value)
    } catch { }

    const error = new Error(`This value was thrown as is, not through an Error: ${stringified}`)
    return error
}
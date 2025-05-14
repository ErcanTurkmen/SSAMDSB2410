import { v4 as uuidv4 } from 'uuid';
const BYTE_LENGTH = 20;

/**
 * 
 * @returns {string}
 */
export default function FormGuidCreate() {
    // IDs for SDF are 40 hex characters long (160 bits, 20 bytes)
    // TODO: use a proper rng for this
    return (uuidv4() + uuidv4()).replace(/\-/g,'').substring(0,BYTE_LENGTH * 2);
}

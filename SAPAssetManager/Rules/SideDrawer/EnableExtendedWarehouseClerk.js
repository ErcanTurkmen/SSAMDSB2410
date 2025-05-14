import personalLib from '../Persona/PersonaLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function EnableExtendedWarehouseClerk(context) {
    return personalLib.isExtendedWarehouseClerk(context);
}

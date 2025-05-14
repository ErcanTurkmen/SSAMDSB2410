/**
* Set transaction ignore to true if checklist has been synced already
* return true if binding is not local
* @param {IClientAPI} clientAPI
*/
export default function IgnoreIfNotLocal(context) {
	return !context.binding['@odata.readLink'].includes('lodata_sys_eid');
}

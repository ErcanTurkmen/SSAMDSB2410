import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnDemandObjectType(context) {
    return libCom.getStateVariable(context, 'ObjectType');
}

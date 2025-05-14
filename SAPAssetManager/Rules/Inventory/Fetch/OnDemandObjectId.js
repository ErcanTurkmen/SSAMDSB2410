import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnDemandObjectId(context) {
    return libCom.getStateVariable(context, 'ObjectId');
}

import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnDemandObjectAction(context) {
    return libCom.getStateVariable(context, 'Action');
}

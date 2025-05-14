/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import GetResource from '../Resource/GetResource';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
export default function SetFetchText(context) {
    return GetResource(context).then((resource) => {
        libCom.setStateVariable(context, 'EWMResource', resource);
        return context.localizeText(libVal.evalIsEmpty(resource) ? 'download' : 'assign');
    });
}

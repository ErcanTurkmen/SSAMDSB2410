import ODataDate from '../../../Common/Date/ODataDate';
/**
* @param {IClientAPI} clientAPI
*/
export default function ContainerDescription(clientAPI) {
    const dispatchDate = clientAPI.binding?.DispatchDate;
    return dispatchDate ? clientAPI.localizeText('dispatch_date_x' ,[clientAPI.formatDate(new ODataDate(dispatchDate).date())]) : '';
}

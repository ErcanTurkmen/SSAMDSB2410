import ODataDate from '../../Common/Date/ODataDate';
 
export default function PackageDescription(clientAPI) {
    const dispatchDate = clientAPI.binding?.DispatchDate;
    return dispatchDate ? clientAPI.localizeText('dispatch_date_x',[clientAPI.formatDate(new ODataDate(dispatchDate).date())]) : '';
}

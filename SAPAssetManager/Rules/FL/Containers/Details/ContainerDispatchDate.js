import ODataDate from '../../../Common/Date/ODataDate';

export default function ContainerDispatchDate(clientAPI) {
    const dispatchDate = clientAPI.binding?.DispatchDate;
    return dispatchDate ? clientAPI.formatDate(new ODataDate(dispatchDate).date()) : '';
}

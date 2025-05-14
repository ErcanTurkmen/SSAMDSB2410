import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderCreateUpdateIsCancelButtonVisible(clientAPI) {
    return !libCommon.isOnWOChangeset(clientAPI);
}

import libCom from '../Common/Library/CommonLibrary';

export default function OnlineClassificationListViewNav(context) {
    libCom.setStateVariable(context, 'CurrentOnlineObjectDataType', context.binding['@odata.type']);
    return context.executeAction('/SAPAssetManager/Actions/Classification/OnlineClassificationListViewNav.action');
}

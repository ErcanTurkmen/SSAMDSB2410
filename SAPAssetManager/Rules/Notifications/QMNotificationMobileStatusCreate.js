import common from '../Common/Library/CommonLibrary';
import { GlobalVar } from '../Common/Library/GlobalCommon';
import GenerateLocalID from '../Common/GenerateLocalID';
import ODataDate from '../Common/Date/ODataDate';
import DocLib from '../Documents/DocumentLibrary';
/**
* Create Mobile Status for QM notification and clear changeset flags
* @param {IClientAPI} context
*/
export default function QMNotificationMobileStatusCreate(context) {
    const RECEIVED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const OBJECTTYPE = GlobalVar.getAppParam().OBJECTTYPE.Notification;
    return GenerateLocalID(context, 'PMMobileStatuses', 'ObjectKey', '000000', "$filter=startswith(ObjectKey, 'LOCAL') eq true", 'LOCAL_MS', 'ObjectKey').then(ObjectKey => {
        const odataDate = new ODataDate();
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Notifications/QMNotificationMobileStatusCreate.action', 'Properties': {
            'Properties':
            {
                'NotifNum': context.binding.LocalNotificationID,
                'MobileStatus': RECEIVED,
                'ObjectType': OBJECTTYPE,
                'ObjectKey': ObjectKey,
                'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
            },
            'CreateLinks': [{
                'Property': 'NotifHeader_Nav',
                'Target': {
                    'EntitySet' : 'MyNotificationHeaders',
                    'ReadLink': `MyNotificationHeaders('${context.binding.LocalNotificationID}')`,
                },
            }],
        }}).then(() => {
            let descriptionCtrl = context.getControl('FormCellContainer').getControl('AttachmentDescription').getValue();
            let attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment').getClientData().AddedAttachments;
            common.setStateVariable(context, 'DocDescription', descriptionCtrl);
            common.setStateVariable(context, 'Doc', attachmentCtrl);
            common.setStateVariable(context, 'ObjectKey', 'NotificationNumber');
            common.setStateVariable(context, 'entitySet', 'MyNotifDocuments');
            common.setStateVariable(context, 'parentEntitySet', 'MyNotificationHeaders');
            common.setStateVariable(context, 'parentProperty', 'NotifHeader');
            common.setStateVariable(context, 'attachmentCount', DocLib.validationAttachmentCount(context));
            common.setStateVariable(context, 'Class', common.getStateVariable(context, 'NotificationCategory'));
            common.setOnChangesetFlag(context, false);
            return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/QMNotificationSuccess.action');
        });
    });

}

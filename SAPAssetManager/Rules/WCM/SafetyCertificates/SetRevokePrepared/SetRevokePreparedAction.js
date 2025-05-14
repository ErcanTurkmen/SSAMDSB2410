import ODataDate from '../../../Common/Date/ODataDate';
import AppVersionInfo from '../../../UserProfile/AppVersionInfo';
import { SafetyCertificateEventTypes } from '../Details/SafetyCertificatesOnCustomEventDataReceived';
import { WCMCertificateMobileStatuses, WCMDocumentHeaderMobileStatusType } from '../SafetyCertificatesLibrary';


/** @param {IClientAPI & {binding: WCMDocumentHeader}} context  */
export default function SetRevokePreparedAction(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=PMMobileStatus')
        .then(result => result.getItem(0))
        .then((/** @type {WCMDocumentHeader} */ cert) => {
            const newMobileStatus = {
                [WCMCertificateMobileStatuses.Prepared]: WCMCertificateMobileStatuses.Change,
                [WCMCertificateMobileStatuses.Tag]: WCMCertificateMobileStatuses.Change,
                [WCMCertificateMobileStatuses.Tagprint]: WCMCertificateMobileStatuses.Change,
                [WCMCertificateMobileStatuses.Tagged]: WCMCertificateMobileStatuses.Change,
                [WCMCertificateMobileStatuses.Change]: WCMCertificateMobileStatuses.Prepared,
            }[cert.PMMobileStatus.MobileStatus] || '';
            if (newMobileStatus) {
                return SetCertificateMobileStatus(context, cert, newMobileStatus)
                    .then(() => context.getPageProxy().executeCustomEvent(SafetyCertificateEventTypes.MobileStatusChanged));  // certificate details page
            }
            return Promise.resolve();
        });
}

/**
 * @param {WCMDocumentHeader} certificate
 * @param {IClientAPI} context
 * @param {string} newStatus   */
export function SetCertificateMobileStatus(context, certificate, newStatus) {
    return AddCurrentMobileStatusToHistory(context, certificate)
        .then(() => SetCurrentMobileStatus(context, certificate, newStatus, WCMDocumentHeaderMobileStatusType));
}

/**
 * @param {WCMDocumentHeader | WCMDocumentItem} entity
 * @param {IClientAPI} context
 * @param {string} newStatus   */
export function SetCurrentMobileStatus(context, entity, newStatus, mobileStatusObjectType) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=ObjectType eq '${mobileStatusObjectType}' and MobileStatus eq '${newStatus}'`)
        .then((/** @type {ObservableArray<EAMOverallStatusConfig>} */ eamstatus) => context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'ReadLink': entity.PMMobileStatus['@odata.readLink'],
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                },
                'Properties': {
                    'MobileStatus': newStatus,
                    'Status': eamstatus.getItem(0).Status,
                    'EffectiveTimestamp': new ODataDate().toDBDateTimeString(context),
                },
                'RequestOptions': {
                    'RemoveCreatedEntityAfterUpload': true,
                    'TransactionID': entity.WCMDocument,
                    'UnmodifiableRequest': true,
                },
                'Headers': {
                    'transaction.omdo_id': `SAM${AppVersionInfo(context).split('.')[0]}_WCM_MOBILE_STATUS`,
                },
                'UpdateLinks': [
                    {
                        'Property': 'OverallStatusCfg_Nav',
                        'Target': {
                            'EntitySet': 'EAMOverallStatusConfigs',
                            'QueryOptions': `$filter=ObjectType eq '${mobileStatusObjectType}' and MobileStatus eq '${newStatus}'`,
                        },
                    },
                ],
            },
        }));
}

/** this is just for local show, after delta sync the here created item will be ignored
 * @param {WCMDocumentHeader | WCMDocumentItem} certificate
 * @param {IClientAPI} context */
export function AddCurrentMobileStatusToHistory(context, certificate) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target': {
                'EntitySet': 'PMMobileStatusHistories',
            },
            'Properties': {
                'MobileStatus': certificate.PMMobileStatus.MobileStatus,
                'EffectiveTimestamp': certificate.PMMobileStatus.EffectiveTimestamp,
                'ObjectKey': certificate.PMMobileStatus.ObjectKey,
            },
            'CreateLinks': [{
                'Property': 'PMMobileStatus_Nav',
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'ReadLink': certificate.PMMobileStatus['@odata.readLink'],
                },
            }],
            'RequestOptions': {
                'RemoveCreatedEntityAfterUpload': true,
                'TransactionID': certificate.WCMDocument,
            },
        },
    });
}

import libMeter from '../../Meter/Common/MeterLibrary';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import MetersListViewOnReturn from '../../WorkOrders/Meter/MetersListViewOnReturn';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';

export default function DisconnectAllMeters(context) {
    let helper = new FDCSectionHelper(context);
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);
    const { DISCONNECT } = MeterSectionLibrary.getMeterISOConstants(context);

    const isDisconnect = libMeter.getISUProcess(woBinding.OrderISULinks) === DISCONNECT;

    return validateAllMetersData(helper, isDisconnect).then(() => {
        return helper.run((sectionBinding, section) => {
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
                'Target':
                {
                    'EntitySet': 'Devices',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': sectionBinding.Device_Nav['@odata.readLink'],
                },
                'Properties':
                {
                    'DeviceBlocked' : isDisconnect,
                },
                'Headers':
                {
                    'Transaction.Ignore': 'true',
                },
            }}).then(() => context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
                'Target':
                {
                    'EntitySet': 'DisconnectionObjects',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': sectionBinding['@odata.readLink'],
                },
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                },
                'Properties':
                {
                    'ActivityDate': '/SAPAssetManager/Rules/Meter/DisconnectReconnect/ActivityDate.js',
                    'ActivityTime': '/SAPAssetManager/Rules/Meter/DisconnectReconnect/ActivityTime.js',
                    'DisconnectType': isDisconnect ? section.getControl('TypeLstPkr').getValue()[0].ReturnValue : '',
                },
                'Headers':
                {
                    'OfflineOData.TransactionID': String(sectionBinding.ActivityNum) + String(sectionBinding.DocNum),
                },
            }}));
        }).then(() => MetersListViewOnReturn(context));
    });
}

async function validateAllMetersData(helper, isDisconnect) {
    let isValid = true;
    
    // eslint-disable-next-line no-unused-vars
    await helper.run((sectionBinding, section) => {
        if (isDisconnect) {
            const statusControl = section.getControl('TypeLstPkr');
            const status = CommonLibrary.getControlValue(statusControl);
            if (status) {
                statusControl.clearValidation();
            } else {
                const message = section.localizeText('field_is_required');
                CommonLibrary.executeInlineControlError(section, statusControl, message);
                isValid = false;
            }
        }
    });

    return isValid ? Promise.resolve() : Promise.reject();
}

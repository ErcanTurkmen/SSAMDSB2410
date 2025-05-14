import CommonLibrary from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import Logger from '../../Log/Logger';

export default async function ConnectionObjectOnValueChange(control) {
    ResetValidationOnInput(control);

    const pageProxy = control.getPageProxy();
    const deviceLocationControl = CommonLibrary.getControlProxy(pageProxy, 'DeviceLocationLstPkr'); 
    const premiseControl = CommonLibrary.getControlProxy(pageProxy, 'PremiseLstPkr'); 
    
    deviceLocationControl.setValue('');
    premiseControl.setValue('');

    const connectionValue = CommonLibrary.getControlValue(control);
    if (connectionValue) {
        const connectionData = await getConnectionDataWithDeviceLocation(pageProxy, connectionValue);
        const locationData = connectionData?.DeviceLocations_Nav?.[0];
       
        if (connectionData['@odata.readLink']) {
            const deviceLocationControlTarget = deviceLocationControl.getTargetSpecifier();
            deviceLocationControlTarget.setEntitySet(connectionData['@odata.readLink'] + '/DeviceLocations_Nav');
            deviceLocationControl.setTargetSpecifier(deviceLocationControlTarget);

            const premiseControlTarget = premiseControl.getTargetSpecifier();
            premiseControlTarget.setEntitySet(connectionData['@odata.readLink'] + '/Premises_Nav');
            premiseControl.setTargetSpecifier(premiseControlTarget);
        }
        
        if (locationData) {
            deviceLocationControl.setValue(locationData.DeviceLocation);
            premiseControl.setValue(locationData.Premise);
        }
    }
}

function getConnectionDataWithDeviceLocation(pageProxy, connectionValue) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `ConnectionObjects('${connectionValue}')`, [], '$expand=DeviceLocations_Nav')
        .then(result => {
            return result.getItem(0) || {};
        })
        .catch((error) => {
            Logger.error('getConnectionDataWithDeviceLocation', error);
            return {};
        });
}

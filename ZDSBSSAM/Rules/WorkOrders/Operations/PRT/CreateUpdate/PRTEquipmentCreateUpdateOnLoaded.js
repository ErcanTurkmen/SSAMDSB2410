
import style from '../../../../../../SAPAssetManager/Rules/Common/Style/StyleFormCellButton';
import libCommon from '../../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ODataLibrary from '../../../../../../SAPAssetManager/Rules/OData/ODataLibrary';
import CheckForConnectivity from '../../../../../../SAPAssetManager/Rules/Common/CheckForConnectivity';

export default async function PRTEquipmentCreateUpdateOnLoaded(pageClientAPI) {
    style(pageClientAPI, 'DiscardButton');
    let formCellContainer = pageClientAPI.getControl('FormCellContainer');
    let serialNumber = formCellContainer.getControl('SerialNumber');
    if (!libCommon.IsOnCreate(pageClientAPI)) {
        let serialPartNumber = '-';
        let entitySet = pageClientAPI.binding.PRTEquipment['@odata.editLink'] + '/SerialNumber';
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '').then(function (result) {
            if (result.getItem(0)) {
                serialPartNumber = result.getItem(0).SerialNumber;
            }
            return (serialNumber.setValue(serialPartNumber)).then(() => {
                libCommon.saveInitialValues(pageClientAPI);
                return Promise.resolve(true);
            });
        }).catch(() => {
            return (serialNumber.setValue(serialPartNumber)).then(() => {
                libCommon.saveInitialValues(pageClientAPI);
                return Promise.resolve(true);
            });
        });
    }
    libCommon.saveInitialValues(pageClientAPI);
    //DSB changes as part of upgrade 2410 to always use Online Equipment search
    let equipmentListPicker = pageClientAPI.evaluateTargetPath('#Control:EquipmentLstPkr');
    let equipmentLstPkrSpecifier = pageClientAPI.getPageProxy().evaluateTargetPathForAPI('#Control:EquipmentLstPkr').getTargetSpecifier();
    equipmentListPicker.setValue('');
    if (!pageClientAPI.isDemoMode() && CheckForConnectivity(pageClientAPI)) {
        await equipmentListPicker.executeAction('/SAPAssetManager/Actions/Parts/PartsOnlineSearchIndicator.action').then(function () {
            equipmentLstPkrSpecifier.setObjectCell({
                'PreserveIconStackSpacing': false,
                'Title': '{{#Property:EquipDesc}} - {{#Property:EquipId}}',
                'Subhead': '/SAPAssetManager/Rules/Equipment/EquipmentListViewFormat.js',
                'Footnote': '{{#Property:SerialNumber/#Property:SerialNumber}}',
            });
            equipmentLstPkrSpecifier.setEntitySet('Equipments');
            equipmentLstPkrSpecifier.setReturnValue('EquipId');
            equipmentLstPkrSpecifier.setService('/SAPAssetManager/Services/OnlineAssetManager.service');
            return Promise.resolve(true);
        }).catch(function (err) {
            // Could not init online service
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    }
}

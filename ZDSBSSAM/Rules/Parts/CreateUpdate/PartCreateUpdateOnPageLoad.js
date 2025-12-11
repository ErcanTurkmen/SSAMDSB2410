import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import style from '../../../../SAPAssetManager/Rules/Common/Style/StyleFormCellButton';
import hideCancel from '../../../../SAPAssetManager/Rules/ErrorArchive/HideCancelForErrorArchiveFix';
import EnableMultipleTechnician from '../../../../SAPAssetManager/Rules/SideDrawer/EnableMultipleTechnician';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import UpdateOnlineQueryOptions from './UpdateOnlineQueryOptions';
import CheckForConnectivity from '../../../../SAPAssetManager/Rules/Common/CheckForConnectivity';

export default async function PartCreateUpdateOnPageLoad(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(context);
    style(context, 'DiscardButton');

    let isMultipleTechnician = EnableMultipleTechnician(context);
    const textCategory = libCom.getAppParam(context, 'PART', 'TextItemCategory');
    const partCategoryValue = context.evaluateTargetPath('#Control:PartCategoryLstPkr').getValue()[0].ReturnValue;
    const caption = context.localizeText(libCom.IsOnCreate(context) ? 'add_part' : 'edit_part');

    //DSB changes as part of upgrade 2410 to always use Online Material search
    let materialNumberField = context.evaluateTargetPath('#Control:MaterialNumber');
    let materialDescriptionField = context.evaluateTargetPath('#Control:MaterialDescription');
    let onlineSwitch = context.evaluateTargetPath('#Control:OnlineSwitch');

    context.setCaption(caption);
    //DSB changes as part of upgrade 2410 to always use Online Material search
    if (!context.isDemoMode() && CheckForConnectivity(context)) { 
        await onlineSwitch.executeAction('/SAPAssetManager/Actions/Parts/PartsOnlineSearchIndicator.action').then(function () {
            materialNumberField.setVisible(true);
            materialDescriptionField.setVisible(true);
            return UpdateOnlineQueryOptions(context);
        }).catch(function (err) {
            // Could not init online service
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            context.setValue(false);
            context.setEditable(false);
            context.getPageProxy().getClientData().Error = err;
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });

    }
    if (partCategoryValue === textCategory) {
        // Disable Stock Item pickers
        context.evaluateTargetPath('#Control:MaterialLstPkr').setVisible(false);
        context.evaluateTargetPath('#Control:MaterialUOMLstPkr').setVisible(false);
        if (!isMultipleTechnician) {
            context.evaluateTargetPath('#Control:StorageLocationLstPkr').setVisible(false);
            context.evaluateTargetPath('#Control:UOMSim').setVisible(false);

            // Enable Text Picker items
            context.evaluateTargetPath('#Control:TextItemSim').setVisible(true);
        }

    }
    libCom.saveInitialValues(context);
}

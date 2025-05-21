import Logger from '../../../../../SAPAssetManager/Rules/Log/Logger';
import UpdateOnlineQueryOptions from '../../../../../SAPAssetManager/Rules/Parts/CreateUpdate/UpdateOnlineQueryOptions';
import plantdefault from '../../../../../SAPAssetManager/Rules/Parts/CreateUpdate/PartCreateDefaultPlant';
export default function ZPartAdhocIssueOnLoaded(context) {
     //DSB customisation to pick the specific storage locations for adhoc issue.
    try {
        let plant = plantdefault(context);

        /*if (context.getValue().length > 0) {
            plant = context.getValue()[0].ReturnValue;
        }*/
          if (plant) {
            let storageLocationLstPkr = context.getPageProxy().evaluateTargetPathForAPI('#Control:StorageLocationLstPkr');
            let storageLocationLstPkrSpecifier = storageLocationLstPkr.getTargetSpecifier();
            let storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' `;
            if(plant === '6500')
            {
                 storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' and (StorageLocation eq '6504' or StorageLocation eq '6508')`;
            } 
            if(plant === '6100')
            {
                 storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' and (StorageLocation eq '6101')`;
                 storageLocationLstPkr.setValue('6101');
            }
            if(plant === '6200')
            {
                 storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' and (StorageLocation eq '6204')`;
                 storageLocationLstPkr.setValue('6204');
            }
            if(plant === '6300')
            {
                 storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' and (StorageLocation eq '6301')`;
                 storageLocationLstPkr.setValue('6301');
            }
            if(plant === '6400')
            {
                 storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' and (StorageLocation eq '6401')`;
                 storageLocationLstPkr.setValue('6401');
            }
            if(plant === '6600')
            {
                 storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' and (StorageLocation eq '6602')`;
                 storageLocationLstPkr.setValue('6602');
            }
            if(plant === '6000')
            {
                        storagelocationQueryOptions = `$orderby=StorageLocation&$filter=Plant eq '${plant}' and (StorageLocation eq '6006')`;
                        storageLocationLstPkr.setValue('6006');
            }
            
            storageLocationLstPkrSpecifier.setEntitySet('StorageLocations');
            storageLocationLstPkrSpecifier.setQueryOptions(storagelocationQueryOptions);
            storageLocationLstPkrSpecifier.setReturnValue('{StorageLocation}');
            storageLocationLstPkr.setTargetSpecifier(storageLocationLstPkrSpecifier);
            UpdateOnlineQueryOptions(context);
        }

    } catch (err) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`PartLibrary.partCreateUpdateOnChange(PlantLstPkr) error: ${err}`);
    }
}

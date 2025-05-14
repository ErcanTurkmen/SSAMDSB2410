import CommonLib from '../../Common/Library/CommonLibrary';
import ValidationLib from '../../Common/Library/ValidationLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import partLib from '../PartLibrary';
import materialNumberCrt from './PartCreateUpdateSetOdataMaterialNum';
import plantCrt from './PartCreateUpdateSetOdataPlant';
import storageLocationCrt from './PartStorageLocation';
import Logger from '../../Log/Logger';
export default function PartCreateUpdateOnCommit(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let isMultipleTechnician = EnableMultipleTechnician(context);
    let createAction;
    let pageName = CommonLib.getCurrentPageName(context);
    if (isMultipleTechnician && pageName === 'VehiclePartCreate') {
        createAction = '/SAPAssetManager/Actions/Parts/VehiclePartCreate.action';
    } else {
        createAction = '/SAPAssetManager/Actions/Parts/PartCreate.action';
    }
    let promises = [];

  
    promises.push(
        partLib.partCreateUpdateSetODataValue(context, 'OperationNo'),
        materialNumberCrt(context),
        plantCrt(context),
        storageLocationCrt(context),
    );
    
    return Promise.all(promises).then(([operationNumber, materialNumber, plant, storageLocation]) => {
       
        context.getClientData().MaterialNum = materialNumber;
        context.getClientData().Plant = plant;
        context.getClientData().StorageLocation = storageLocation;
        context.getClientData().OperationNo = operationNumber;
        let uom = CommonLib.getListPickerValue(CommonLib.getControlProxy(context,'MaterialUOMLstPkr').getValue());
        if (CommonLib.IsOnCreate(context) || (isMultipleTechnician && pageName === 'VehiclePartCreate')) {
            return context.executeAction(createAction).then(() => {
                if (materialNumber && plant && storageLocation) {
                    return partLib.materialFactory(context, materialNumber, plant, storageLocation, uom);
                }
                return Promise.resolve(true);
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`Material Factory failed: ${error}`);
                return Promise.reject(error);
            });
        } else {
            if (!ValidationLib.evalIsEmpty(operationNumber) && !ValidationLib.evalIsEmpty(context.binding.OperationNo) && operationNumber !== context.binding.OperationNo) {
                return context.executeAction(createAction).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Parts/PartDeleteOnChangedOperation.action').then(() => {
                        if (materialNumber && plant && storageLocation) {
                            return partLib.materialFactory(context, materialNumber, plant, storageLocation, uom);
                        }
                        return Promise.resolve(true);
                    });
                }).catch((error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`Material Factory failed: ${error}`);
                    return Promise.reject(error);
                });
            } else {
                return context.executeAction('/SAPAssetManager/Actions/Parts/PartUpdate.action').then(() => {
                    if (materialNumber && plant && storageLocation) {
                        return partLib.materialFactory(context, materialNumber, plant, storageLocation, uom);
                    }
                    return Promise.resolve(true);
                }).catch((error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryParts.global').getValue(),`Material Factory failed: ${error}`);
                    return Promise.reject(error);
                });
            }
        }
    });
}

import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import showSerialNumberField from '../Validation/ShowSerialNumberField';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import SpecialStockListPickerItems from './SpecialStockListPickerItems';
import libInv, { MovementTypes, ListSpecialStockMovementTypes, SpecialStock, InventoryOrderTypes, InventoryAdhoc } from '../Common/Library/InventoryLibrary';
import GetMovementTypeData from '../GetMovementTypeData';
/** @param {IListPickerFormCellProxy} context */
export default async function OnMovementTypeValueChanged(context) {
    ResetValidationOnInput(context);

    const selectedMovementType = libInv.GetListPickerSelection(context);
    if (!selectedMovementType) {
        return Promise.resolve();
    }

    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    const specialStockIndicatorPicker = formcellContainer.getControl('SpecialStockIndicatorPicker');
    const specialStockInd = libInv.GetListPickerSelection(specialStockIndicatorPicker);

    const [glAccountSimple, costCenterSimple, wbsElementSimple, orderSimple, networkSimple,
        activitySimple, salesOrderSimple, salesOrderItemSimple, businessAreaSimple] = [
            'GLAccountSimple', 'CostCenterSimple', 'WBSElementSimple', 'OrderSimple', 'NetworkSimple',
            'ActivitySimple', 'SalesOrderSimple', 'SalesOrderItemSimple', 'BusinessAreaSimple'].map(n => formcellContainer.getControl(n));
    const [movementReason, goodsRecepient, unloadingPoint, openQuantity, addSerialNumber, stockType, vendorListPicker, uOMSimple] = [
        'MovementReasonPicker', 'GoodsRecipientSimple', 'UnloadingPointSimple', 'QuantitySimple', 'SerialPageNav', 'StockTypePicker', 'VendorListPicker', 'UOMSimple'].map(n => formcellContainer.getControl(n));

    // check if movement type is displayed, if not, then do not display special stock indicator
    const movementTypePicker = formcellContainer.getControl('MovementTypePicker');
    const objectType = common.getStateVariable(context, 'IMObjectType');
    if (movementTypePicker && movementTypePicker.getVisible() && ListSpecialStockMovementTypes.includes(selectedMovementType)) {
        let specialStockIndicatorPickerItems = await SpecialStockListPickerItems(context, selectedMovementType);
        specialStockIndicatorPicker.setPickerItems(specialStockIndicatorPickerItems);
        specialStockIndicatorPicker.setVisible(!ValidationLibrary.evalIsEmpty(specialStockIndicatorPickerItems));
        // if movementType = 231 and SSI is blank and the context has not be previously set, then set to 'E'
        if (selectedMovementType === MovementTypes.t231 && ValidationLibrary.evalIsEmpty(specialStockInd) && ValidationLibrary.evalIsEmpty(context?.binding?.SpecialStockInd)) {
            specialStockIndicatorPicker.setValue(SpecialStock.OrdersOnHand);
        }
        if (([MovementTypes.t202, MovementTypes.t222, MovementTypes.t232, MovementTypes.t262, MovementTypes.t282].includes(selectedMovementType) && objectType === InventoryOrderTypes.REV)) {
            specialStockIndicatorPicker.setEditable(false);
        }
    } else {
        specialStockIndicatorPicker.setVisible(false);
    }

    const accountAssignmentSection = [glAccountSimple, costCenterSimple, orderSimple, networkSimple, activitySimple, salesOrderSimple, salesOrderItemSimple, wbsElementSimple, businessAreaSimple];
    const move = common.getStateVariable(context, 'IMMovementType');
    const mandatoryControlCaptions = [];

    const storageLocationPicker = formcellContainer.getControl('StorageLocationPicker');
    // boolean used for when StorageLocation needs to be hidden if Material is free-text or non-stock
    const isStorageLocationVisible = storageLocationPicker.visible;

    const storageLocationToListPicker = formcellContainer.getControl('StorageLocationToListPicker');
    manageStorageLocationToListPicker(storageLocationToListPicker, selectedMovementType);

    let isOpenQuantity, isOpenQuantityBlocked, isOpenQtyValBlocked;
    if (context.binding) {
        isOpenQuantity = !isNaN(context.binding.OpenQuantity);
        isOpenQuantityBlocked = !isNaN(context.binding.OpenQuantityBlocked);
        isOpenQtyValBlocked = !isNaN(context.binding.OpenQtyValBlocked);
    }

    if (selectedMovementType === MovementTypes.t101) {
        if (isOpenQuantity) {
            openQuantity.setValue(Number(context.binding.OpenQuantity));
        }
        // added CostCenter visible field because when navigating from PO BulkUpdate Receive Item,
        // the CostCenter was not displayed. ICMTANGOAMF10-31849.
        costCenterSimple.setVisible(true);
        // originally set to true, but now need to check if override to hide based on Material type
        storageLocationPicker.setVisible(isStorageLocationVisible);
    } else if (selectedMovementType === MovementTypes.t103 || selectedMovementType === MovementTypes.t107) {
        if (isOpenQuantity) {
            openQuantity.setValue(Number(context.binding.OpenQuantity));
        }
        storageLocationPicker.setVisible(false);
        storageLocationPicker.setValue('');
    } else if ([MovementTypes.t104, MovementTypes.t124].includes(selectedMovementType)) {
        if (isOpenQuantityBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQuantityBlocked));
        }
        storageLocationPicker.setVisible(false);
    } else if (selectedMovementType === MovementTypes.t108) {
        if (isOpenQtyValBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQtyValBlocked));
        }
        storageLocationPicker.setVisible(false);
    } else if (selectedMovementType === MovementTypes.t105 || selectedMovementType === MovementTypes.t106) {
        if (isOpenQuantityBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQuantityBlocked));
        }
        // originally set to true, but now need to check if override to hide based on Material type
        storageLocationPicker.setVisible(isStorageLocationVisible);
    } else if (selectedMovementType === MovementTypes.t109 || selectedMovementType === MovementTypes.t110) {
        if (isOpenQtyValBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQtyValBlocked));
        }
        // originally set to true, but now need to check if override to hide based on Material type
        storageLocationPicker.setVisible(isStorageLocationVisible);
    } else if ([MovementTypes.t201, MovementTypes.t202, MovementTypes.t553, MovementTypes.t555].includes(selectedMovementType)) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, costCenterSimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === InventoryOrderTypes.RES || objectType === InventoryOrderTypes.PRD) {
            glAccountSimple.setEditable(false);
            costCenterSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            costCenterSimple.setEditable(true);
        }
    } else if ([MovementTypes.t221, MovementTypes.t222].includes(selectedMovementType)) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, wbsElementSimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === InventoryOrderTypes.RES || objectType === InventoryOrderTypes.PRD) {
            glAccountSimple.setEditable(false);
            wbsElementSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            wbsElementSimple.setEditable(true);
        }
    } else if ([MovementTypes.t261, MovementTypes.t262].includes(selectedMovementType)) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, costCenterSimple, orderSimple, activitySimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === InventoryOrderTypes.RES || objectType === InventoryOrderTypes.PRD) {
            glAccountSimple.setEditable(false);
            costCenterSimple.setEditable(false);
            orderSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            costCenterSimple.setEditable(true);
            orderSimple.setEditable(true);
        }

        if (context?.binding?.SpecialStockInd) {
            setSalesOrWBSfields(context.binding.SpecialStockInd, salesOrderSimple, salesOrderItemSimple, wbsElementSimple);
        }
    } else if ([MovementTypes.t281, MovementTypes.t282].includes(selectedMovementType)) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, activitySimple, networkSimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === 'RES' || (objectType === 'PRD' && move === 'I')) {
            glAccountSimple.setEditable(false);
            networkSimple.setEditable(false);
            activitySimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            networkSimple.setEditable(true);
            activitySimple.setEditable(true);
        }
        if (context?.binding?.SpecialStockInd) {
            setSalesOrWBSfields(context.binding.SpecialStockInd, salesOrderSimple, salesOrderItemSimple, wbsElementSimple);
        }
    } else if ([MovementTypes.t301, MovementTypes.t303, MovementTypes.t305, MovementTypes.t311, MovementTypes.t313, MovementTypes.t315, MovementTypes.t321, MovementTypes.t322, MovementTypes.t343, MovementTypes.t411].includes(selectedMovementType)) {
        let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
        let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
        let plantToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');

        if ([MovementTypes.t301, MovementTypes.t303, MovementTypes.t305, MovementTypes.t311, MovementTypes.t313, MovementTypes.t315, MovementTypes.t411].some(t => t === selectedMovementType)) {
            mandatoryControlCaptions.push({ Control: plant, isMandatory: true });
            mandatoryControlCaptions.push({ Control: plantToListPicker, isMandatory: true });
            mandatoryControlCaptions.push({ Control: storageLocationPicker, isMandatory: true });
            mandatoryControlCaptions.push({ Control: storageLocationToListPicker, isMandatory: MovementTypes.t303 !== selectedMovementType });
        }

        accountAssignmentSection.forEach(c => c.setVisible(false));

        // Need to check if MovementType = 301, 311, 321, 322 and Special Stock Indicator Q or E, then
        // need to make Sales Order, Sales Order Item or WBS Element visible.
        if ([MovementTypes.t301, MovementTypes.t311, MovementTypes.t321, MovementTypes.t322, MovementTypes.t411].includes(selectedMovementType) && context?.binding?.SpecialStockInd) {
            setSalesOrWBSfields(context.binding.SpecialStockInd, salesOrderSimple, salesOrderItemSimple, wbsElementSimple);
        }

        if ([MovementTypes.t321, MovementTypes.t322, MovementTypes.t343].includes(selectedMovementType)) {
            goodsRecepient.setVisible(false);
            stockType.setVisible(false);
        } else {
            goodsRecepient.setVisible(true);
            stockType.setVisible(true);
        }
        if ([MovementTypes.t411].includes(selectedMovementType) && context?.binding?.SpecialStockInd && context?.binding?.SpecialStockInd === SpecialStock.OrdersOnHand) {
            costCenterSimple.setVisible(true);
            costCenterSimple.setEditable(true);
        }

        movementReason.setVisible(false);
        movementReason.setValue('');

        let plantValue = '';
        let storageLocationValue = '';
        let binding = context.binding;
        if (common.getPreviousPageName(context) !== 'StockDetailsPage') {
            if (matrialListPicker.getValue() && matrialListPicker.getValue().length > 0) {
                plantValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).Plant;
                storageLocationValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).StorageLocation;
            } else if (plant.getValue().length > 0) {
                plantValue = plant.getValue()[0].ReturnValue;
                if (storageLocationPicker.getValue().length > 0) {
                    storageLocationValue = storageLocationPicker.getValue()[0].ReturnValue;
                }
            }
        } else {
            plantValue = binding.Plant;
            storageLocationValue = binding.StorageLocation;
        }

        let plantToFilter = '';
        let storageLocationToFilter = '';
        let plantToEditable = true;
        let storgeLocationToResetValue = true;

        if (plantValue) {
            if (MovementTypes.t301 === selectedMovementType) {
                plantToFilter = `$filter=Plant ne '${plantValue}'&$orderby=Plant`;
                storgeLocationToResetValue = false;
            } else if (MovementTypes.t303 === selectedMovementType) {
                plantToFilter = `$filter=Plant ne '${plantValue}'&$orderby=Plant`;
                // plant to plant move
                if (storageLocationValue) {
                    storageLocationToFilter = `$filter=Plant eq '${plantValue}''`;
                    storgeLocationToResetValue = false;
                }
            } else if (MovementTypes.t305 === selectedMovementType) {
                plantToFilter = `$filter=Plant eq '${plantValue}'`;
                plantToEditable = false;
                if (storageLocationValue) {
                    storageLocationToFilter = `$filter=Plant eq '${plantValue}' and StorageLocation eq '${storageLocationValue}'`;
                    storgeLocationToResetValue = false;
                }
            } else if ([MovementTypes.t311, MovementTypes.t313, MovementTypes.t315, MovementTypes.t411].some(t => t === selectedMovementType)) { //within plant transfer
                plantToFilter = `$filter=Plant eq '${plantValue}'&$orderby=Plant`;
                plantToEditable = false;

                if (storageLocationValue) {
                    storageLocationToFilter = `$filter=Plant eq '${plantValue}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                }

                if (selectedMovementType === MovementTypes.t315) {
                    plantToListPicker.setValue(plantValue);
                    if (storageLocationValue) {
                        storageLocationToListPicker.setValue(storageLocationValue);
                    }
                }

            } else if ([MovementTypes.t321, MovementTypes.t322, MovementTypes.t343].includes(selectedMovementType)) { //within plant transfer
                plantToFilter = `$filter=Plant eq '${plantValue}'&$orderby=Plant`;
                plantToEditable = false;
                if (storageLocationValue) {
                    storageLocationToFilter = `$filter=Plant eq '${plantValue}' and StorageLocation eq '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                }
            }
        } else if ([MovementTypes.t321, MovementTypes.t322, MovementTypes.t343].includes(selectedMovementType)) {
            plantToEditable = false;
        }

        let plantToSpecifier = plantToListPicker.getTargetSpecifier();
        plantToSpecifier.setQueryOptions(plantToFilter);
        plantToSpecifier.setEntitySet('Plants');
        plantToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        plantToListPicker.setEditable(plantToEditable);
        plantToListPicker.setTargetSpecifier(plantToSpecifier);
        plantToListPicker.redraw();

        let setSloc = () => {
            let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
            storageLocationToSpecifier.setQueryOptions(storageLocationToFilter);
            storageLocationToSpecifier.setEntitySet('StorageLocations');
            storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');

            setMandatoryCaption(context, mandatoryControlCaptions);

            if (storgeLocationToResetValue) {
                storageLocationToListPicker.setValue('');
            }
            storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
            storageLocationToListPicker.redraw();
        };

        if ([MovementTypes.t301, MovementTypes.t311, MovementTypes.t313, MovementTypes.t411].includes(selectedMovementType)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'Plants', [], plantToFilter).then(data => {
                if (data.length === 1) {
                    let plantInfo = data.getItem(0);
                    storageLocationToFilter = `$filter=Plant eq '${plantInfo.Plant}'&$orderby=StorageLocation`;
                    if (([MovementTypes.t311, MovementTypes.t411].includes(selectedMovementType)) && storageLocationValue) {
                        storageLocationToFilter = `$filter=Plant eq '${plantInfo.Plant}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                    }
                    if (binding && binding.MoveStorageLocation) {
                        if (plantInfo.Plant === binding.MovePlant) {
                            storgeLocationToResetValue = false;
                        }
                    }
                }
                setSloc();
            });
        } else {
            setSloc();
        }
    } else if ([MovementTypes.t551, MovementTypes.t552].includes(selectedMovementType)) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, costCenterSimple].includes(c)));
        movementReason.setVisible(true);
        if (context.binding && !context.binding.MovementReason) {
            movementReason.setValue('');
        }
        if (objectType === InventoryOrderTypes.RES || objectType === InventoryOrderTypes.PRD) {
            glAccountSimple.setEditable(false);
            costCenterSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            costCenterSimple.setEditable(true);
        }

        let movementReasonSpecifier = movementReason.getTargetSpecifier();
        movementReasonSpecifier.setQueryOptions(`$filter=MovementType eq '${selectedMovementType}'`);
        movementReasonSpecifier.setEntitySet('MovementReasons');
        movementReasonSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        movementReason.setTargetSpecifier(movementReasonSpecifier);
        movementReason.redraw();

        if (context?.binding?.SpecialStockInd) {
            setSalesOrWBSfields(context.binding.SpecialStockInd, salesOrderSimple, salesOrderItemSimple, wbsElementSimple);
        }
    } else if (selectedMovementType === MovementTypes.t122) {
        accountAssignmentSection.forEach(c => c.setVisible(false));
        movementReason.setVisible(true);
        goodsRecepient.setEditable(true);
        unloadingPoint.setEditable(true);
        if (context.binding && !context.binding.MovementReason) {
            movementReason.setValue('');
        }

        let movementReasonSpecifier = movementReason.getTargetSpecifier();
        movementReasonSpecifier.setQueryOptions("$filter=MovementType eq '122'&$orderby=MovementReason");
        movementReasonSpecifier.setEntitySet('MovementReasons');
        movementReasonSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        movementReason.setTargetSpecifier(movementReasonSpecifier);
        movementReason.redraw();
        return showSerialNumberField(context).then((result) => {
            openQuantity.setEditable(!result);
            addSerialNumber.setVisible(result);
        });
    } else if (selectedMovementType === MovementTypes.t102) {
        accountAssignmentSection.forEach(c => c.setVisible(false));
        movementReason.setVisible(false);
        goodsRecepient.setEditable(false);
        unloadingPoint.setEditable(false);
        openQuantity.setEditable(false);
        addSerialNumber.setVisible(false);
        if (context.binding && !context.binding.MovementReason) {
            movementReason.setValue('');
        }
        if (context.binding && context.binding.SerialNum && context.binding.SerialNum.length) {
            setDefaultSerials(context, context.binding.SerialNum);
        }
    } else if (selectedMovementType === MovementTypes.t231) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, salesOrderSimple, salesOrderItemSimple].includes(c)));
        if (context?.binding?.SpecialStockInd) {
            setSalesOrWBSfields(context.binding.SpecialStockInd, salesOrderSimple, salesOrderItemSimple, wbsElementSimple);
        }
    
    }

    if (!libInv.isStockTypeVisible(selectedMovementType)) {
        let stockTypePicker = formcellContainer.getControl('StockTypePicker');
        stockTypePicker.setVisible(false);
        stockTypePicker.redraw();
    }
//Disable fields for Cancellation
GetMovementTypeData(context, selectedMovementType).then((movementTypeData) => {
    if (movementTypeData && movementTypeData.RevMvmtTypeInd && objectType !== InventoryAdhoc.ADHOC) {
        accountAssignmentSection.forEach(c => c.setEditable(false));
        movementReason.setEditable(false);
        goodsRecepient.setEditable(false);
        unloadingPoint.setEditable(false);
        openQuantity.setEditable(false);
        addSerialNumber.setVisible(false);
        stockType.setEditable(false);
        storageLocationPicker.setEditable(false);
        storageLocationToListPicker.setEditable(false);
        glAccountSimple.setEditable(false);
        costCenterSimple.setEditable(false);
        orderSimple.setEditable(false);
        networkSimple.setEditable(false);
        activitySimple.setEditable(false);
        wbsElementSimple.setEditable(false);
        salesOrderSimple.setEditable(false);
        salesOrderItemSimple.setEditable(false);
        vendorListPicker.setEditable(false);
        businessAreaSimple.setEditable(false);
        uOMSimple.setEditable(false);
    }
});

}

function setDefaultSerials(context, serials) {
    let arr = serials.map(item => {
        return {
            SerialNumber: item.SerialNumber || item.SerialNum,
            selected: !!context.binding.SerialNum || !!context.binding.PickedQuantity,
            downloaded: !context.binding.SerialNum,
        };
    });
    common.setStateVariable(context, 'SerialNumbers', { actual: arr, initial: JSON.parse(JSON.stringify(arr)) });
}
/**
 *
 * @param {array of controls} arrControls
 * @returns
 */
function setMandatoryCaption(context, arrControls) {
    arrControls.forEach(c => c.Control.setCaption(common.formatCaptionWithRequiredSign(context, getCaptionString(c.Control.getCaption()), c.isMandatory)));
}

/**
 * check if control already has mandatory mark
 * @param {string} caption
 * @returns
 */
function getCaptionString(caption) {
    return (caption.endsWith('*') ? caption.substring(0, caption.length - 2) : caption);
}
/**
 * Show/Hide Storage Location to List Picker based on Movement Type
 * @param {IControlProxy} storageLocationToListPicker 
 * @param {string} selectedMovementType 
 */
export function manageStorageLocationToListPicker(storageLocationToListPicker, selectedMovementType) {
    const isVisible = [
        MovementTypes.t301, 
        MovementTypes.t305, 
        MovementTypes.t311, 
        MovementTypes.t313, 
        MovementTypes.t315, 
        MovementTypes.t321, 
        MovementTypes.t322, 
        MovementTypes.t343, 
        MovementTypes.t411].some(t => t === selectedMovementType);
    storageLocationToListPicker.setVisible(isVisible);
    storageLocationToListPicker.setEditable(isVisible && selectedMovementType !== MovementTypes.t305);
}


/**
 *
 * @param specialStockInd, salesOrderSimple, salesOrderItemSimple, wbsElementSimples
 * Depending upon specialStockInd value, make appropriate account assignment fields visible
 * @returns
 */
function setSalesOrWBSfields(specialStockInd, salesOrderSimple, salesOrderItemSimple, wbsElementSimple) {
    if (specialStockInd === SpecialStock.OrdersOnHand) {
        // then display sales order fields
        salesOrderSimple.setVisible(true);
        salesOrderItemSimple.setVisible(true);
    } else if (specialStockInd === SpecialStock.ProjectStock) {
        // then display WBS Element
        wbsElementSimple.setVisible(true);
    }
}

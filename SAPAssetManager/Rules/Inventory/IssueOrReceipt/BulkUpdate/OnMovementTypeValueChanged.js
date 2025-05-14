import SpecialStockListPickerItems from '../SpecialStockListPickerItems';
import IsSpecialStockIndVisible from './IsSpecialStockIndVisible';
import IsStorageLocationVisible from './IsStorageLocationVisible';
import IsCostCenterVisible from './IsCostCenterVisible';
import IsWBSElementVisible from './IsWBSElementVisible';
import libInv from '../../Common/Library/InventoryLibrary';
import IsGLAccountVisible from './IsGLAccountVisible';
import IsOrderVisible from './IsOrderVisible';
import IsNetworkVisible from './IsNetworkVisible';
import { GetPOAccountAssignment } from './BulkUpdateLibrary';

export default function OnMovementTypeValueChanged(context) {
    
    const selectedMovementType = context.getValue()[0].ReturnValue;
    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    const [specialStockIndicatorPicker, storageLocation, stockType, glAccount, costCenter, wbsElement, order, network, networkActivity] = ['SpecialStockIndicatorPicker', 'StorageLocationPicker', 'StockTypePicker', 'GLAccountSimple', 'CostCenterSimple', 'WBSElementSimple', 'OrderSimple', 'NetworkSimple', 'ActivitySimple'].map(n => formcellContainer.getControl(n));
    
    IsSpecialStockIndVisible(context, selectedMovementType).then((visible) => {
        if (visible) {
            SpecialStockListPickerItems(context, selectedMovementType).then((pickerItems) => {
                specialStockIndicatorPicker.setPickerItems(pickerItems);
                specialStockIndicatorPicker.setVisible(true);
            });
        } else {
            specialStockIndicatorPicker.setVisible(false);
        }
    });

    storageLocation.setVisible(IsStorageLocationVisible(selectedMovementType));
    stockType.setVisible(libInv.isStockTypeVisible(selectedMovementType));
    
    GetPOAccountAssignment(context).then((poAccountAssignment) => {
        const [ networkVisible, glAccountVisible, costCenterVisible, wbsElementVisible, orderVisible] =
                [   IsNetworkVisible(context, selectedMovementType, poAccountAssignment),
                    IsGLAccountVisible(context, selectedMovementType, poAccountAssignment),
                    IsCostCenterVisible(context, selectedMovementType, poAccountAssignment),
                    IsWBSElementVisible(context, selectedMovementType, undefined, poAccountAssignment),
                    IsOrderVisible(context, selectedMovementType, poAccountAssignment),
                ];
        Promise.all([networkVisible, glAccountVisible, costCenterVisible, wbsElementVisible, orderVisible]).then((result) => {
            network.setVisible(result[0]);
            networkActivity.setVisible(result[0]);
            glAccount.setVisible(result[1]);
            costCenter.setVisible(result[2]);
            wbsElement.setVisible(result[3]);
            order.setVisible(result[4]);
        });
    });
}

import CommonLibrary from '../../Common/Library/CommonLibrary';
import GenerateLocalID from '../../Common/GenerateLocalID';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import self from './PurchaseRequisitionLibrary';

const HeaderLocalIdConst = 'PurchaseRequisitionHeaderLocalId';
const ItemLocalIdConst = 'PurchaseRequisitionItemLocalId';
const PreviousItemLocalIdConst = 'PreviousPurchaseRequisitionItemLocalId';

// PurchaseRequisitionCreateList page is shown
const IsCreateListPageConst = 'IsCreatePurchaseRequisitionPage';

// IsAddAnotherItem button clicked
const IsAddAnotherConst = 'IsAddAnotherPurchaseRequisition';

// Purchase Requistion details page shown
const IsDetailsPageConst = 'IsPurchaseRequisitionDetailsPage';

export default class PurchaseRequisitionLibrary {
    static createAndStoreLocalHeaderId(context) {
        return GenerateLocalID(context, 'PurchaseRequisitionHeaders', 'PurchaseReqNo', '0000', "$filter=startswith(PurchaseReqNo, 'LOC_PR') eq true", 'LOC_PR')
            .then(function(id) {
                self.storeHeaderId(context, id);
                return Promise.resolve(id);
            });
    }

    static storeHeaderId(context, id) {
        CommonLibrary.setStateVariable(context, HeaderLocalIdConst, id);
    }

    static storeItemId(context, id) {
        CommonLibrary.setStateVariable(context, ItemLocalIdConst, id);
    }

    static storePreviousItemId(context, id) {
        CommonLibrary.setStateVariable(context, PreviousItemLocalIdConst, id);
    }

    static createAndStoreLocalItemId(context) {
        return GenerateLocalID(context, 'PurchaseRequisitionItems', 'PurchaseReqItemNo', '00000', '', '')
            .then(function(id) {
                self.storeItemId(context, id);
                return Promise.resolve(id);
            });
    }

    static clearFlags(context) {
        CommonLibrary.clearStateVariable(context, HeaderLocalIdConst);
        CommonLibrary.clearStateVariable(context, ItemLocalIdConst);
        CommonLibrary.clearStateVariable(context, PreviousItemLocalIdConst);

        CommonLibrary.clearStateVariable(context, IsCreateListPageConst);
        CommonLibrary.clearStateVariable(context, IsAddAnotherConst);
        CommonLibrary.clearStateVariable(context, IsDetailsPageConst);
    }

    static getLocalHeaderId(context) {
        return CommonLibrary.getStateVariable(context, HeaderLocalIdConst);
    }

    static getLocalItemId(context) {
        return CommonLibrary.getStateVariable(context, ItemLocalIdConst);
    }

    static getPreviousItemId(context) {
        return CommonLibrary.getStateVariable(context, PreviousItemLocalIdConst);
    }

    static setControlProperties(context, controlName, value, isVisible, isEditable) {
        if (!controlName) return;
        let container = context.getPageProxy().getControl('FormCellContainer');
        let control = container.getControl(controlName);
        if (control) {
            control.setValue(value);
            
            if (isVisible !== undefined) {
                control.setVisible(isVisible);
            }

            if (isEditable !== undefined) {
                control.setEditable(isEditable);
            }
        }
    }

    static setControlTarget(context, controlName, queryOptions, entitySet) {
        if (!controlName) return;
        let container = context.getPageProxy().getControl('FormCellContainer');
        let control = container.getControl(controlName);
        let specifier = control.getTargetSpecifier();
        if (entitySet) {
            specifier.setEntitySet(entitySet);
        }
        specifier.setQueryOptions(queryOptions);
        control.setTargetSpecifier(specifier);
        control.setValue(undefined);
    }

    static getControlValue(context, controlName, valueType, valueReferencedField) {
        let controls = CommonLibrary.getControlDictionaryFromPage(context);
        let value = controls ? CommonLibrary.getControlValue(controls[controlName]) : '';

        if (valueType === 'date') {
            if (!ValidationLibrary.evalIsEmpty(value)) {
                return new ODataDate(value).toDBDateString(context);
            }
        
            return new ODataDate().toDBDateString(context);
        }

        if (valueType === 'number') {
            if (!ValidationLibrary.evalIsEmpty(value)) {
                return parseFloat(value);
            }
        
            return 0;
        }

        if (valueType === 'link') {
            if (!ValidationLibrary.evalIsEmpty(value) && valueReferencedField) {
                return SplitReadLink(value)[valueReferencedField];
            }
        
            return '';
        }

        if (!ValidationLibrary.evalIsEmpty(value) && controls[controlName].getVisible() !== false) {
            return value;
        }
    
        return '';
    }

    static getMandatoryFeildsName() {
        return ['PlantLstPkr', 'MaterialListPicker', 'QuantitySimple', 'PurchaseGroupLstPkr', 'DeliveryDatePkr', 'PriceSimple', 'PriceUnitSimple', 'CurrencyLstPkr'];
    }

    static mandatoryFieldsValid(context) {
        let controls = CommonLibrary.getControlDictionaryFromPage(context);
        let mandatoryFields = self.getMandatoryFeildsName();
        let valid = true;
        
        if (controls) {
            mandatoryFields.forEach(fieldName => {
                let control = controls[fieldName];
                let value = CommonLibrary.getControlValue(control);
                if (ValidationLibrary.evalIsEmpty(value) || value === '0') {
                    valid = false;
                    CommonLibrary.executeInlineControlError(context, control, context.localizeText('field_is_required'));
                } else {
                    control.clearValidation();
                }
            });
        } else {
            return false;
        }

        return valid;
    }

    static getFeildsWithLength(context) {
        return {
            'PriceUnitSimple': context.getGlobalDefinition('/SAPAssetManager/Globals/PurchaseRequisition/PriceUnitLength.global').getValue(),
            'PriceSimple': context.getGlobalDefinition('/SAPAssetManager/Globals/PurchaseRequisition/PriceLength.global').getValue(),
            'MaterialBatch': context.getGlobalDefinition('/SAPAssetManager/Globals/PurchaseRequisition/MaterialBatchLength.global').getValue(),
            'QuantitySimple': context.getGlobalDefinition('/SAPAssetManager/Globals/PurchaseRequisition/QuantityLength.global').getValue(),
        };
    }

    static fieldsLengthValid(context) {
        let controls = CommonLibrary.getControlDictionaryFromPage(context);
        let fields = self.getFeildsWithLength(context);
        let valid = true;
        
        if (controls) {
            Object.keys(fields).forEach(fieldName => {
                let control = controls[fieldName];
                let value = CommonLibrary.getControlValue(control);
                if (!ValidationLibrary.evalIsEmpty(value) && value.length > fields[fieldName]) {
                    valid = false;
                    CommonLibrary.executeInlineControlError(context, control, context.localizeText('validation_maximum_field_length', [fields[fieldName]]));
                } else {
                    control.clearValidation();
                }
            });
        }

        return valid;
    }

    static isCreateListPage(context) {
        return CommonLibrary.getStateVariable(context, IsCreateListPageConst);
    }

    static setCreateListPageFlag(context, value) {
        CommonLibrary.setStateVariable(context, IsCreateListPageConst, value);
    }

    static isAddAnother(context) {
        return CommonLibrary.getStateVariable(context, IsAddAnotherConst);
    }

    static setAddAnotherFlag(context, value) {
        CommonLibrary.setStateVariable(context, IsAddAnotherConst, value);
    }

    static isCreateFromDetailsPage(context) {
        return CommonLibrary.getStateVariable(context, IsDetailsPageConst);
    }

    static setDetailsPageFlag(context, value) {
        CommonLibrary.setStateVariable(context, IsDetailsPageConst, value);
    }
}

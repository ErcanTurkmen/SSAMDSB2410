import libCom from '../../Common/Library/CommonLibrary';
import DecodeRequestedQuantity from './DecodeRequestedQuantity';
import EncodeRequestedQuantity from './EncodeRequestedQuantity';

export default function IssueOrReceiptCreateUpdateOnReturning(context) {
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const SerialNumbersChanged = serialNumbers.actual.filter(item => item.selected).length - serialNumbers.initial.filter(item => item.selected).length;
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const isValidObjectType = checkObjectType(objectType);

    if (SerialNumbersChanged !== 0) {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumberCancel.action').then(result => {
            if (result.data) {
                return libCom.getPageName(context) === 'VehicleIssueOrReceiptCreatePage' ? UpdateVehiclePage(context) : UpdatePage(context);
            } else {
                const openQuantity = libCom.getStateVariable(context, 'OpenQuantity');
                if (isValidObjectType) {
                    libCom.setStateVariable(context, 'OpenQuantity', serialNumbers.actual.filter(item => item.selected).length);
                } else {
                    libCom.setStateVariable(context, 'OpenQuantity', openQuantity - SerialNumbersChanged);
                }
                return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumber.action');
            }
        });
    }
    return libCom.getPageName(context) === 'VehicleIssueOrReceiptCreatePage' ? UpdateVehiclePage(context) : UpdatePage(context);
}

function UpdateVehiclePage(context) {
    const initialNumbers = libCom.getStateVariable(context, 'SerialNumbers').initial;
    const openQuantityPicker = libCom.getControlProxy(context, 'QuantitySimple');
    const newValue = initialNumbers.filter(item => item.selected).length;
    openQuantityPicker.setValue(newValue);
    libCom.setStateVariable(context, 'SerialNumbers', { actual: initialNumbers, initial: JSON.parse(JSON.stringify(initialNumbers)) });
}

function UpdatePage(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const initialNumbers = libCom.getStateVariable(context, 'SerialNumbers').initial;
    const requestedQuantityPicker = libCom.getControlProxy(context, 'RequestedQuantitySimple');
    const openQuantityPicker = libCom.getControlProxy(context, 'QuantitySimple');
    const decodedQuantity = DecodeRequestedQuantity(libCom.getControlProxy(context, 'RequestedQuantitySimple').getValue());
    const orderedQuantityValue = decodedQuantity[1];
    let confirmedValue = decodedQuantity[0];
    const UOM = decodedQuantity[2];
    const newValue = initialNumbers.filter(item => item.selected).length;
    const entryQuantity = libCom.getStateVariable(context, 'EntryQuantity') || 0;

    if (objectType === 'STO' || objectType === 'PO' || objectType === 'RES' || objectType === 'PRD' || objectType === 'REV') {
        if (type === 'MaterialDocItem') {
            const serialNumLength = (context.binding?.SerialNum?.length) ?? 0;
            confirmedValue = Number(libCom.getStateVariable(context, 'ConfirmedFilled')) + Number(newValue) - serialNumLength;
        } else if (libCom.getStateVariable(context, 'ConfirmedFilled')) {
            confirmedValue = libCom.getStateVariable(context, 'ConfirmedFilled') + newValue;
        } else {
            confirmedValue = newValue;
        }

        if (newValue > 0) {
            openQuantityPicker.setValue(entryQuantity);
            libCom.setStateVariable(context, 'OpenQuantity', newValue);
        } else {
            openQuantityPicker.setValue(orderedQuantityValue - confirmedValue);
            libCom.setStateVariable(context, 'OpenQuantity', orderedQuantityValue - confirmedValue);
        }
    }

    if (checkObjectType(objectType)) {
        openQuantityPicker.setValue(entryQuantity);
    }

    if (objectType === 'IB' || objectType === 'OB') {
        confirmedValue = newValue;
    }

    requestedQuantityPicker.setValue(EncodeRequestedQuantity(context, confirmedValue, orderedQuantityValue, UOM));
    requestedQuantityPicker.redraw();
    libCom.setStateVariable(context, 'SerialNumbers', { actual: initialNumbers, initial: JSON.parse(JSON.stringify(initialNumbers)) });
}

function checkObjectType(objectType) {
    return objectType === 'ADHOC' || objectType === 'TRF' || objectType === 'MAT';
}

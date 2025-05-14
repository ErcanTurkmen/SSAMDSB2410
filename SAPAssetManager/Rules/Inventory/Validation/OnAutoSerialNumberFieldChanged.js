import libCom from '../../Common/Library/CommonLibrary';
import GetReceivedQuantity from '../IssueOrReceipt/GetReceivedQuantity';
import GetConfirmedQuantity from '../IssueOrReceipt/GetConfirmedQuantity';
import EncodeRequestedQuantity from '../IssueOrReceipt/EncodeRequestedQuantity';
import DecodeRequestedQuantity from '../IssueOrReceipt/DecodeRequestedQuantity';
import ShowAutoSerialNumberField from './ShowAutoSerialNumberField';

export default async function OnAutoSerialNumberFieldChanged(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const control = context.getPageProxy().getControl('FormCellContainer');
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let requestedQuantitySimple = control.getControl('RequestedQuantitySimple').getValue();
    const serialNumber = await ShowAutoSerialNumberField(context);
    if (context.getValue() || !serialNumber) {
        control.getControl('SerialPageNav').setVisible(false);
        control.getControl('QuantitySimple').setEditable(true);

        if (objectType === 'ADHOC') {
            if (type === 'MaterialDocItem') {
                if (context.binding.SerialNum.length) {
                    control.getControl('QuantitySimple').setValue(0);
                } else {
                    control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
                }
            } else {
                control.getControl('QuantitySimple').setValue(0);
            }
        } else if (type === 'MaterialDocItem' && context.binding.SerialNum.length) {
            const confirmed = GetConfirmedQuantity(context).split(' ');
            const open = GetReceivedQuantity(context);
            const confirmedQty = Number(confirmed[0]) - context.binding.EntryQuantity;
            control.getControl('QuantitySimple').setValue(Number(open) + context.binding.EntryQuantity);
            setRequestedSimple(context, control, confirmedQty, requestedQuantitySimple);
        } else {
            control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
            const confirmed = GetConfirmedQuantity(context).split(' ');
            setRequestedSimple(context, control, confirmed[0], requestedQuantitySimple);
        }
    } else {
        control.getControl('SerialPageNav').setVisible(true);
        control.getControl('QuantitySimple').setEditable(false);

        if (objectType === 'ADHOC') {
            if (type === 'MaterialDocItem') {
                if (context.binding.SerialNum.length) {
                    control.getControl('QuantitySimple').setValue(context.binding.SerialNum.length);
                } else {
                    control.getControl('QuantitySimple').setValue(0);
                }
            } else {
                control.getControl('QuantitySimple').setValue(0);
            }

        } else if (context.binding.AutoGenerateSerialNumbers) {
            const confirmed = GetConfirmedQuantity(context).split(' ');
            const confirmedQty = Number(confirmed[0]) - context.binding.EntryQuantity;
            setRequestedSimple(context, control, confirmedQty, requestedQuantitySimple);
            control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
            libCom.setStateVariable(context, 'ConfirmedFilled', confirmedQty);
            libCom.setStateVariable(context, 'OpenQuantity', GetReceivedQuantity(context));
        } else {
            control.getControl('QuantitySimple').setValue(GetReceivedQuantity(context));
            const confirmed = GetConfirmedQuantity(context).split(' ');
            setRequestedSimple(context, control, confirmed[0], requestedQuantitySimple);
            libCom.setStateVariable(context, 'OpenQuantity', GetReceivedQuantity(context));
        }
    }

    libCom.setStateVariable(context, 'SerialNumbers', { actual: null, initial: null });
    return true;
}

function setRequestedSimple(context, control, confirmedQty, encodedQty) {
    const [, requestedQty, UOM] = DecodeRequestedQuantity(encodedQty);
    control.getControl('RequestedQuantitySimple').setValue(EncodeRequestedQuantity(context, confirmedQty, requestedQty, UOM));
}

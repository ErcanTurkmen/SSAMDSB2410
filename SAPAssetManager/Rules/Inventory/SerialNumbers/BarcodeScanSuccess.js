/**
* This function calls the barcode scan action until as many serial numbers are scanned as per the quantity entered
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import SerialNumDisable from './SerialNumDisable';
export default function BarcodeScanSuccess(context) {
  const actionResult = context.getActionResult('BarcodeScanner');
  if (!actionResult) {
    return '';
  }
  const newSerialNumber = actionResult.data;
  const quantityPicker = context.getPageProxy().getControl('SectionedTable').getControl('BaseQuantityUOM');
  const quantityValue = quantityPicker.getValue().split(' ');
  const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
  const actualNumbers = serialNumbers.actual || [];
  const existNumber = actualNumbers.find(item => item.SerialNumber === newSerialNumber);
  let TempLine_SerialNumbers = [];

  if (!newSerialNumber) {
    context.binding.temp_message = '$(L, scan_failed)';
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanFailedMessage.action');
  }

  if (existNumber) {
    if (existNumber.selected || existNumber.Description) {
      context.binding.temp_message = '$(L, already_scanned)';
      return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanFailedMessage.action');
    } else {
      existNumber.selected = true;
    }
  } else {
    actualNumbers.unshift({
      SerialNumber: newSerialNumber,
      selected: true,
      new: true,
    });
  }

  if (actualNumbers.length) {
    TempLine_SerialNumbers = actualNumbers.filter(item => item.selected);
  }
  libCom.setStateVariable(context, 'SerialNumbers', { actual: actualNumbers, initial: serialNumbers.initial });
  let totalCount = quantityValue[0] - TempLine_SerialNumbers.length;
  const ScanButton = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
  ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
  if (TempLine_SerialNumbers.length >= quantityValue[0]) {
    SerialNumDisable(context, false);
    context.getPageProxy().getControl('SectionedTable').redraw();
    if (context.binding) {
      context.binding.Temp_Serial_EntryQuantity = quantityValue[0];
      context.binding.Temp_Serial_ScannedNum = TempLine_SerialNumbers.length;
      context.getPageProxy().setActionBinding(context.binding);
    } else {
      const binding = { Temp_Serial_EntryQuantity: quantityValue[0], Temp_Serial_ScannedNum: TempLine_SerialNumbers.length };
      context.getPageProxy().setActionBinding(binding);
    }
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanSuccess.action');
  } else {
    SerialNumDisable(context, true);
    context.getPageProxy().getControl('SectionedTable').redraw();
    return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumberScan.action');
  }
}


/**
* This function calls the barcode scan action until as many serial numbers are scanned as per the quantity entered
* @param {IClientAPI} context
*/
import libCom from '../../../Common/Library/CommonLibrary';
import SerialNumDisable from '../../SerialNumbers/SerialNumDisable';
export default function BarcodeScanSuccess(context) {
	const actionResult = context.getActionResult('BarcodeScanner');
	const sectionedTable = context.getPageProxy().getControl('SectionedTable');
	if (!actionResult) {
		return '';
	}
	const newSerialNumber = actionResult.data;
	const quantityPicker = sectionedTable.getControl('QuantitySimple');
	const quantityValue = quantityPicker.getValue();
	const serialMap = libCom.getStateVariable(context, 'NewSerialMap');
	if (!newSerialNumber) {
		context.binding.temp_message = '$(L, scan_failed)';
		return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanFailedMessage.action');
	}
	if (serialMap.has(newSerialNumber)) {
		context.binding.temp_message = '$(L, already_scanned)';
		return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanFailedMessage.action');
	} else {
		const serial = {
			SerialNumber: newSerialNumber,
			Date: new Date(),
			IsLocal: true,
			IsNew: true,
		};
		serialMap.set(newSerialNumber, serial);
	}
	const serialLength = serialMap?.size || 0;
	const totalCount = quantityValue - serialLength;
	const scanButton = sectionedTable.getControl('ScanButton');
	scanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
	if (serialLength >= quantityValue) {
		SerialNumDisable(context, false);
		sectionedTable.redraw();
		if (context.binding) {
			context.binding.Temp_Serial_EntryQuantity = quantityValue;
			context.binding.Temp_Serial_ScannedNum = serialLength;
			context.getPageProxy().setActionBinding(context.binding);
		} else {
			const binding = { Temp_Serial_EntryQuantity: quantityValue, Temp_Serial_ScannedNum: serialLength };
			context.getPageProxy().setActionBinding(binding);
		}
		return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanSuccess.action');
	} else {
		SerialNumDisable(context, true);
		sectionedTable.redraw();
		return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/SerialNumberScan.action');
	}
}


import ODataDate from '../../../Common/Date/ODataDate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import PreviousReadingFloat from '../../PreviousReadingFloat';
import PreviousReadingDate from '../../PreviousReadingDate';
import PreviousReadingTime from '../../PreviousReadingTime';
import Logger from '../../../Log/Logger';
import IsClassicLayoutEnabled from '../../../Common/IsClassicLayoutEnabled';

export default async function CreateMeterReadings(context) {
    if (IsClassicLayoutEnabled(context)) {
        return Promise.resolve();
    }
    let promises = [];
    let edtTable = CommonLibrary.getControlProxy(context, 'EditableDataTableExtensionSection');
    let edtExtension = edtTable.getExtension();

    if (edtExtension && edtTable.getVisible() && edtExtension.getRows()) {
        let allRows = edtExtension.getRows();
        let rowsBinding = edtExtension.getRowBindings();
        await collectReadingDataAndRunAction(context, allRows, rowsBinding, promises);
    }

    return Promise.all(promises).catch((error) => {
        Logger.error('CreateMeterReadings', error);
    });
}

async function collectReadingDataAndRunAction(context, allRows, rowsBinding, promises) {
    let isSomeReadingEntered = allRows.some(cells => cells.length && cells[1].getValue());
    if (!isSomeReadingEntered) return;

    for (let rowCells of allRows) {
        if (rowCells[0]) {
            let rowBinding = rowsBinding[rowCells[0].getRow()];

            let meterProperties = {
                'MeterReadingRecorded': rowCells[1].getValue(),
                'MeterReaderNote': rowCells[4].getValue(),
                'MeterReadingReason': '',
                'DateMaxRead': getUserPickDate(context, rowCells[2], rowCells[3]),
                'TimeMaxReading': getUserPickTime(context, rowCells[2], rowCells[3]),
            };

            try {
                const localReading = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=sap.islocal() and RegisterGroup eq '${rowBinding.RegisterGroup}' and Register eq '${rowBinding.RegisterNum}' and EquipmentNum eq '${context.binding.BatchEquipmentNum}'`);
                if (localReading.length > 0) {
                    promises.push(updateReading(context, localReading.getItem(0)['@odata.readLink'], meterProperties));
                } else {
                    promises.push(createReading(context, rowBinding, meterProperties));
                }
            } catch (error) {
                Logger.error('collectReadingDataAndRunAction', error);
            }
        }
    }
}

function getUserPickDate(context, switchControl, dateControl) {
    if (switchControl.getValue()) {
        return getDate(context, dateControl.getValue());
    }
    return null;
}

function getUserPickTime(context, switchControl, dateControl) {
    if (switchControl.getValue()) {
        return getTime(context, dateControl.getValue());
    }
    return '00:00';
}

function updateReading(context, link, meterProperties) {
    let updateProps = {
        'MeterReadingDate': getDate(context),
        'MeterReadingTime': getTime(context),
        'ActualMeterReadingDate': getDate(context),
        'ActualMeterReadingTime': getTime(context),
        ...meterProperties,
    };

    // a reading exists, do updates
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        'Properties': {
            'Target': {
                'EntitySet': 'MeterReadings',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': link,
            },
            'Properties': updateProps,
            'Headers':
            {
                'OfflineOData.TransactionID': context.binding.BatchEquipmentNum,
                'transaction.omdo_id': '/SAPAssetManager/Rules/Meter/Reading/ReadingTransactionMdoHeader.js',
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
            },
            'ShowActivityIndicator': true,
            'ActivityIndicatorText': '  ',
        },
    });
}

async function createReading(context, rowBinding, meterProperties) {
    const meterReadingDocID = String(new Date().getTime()) + '_' + rowBinding.RegisterNum;
    const DocID = 'LOCAL_' + meterReadingDocID.substring(meterReadingDocID.length - 10);
    const prevReading = await PreviousReadingFloat(context, rowBinding.RegisterNum);
    const previousReadingTime = await PreviousReadingTime(context, rowBinding.RegisterNum);
    const previousReadingDate = await PreviousReadingDate(context, rowBinding.RegisterNum);
    // no existing reading, do creates
    let createProps = {
        'MeterReadingDocID': DocID,
        'Register': rowBinding.RegisterNum,
        'RegisterGroup': rowBinding.RegisterGroup,
        'MeterReadingDate': getDate(context),
        'MeterReadingTime': getTime(context),
        'ActualMeterReadingDate': getDate(context),
        'ActualMeterReadingTime': getTime(context),
        'PreviousReadingFloat': prevReading,
        'PreviousReadingDate': previousReadingDate,
        'PreviousReadingTime': previousReadingTime,
        ...meterProperties,
    };

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'ActionResult': {
                '_Name': 'CreateMeterReading',
            },
            '_Type': 'Action.Type.ODataService.CreateEntity',
            'Target': {
                'EntitySet': 'MeterReadings',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties': createProps,
            'OnFailure': '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action',
            'Headers':
            {
                'OfflineOData.RemoveAfterUpload': 'true',
                'OfflineOData.TransactionID': context.binding.BatchEquipmentNum,
                'transaction.omdo_id': '/SAPAssetManager/Rules/Meter/Reading/ReadingTransactionMdoHeader.js',
            },
            'CreateLinks':
                [{
                    'Property': 'Device_Nav',
                    'Target':
                    {
                        'EntitySet': 'Devices',
                        'ReadLink': context.getClientData().DeviceReadLink,
                    },
                }],
        },
    });
}

function getDate(context, date) {
    let currentDate = formatDate(date);
    let odataDate = new ODataDate(currentDate);
    return odataDate.toLocalDateString(context);
}

function getTime(context, date) {
    let currentTime = formatDate(date);
    let odataDate = new ODataDate(currentTime);
    let time = odataDate.toLocalTimeString(context).split(':');
    return time[0] + ':' + time[1];
}

function formatDate(date) {
    let formattedDate = new Date();

    if (typeof date === 'string' && date?.length < 19 && date.includes('T')) {
        let splittedDateAndTime = date.split('T');
        let formattedSplittedDateAndTime = splittedDateAndTime[0].split('-').map(part => {
            if (part.length < 2) part = '0' + part;
            return part;
        }).join('-'); // from 2024-3-12T10:51:00 to 2024-03-12T10:51:00
        formattedDate = new Date(formattedSplittedDateAndTime + 'T' + splittedDateAndTime[1]);
    } else if (date) {
        formattedDate = new Date(date);
    }

    return formattedDate;
}

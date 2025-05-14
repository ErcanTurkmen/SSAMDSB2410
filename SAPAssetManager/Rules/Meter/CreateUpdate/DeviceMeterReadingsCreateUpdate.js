import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import localization from '../../Common/Library/LocalizationLibrary';
import libMeter from '../Common/MeterLibrary';
import {GlobalVar} from '../../Common/Library/GlobalCommon';
import MeterReplaceInstall from './MeterReplaceInstall';
import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import countDecimals from '../../Classification/Characteristics/Validation/CharacteristicsCountDecimal';
import ODataDate from '../../Common/Date/ODataDate';

export default function DeviceMeterReadingsCreateUpdate(context) {
    let sectionHelper = new FDCSectionHelper(context);
    const pageBinding = context.binding;

    sectionHelper.run((sectionBinding, section) => {
        if (!sectionBinding) {
            return true;
        }

        let now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        now.setDate(now.getDate() + 1);

        let dict = {'ReadingValue': '', 'ReadingTimeControl': '', 'PeakTimeSwitch': '', 'PeakUsageTimeControl': '', 'NotePicker': ''};

        for (let key of Object.keys(dict)) {
            dict[key] = section.getControl(key).getValue();

            if (typeof dict[key] === Array) {
                dict[key] = dict[key][0].ReturnValue;
            }
        }

        section.getControl('ReadingValue').clearValidation();
        section.getControl('ReadingTimeControl').clearValidation();
        section.getControl('PeakUsageTimeControl').clearValidation();

        let estimateReadingNote = libCommon.getAppParam(context, 'METERREADINGNOTE', 'EstimateMeterReading');

        let result = true;

        let message = '';

        if (libVal.evalIsEmpty(dict.ReadingValue) && dict.NotePicker !== estimateReadingNote) {
            result = false;
            message = context.localizeText('field_is_required');
            libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
        }

        if (dict.ReadingTimeControl >= now) {
            result = false;
            message = context.localizeText('validation_reading_time_cannot_be_in_the_future');
            libCommon.executeInlineControlError(context, section.getControl('ReadingTimeControl'), message);
        }

        if ( dict.PeakTimeSwitch
            && dict.PeakUsageTimeControl >= now ) {
            result = false;
            message = context.localizeText('validation_peak_reading_time_cannot_be_in_the_future');
            libCommon.executeInlineControlError(context, section.getControl('PeakUsageTimeControl'), message);
        }

        if (!localization.isNumber(context, dict.ReadingValue)) {
            result = false;
            message = context.localizeText('validation_reading_is_numeric');
            libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
        }

        if (countDecimals(localization.toNumber(context, dict.ReadingValue)) > Number(sectionBinding.DecimalAfter)) {
            result = false;
            let dynamicParams = [Number(sectionBinding.DecimalAfter)];
            message = context.localizeText('max_number_of_decimals', dynamicParams);
            libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
        }

        if (((countDecimals(localization.toNumber(context, dict.ReadingValue)) > 0) ? dict.ReadingValue.length - countDecimals(localization.toNumber(context, dict.ReadingValue)) - 1 : dict.ReadingValue.length) > Number(context.binding.DecimalBefore)) {
            result = false;
            let dynamicParams = [Number(sectionBinding.DecimalBefore)];
            message = context.localizeText('max_number_of_char', dynamicParams);
            libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
        }

        return result;
    }).then(validationResult => {
        if (validationResult.every(validation => validation === true)) {
            return sectionHelper.run((sectionBinding, section, sectionIndex) => {
                if (sectionIndex === 0) { // Skip first section
                    return Promise.resolve();
                }
                const isPeakReading = section.getControl('PeakTimeSwitch').getValue();
                const readerNote = (value => {
                    if (value.length > 0) {
                        return value[0].ReturnValue;
                    } else {
                        return '';
                    }
                })(section.getControl('NotePicker').getValue());

                const readingReason = (reasonValue => {
                    let transactionType = libMeter.getMeterTransactionType(context);
                    if (transactionType.startsWith('READING')) {
                        if (reasonValue.length > 0) {
                            return reasonValue[0].ReturnValue;
                        } else {
                            return '';
                        }
                    } else if (transactionType.startsWith('DISCONNECT')) {
                        try {
                            return GlobalVar.getAppParam().METERREASONCODE.Disconnect;
                        } catch (exc) {
                            return '';
                        }
                    } else if (transactionType.startsWith('RECONNECT')) {
                        try {
                            return GlobalVar.getAppParam().METERREASONCODE.Reconnect;
                        } catch (exc) {
                            return '';
                        }
                    } else {
                        return '';
                    }
                })(section.getControl('ReasonPicker').getValue());

                const reading = localization.toNumber(context, section.getControl('ReadingValue').getValue(), '', false);

                const meterReadingDocID = String(new Date().getTime()) + '_' + sectionBinding.RegisterNum;
                const DocID = 'LOCAL_' + meterReadingDocID.substring(meterReadingDocID.length - 10);

                const readingTransactionMdoHeader = (() => {
                    let meterTransactionType = libMeter.getMeterTransactionType(context);
                    if (meterTransactionType.startsWith('INSTALL') || meterTransactionType.startsWith('REMOVE') || meterTransactionType.startsWith('REPLACE') || meterTransactionType.startsWith('REP_INST')) {
                        return context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/DeviceOmdoID.global').getValue();
                    } else if (meterTransactionType.startsWith('PERIODIC')) {
                        return context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/MeterReadingPeriodicOmdoID.global').getValue();
                    }
                    return context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/MeterReadingOmdoID.global').getValue();
                })();

                const peakDateValue = (() => {
                    let date = null;
                    if (isPeakReading) {
                        let peakDate = new Date(section.getControl('PeakUsageTimeControl').getValue());
                        let odataDate = new ODataDate(peakDate);
                        date = odataDate.toDBDateString(context);
                    }
                    return date;
                })();

                const peakTimeValue = (() => {
                    let time = '00:00';
                    if (isPeakReading) {
                        let peakTime = section.getControl('PeakUsageTimeControl').getValue();
                        let odataDate = new ODataDate(peakTime).toDBTimeString(context).split(':');
                        time = odataDate[0] + ':' + odataDate[1];
                    }
                    return time;
                })();

                let equipmentNum = '';
                if (pageBinding && pageBinding.DeviceLink) {
                    equipmentNum = pageBinding.DeviceLink.EquipmentNum;
                } else if (pageBinding && pageBinding.Device_Nav) {
                    equipmentNum = pageBinding.Device_Nav.EquipmentNum;
                } else if (context.binding && context.binding.DeviceLink) {
                    equipmentNum = context.binding.DeviceLink.EquipmentNum;
                } else if (sectionBinding && sectionBinding.Device_Nav) {
                    equipmentNum = context.binding.Device_Nav.EquipmentNum;
                }

                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=sap.islocal() and RegisterGroup eq '${sectionBinding.RegisterGroup}' and Register eq '${sectionBinding.RegisterNum}' and EquipmentNum eq '${equipmentNum}'`).then(function(result) {
                    let readLink = '';

                    if (result.length > 0 && (readLink = result.getItem(0)['@odata.readLink'])) {
                        sectionBinding.MeterReadingReadLink = readLink;

                        let updateProps = {
                            'MeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                            'MeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                            'ActualMeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                            'ActualMeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                            'MeterReadingRecorded': reading,
                            'MeterReaderNote': readerNote,
                            'MeterReadingReason': readingReason,
                            'DateMaxRead': peakDateValue,
                            'TimeMaxReading': peakTimeValue,
                        };

                        // a reading exists, do updates
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
                            'Target': {
                                'EntitySet': 'MeterReadings',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': sectionBinding.MeterReadingReadLink,
                            },
                            'Properties': updateProps,
                            'Headers':
                            {
                                'OfflineOData.TransactionID': '#Property:BatchEquipmentNum',
                                'transaction.omdo_id': '/SAPAssetManager/Rules/Meter/Reading/ReadingTransactionMdoHeader.js',
                            },
                            'RequestOptions': {
                                'UpdateMode': 'Replace',
                            },
                            'ShowActivityIndicator': true,
                            'ActivityIndicatorText' : '  ',
                        }});
                    } else {
                        // no existing reading, do creates
                        let createProps = {
                            'MeterReadingDocID': DocID,
                            'Register': sectionBinding.RegisterNum,
                            'RegisterGroup': sectionBinding.RegisterGroup,
                            'MeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                            'MeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                            'ActualMeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                            'ActualMeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                            'MeterReadingRecorded': reading,
                            'MeterReaderNote': readerNote,
                            'MeterReadingReason': readingReason,
                            'PreviousReadingFloat': '/SAPAssetManager/Rules/Meter/PreviousReadingFloat.js',
                            'PreviousReadingDate': '/SAPAssetManager/Rules/Meter/PreviousReadingDate.js',
                            'PreviousReadingTime': '/SAPAssetManager/Rules/Meter/PreviousReadingTime.js',
                            'DateMaxRead': peakDateValue,
                            'TimeMaxReading': peakTimeValue,
                        };

                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 'Properties': {
                            'ActionResult': {
                                '_Name': 'CreateMeterReading',
                            },
                            '_Type': 'Action.Type.ODataService.CreateEntity',
                            'Target': {
                                'EntitySet': 'MeterReadings',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                            },
                            'Properties': createProps,
                            'Headers':
                            {
                                'OfflineOData.RemoveAfterUpload': 'true',
                                'OfflineOData.TransactionID': context.binding.BatchEquipmentNum,
                                'transaction.omdo_id': readingTransactionMdoHeader,
                            },
                            'CreateLinks':
                            [{
                                'Property': 'Device_Nav',
                                'Target':
                                {
                                    'EntitySet': 'Devices',
                                    'ReadLink': context.binding.DeviceLink['@odata.readLink'],
                                },
                            }],
                        }});
                    }
                });
            }).then(() => {
                return MeterReplaceInstall(context);
            });
        } else {
            return Promise.resolve();
        }
    });
}

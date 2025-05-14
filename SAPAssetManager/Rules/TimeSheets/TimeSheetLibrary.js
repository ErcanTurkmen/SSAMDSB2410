import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import { TimeSheetLibrary as libTS, TimeSheetEventLibrary as libTSEvent, TimeSheetControlsLibrary as libTSControls, TimeSheetDetailsLibrary as libTSDetails } from './TimeSheetLibrary';
import ODataDate from '../Common/Date/ODataDate';
import Logger from '../Log/Logger';
import libTSActivityTypeCostCenter from './TimeSheetActivityTypeCostCenter';
import IsAnotherTechnicianSelectEnabled from './CreateUpdate/IsAnotherTechnicianSelectEnabled';
import TimeSheetEntryCreateUpdateRecOrderUpdate from './Entry/CreateUpdate/TimeSheetEntryCreateUpdateRecOrderUpdate';

export class TimeSheetEventLibrary {

    static TimeSheetEntryDetailsOnPageLoad(clientAPI) {
        let date = clientAPI.binding.Date || clientAPI.binding.WorkDate;
        if (date) {
            let odataDate = new ODataDate(date);
            clientAPI.setCaption(clientAPI.formatDate(odataDate.date(), '','',{format:'full'}));
        } else {
            clientAPI.setCaption(clientAPI.localizeText('time_sheets')); // Date may not be defined for crew. Default to 'Time Sheets'
        }
        libCom.setStateVariable(clientAPI, 'TimeSheetDetails', true);
    }

    static TimeSheetEntryCreateUpdateOnPageLoad(pageClientAPI) {
        if (!pageClientAPI.getClientData().LOADED) {

            pageClientAPI.getClientData().UPDATOR = 'NONE';
            //Get and set the correct title
            let title = pageClientAPI.localizeText('add_time');
            pageClientAPI.setCaption(title);

            //Determine if we are on edit vs. create
            let onCreate = libCom.IsOnCreate(pageClientAPI);

            if (onCreate) {
                libTSEvent.SetDefaultCreateTimeEntryConfiguration(pageClientAPI);
            }
            pageClientAPI.getClientData().LOADED = true;
        }
        pageClientAPI.getClientData().TIMESET = 0;
        pageClientAPI.getClientData().timeSheetInitialDuration = 0;
        return true;

    }

    static TimeSheetEntryEditOnPageLoad(pageClientAPI) {
        if (!pageClientAPI.getClientData().LOADED) {

            pageClientAPI.getClientData().UPDATOR = 'NONE';
            let title = pageClientAPI.localizeText('edit_time');
            pageClientAPI.setCaption(title);
            libTSEvent.SetDefaultEditTimeEntryConfiguration(pageClientAPI);
            pageClientAPI.getClientData().LOADED = true;
        }
        pageClientAPI.getClientData().TIMESET = 0;
        return true;

    }

    static async SetDefaultCreateTimeEntryConfiguration(pageProxy) {

        let operationControl = pageProxy.getControl('FormCellContainer').getControl('OperationLstPkr');
        let subOperationControl = pageProxy.getControl('FormCellContainer').getControl('SubOperationLstPkr');
        let workCenterControl = pageProxy.getControl('FormCellContainer').getControl('WorkCenterLstPkr');
        let endDateControl = pageProxy.getControl('FormCellContainer').getControl('HourEndDtPicker');
        let activityControl = pageProxy.getControl('FormCellContainer').getControl('ActivityTypeLstPkr');
        let workOrderControl = pageProxy.getControl('FormCellContainer').getControl('RecOrderLstPkr');  

        libCom.setFormcellNonEditable(operationControl);
        libCom.setFormcellNonEditable(subOperationControl);
        libCom.setFormcellNonEditable(workCenterControl);
        libCom.setFormcellNonEditable(activityControl);

        let dateStr;
        if (pageProxy.binding && pageProxy.binding.Date) {
            if (typeof pageProxy.binding.Date.toISOString === 'function') {  //Date
                dateStr = pageProxy.binding.Date.toISOString().substr(0, 10);
            } else {  //String date
                dateStr = pageProxy.binding.Date.substr(0, 10);
            }
            libCom.setFormcellNonEditable(endDateControl);
        } else {
            libCom.setEditable(endDateControl, true);
        }

        if (libCom.getStateVariable(pageProxy, 'OrderId')) {
            pageProxy.getControl('FormCellContainer').getControl('RecOrderLstPkr').setValue(`MyWorkOrderHeaders('${libCom.getStateVariable(pageProxy, 'OrderId')}')`);
        }
        if (libCom.getStateVariable(pageProxy, 'ActivityType')) {
            pageProxy.getControl('FormCellContainer').getControl('ActivityTypeLstPkr').setValue(libCom.getStateVariable(pageProxy, 'ActivityType'));
        }
        if (libCom.getStateVariable(pageProxy, 'AttendanceType')) {
            pageProxy.getControl('FormCellContainer').getControl('AbsAttLstPkr').setValue(libCom.getStateVariable(pageProxy, 'AttendanceType'));
        }

        // If the work order is set, we need to update the operation pickers
        if (workOrderControl?.getValue()) {
            await TimeSheetEntryCreateUpdateRecOrderUpdate(workOrderControl);
        }

        let date = new ODataDate(dateStr);
        endDateControl.setValue(date.date());
        pageProxy.getClientData().DefaultValuesLoaded = true;
    }

    static SetDefaultEditTimeEntryConfiguration(pageProxy) {

        let recOrderControl = pageProxy.getControl('FormCellContainer').getControl('RecOrderLstPkr');
        let operationControl = pageProxy.getControl('FormCellContainer').getControl('OperationLstPkr');
        let subOperationControl = pageProxy.getControl('FormCellContainer').getControl('SubOperationLstPkr');
        let workCenterControl = pageProxy.getControl('FormCellContainer').getControl('WorkCenterLstPkr');

        let recOrder = libCom.getListPickerValue(recOrderControl.getValue());
        let operationNo = libCom.getListPickerValue(operationControl.getValue());
        let subOperationValue = libCom.getListPickerValue(subOperationControl.getValue());

        libCom.setFormcellNonEditable(operationControl);
        libCom.setFormcellNonEditable(subOperationControl);
        libCom.setFormcellNonEditable(workCenterControl);

        if (recOrder) {
            libCom.setFormcellEditable(operationControl);
            libTSEvent.ToggleNonWorkOrderRelatedFields(pageProxy, false);
        } else {
            libTSEvent.ToggleNonWorkOrderRelatedFields(pageProxy, true, false);
        }

        if ((operationNo || pageProxy.binding.Operation) && (subOperationValue || pageProxy.binding.SubOperation)) {
            libCom.setFormcellEditable(subOperationControl);
        } else if (pageProxy.binding.Operation) {
            let operationId = pageProxy.binding.Operation;
            let woId = pageProxy.binding.RecOrder;

            pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', [],
                    `$filter=OrderId eq '${woId}' and OperationNo eq '${operationId}'`)
                .then(function(results) {
                    if (results && results.length > 0) {
                        libCom.setFormcellEditable(subOperationControl);
                    }
            });
        }

        pageProxy.getClientData().DefaultValuesLoaded = true;

        if (libCom.getStateVariable(pageProxy, 'IsBulkConfirmationActive')) {
            libCom.setFormcellNonEditable(recOrderControl);
            libCom.setFormcellNonEditable(workCenterControl);
            libCom.setFormcellNonEditable(operationControl);
            libCom.setFormcellNonEditable(subOperationControl);

            let discardButton = pageProxy.getControl('FormCellContainer').getControl('DiscardButton');
            discardButton.setVisible(false);

            return libTS.GetWorkCenterFromObject(pageProxy, recOrder).then(newWorkCenter => {
                if (newWorkCenter) {
                    return libTS.updateWorkCenter(pageProxy, newWorkCenter);
                }
                return Promise.resolve(true);
            });
        }

        return Promise.resolve(true);
    }

    static ToggleNonWorkOrderRelatedFields(pageProxy, editable, setEmpty = true) {
        let nonWorkOrderRelatedControls = ['CostCenter', 'WBS', 'Network', 'ActivityNum'];
        nonWorkOrderRelatedControls.forEach(controlName => {
            let control = libCom.getControlProxy(pageProxy, controlName);
            libCom.setEditable(control, editable);
            if (setEmpty) {
                control.setValue('');
            }
        });
    }

    static GetHoursForDate(pageClientAPI, endDate) {

        let queryOptions = `$filter=Date eq datetime'${endDate}'`;

        if (pageClientAPI.getClientData().PersonnelNumber) {
            queryOptions += ` and PersonnelNumber eq '${pageClientAPI.getClientData().PersonnelNumber}'`;
        }

        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], queryOptions)
            .then(function(timeEntries) {
                let hours = 0.0;
                timeEntries.forEach(function(element) {
                    hours += libTS.getActualHours(pageClientAPI, element.Hours);
                });
                return hours;
            }).catch(function(error) {
                Logger.error(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), error);
                return 0;
            });
    }

    static TimeSheetEntryCreateUpdateOnHourChange(control) {
        let name = control.getName();

        switch (name) {
            case 'HourStartDtPicker':
            case 'HourEndDtPicker':
                libTSControls.UpdateDuration(control.getPageProxy());
                break;
            default:
                break;

        }
    }


    static TimeSheetEntryCreateUpdateOnDurationChange(control) {
        let name = control.getName();

        if (name === 'DurationPkr') {
            libTSControls.UpdateHoursFromDuration(control.getPageProxy());
        }
    }

    static TimeSheetEntryCreateUpdateValidation(pageClientAPI) {

        let dict = {};

        //Create Dictionary of values.
        libCom.getFieldValue(pageClientAPI, 'HourStartDtPicker', '', dict, false);
        libCom.getFieldValue(pageClientAPI, 'HourEndDtPicker', '', dict, false);
        dict.Date = libTSDetails.TimeSheetCreateUpdateDate(pageClientAPI);
        libCom.getFieldValue(pageClientAPI, 'DurationPkr', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'AbsAttLstPkr', '', dict, true);
        dict.AbsAttLstPkr = libCom.getListPickerValue(dict.AbsAttLstPkr);
        libCom.getFieldValue(pageClientAPI, 'ActivityTypeLstPkr', '', dict, true);
        dict.ActivityTypeLstPkr = libCom.getListPickerValue(dict.ActivityTypeLstPkr);
        libCom.getFieldValue(pageClientAPI, 'RecOrderLstPkr', '', dict, true);
        dict.RecOrderLstPkr = libCom.getListPickerValue(dict.RecOrderLstPkr);
        libCom.getFieldValue(pageClientAPI, 'OperationLstPkr', '', dict, true);
        dict.OperationLstPkr = libCom.getListPickerValue(dict.OperationLstPkr);
        libCom.getFieldValue(pageClientAPI, 'SubOperationLstPkr', '', dict, true);
        dict.SubOperationLstPkr = libCom.getListPickerValue(dict.SubOperationLstPkr);
        libCom.getFieldValue(pageClientAPI, 'WorkCenterLstPkr', '', dict, true);
        dict.WorkCenterLstPkr = libCom.getListPickerValue(dict.WorkCenterLstPkr);
        libCom.getFieldValue(pageClientAPI, 'ResponciblePersonelNum', '', dict, true);
        dict.ResponciblePersonelNum = libCom.getListPickerValue(dict.ResponciblePersonelNum);

        libCom.getFieldValue(pageClientAPI, 'CostCenter', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'WBS', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'Network', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'ActivityNum', '', dict, true);

        return libTSEvent.ValidateTotalHoursLessThan24(pageClientAPI, dict)
            .then(libTSEvent.ValidatePersonnelNumber.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateFutureDate.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateFutureDate.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateStartBeforeFinish.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateHoursNonZero.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateActivityTypeIfRecOrder.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateOperationIfRecOrder.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateWorkorderRequiredIfActivityType.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateAbsAttOrActivityType.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateNonWorkOrderRelatedProperties.bind(null, pageClientAPI, dict), null)
            .then(function() {
                return true;
            }, function() {
                return false;
            }); //Pass back true or false to calling action;
        //            .then(libTSEvent.ValidateReadingIsNumeric.bind(null, pageClientAPI, dict), null)

    }

    static TimeSheetEntryEditValidation(pageClientAPI) {

        let dict = {};

        //Create Dictionary of values.
        libCom.getFieldValue(pageClientAPI, 'Date', '', dict, false);
        libCom.getFieldValue(pageClientAPI, 'DurationPkr', '', dict, false);
        libCom.getFieldValue(pageClientAPI, 'DatePicker', '', dict, false);
        dict.Date = libTSDetails.TimeSheetCreateUpdateDate(pageClientAPI);
        libCom.getFieldValue(pageClientAPI, 'AbsAttLstPkr', '', dict, true);
        dict.AbsAttLstPkr = libCom.getListPickerValue(dict.AbsAttLstPkr);
        libCom.getFieldValue(pageClientAPI, 'ActivityTypeLstPkr', '', dict, true);
        dict.ActivityTypeLstPkr = libCom.getListPickerValue(dict.ActivityTypeLstPkr);
        libCom.getFieldValue(pageClientAPI, 'RecOrderLstPkr', '', dict, true);
        dict.RecOrderLstPkr = libCom.getListPickerValue(dict.RecOrderLstPkr);
        libCom.getFieldValue(pageClientAPI, 'OperationLstPkr', '', dict, true);
        dict.OperationLstPkr = libCom.getListPickerValue(dict.OperationLstPkr);
        libCom.getFieldValue(pageClientAPI, 'SubOperationLstPkr', '', dict, true);
        dict.SubOperationLstPkr = libCom.getListPickerValue(dict.SubOperationLstPkr);
        libCom.getFieldValue(pageClientAPI, 'WorkCenterLstPkr', '', dict, true);
        dict.WorkCenterLstPkr = libCom.getListPickerValue(dict.WorkCenterLstPkr);
        libCom.getFieldValue(pageClientAPI, 'ResponciblePersonelNum', '', dict, true);
        dict.ResponciblePersonelNum = libCom.getListPickerValue(dict.ResponciblePersonelNum);

        libCom.getFieldValue(pageClientAPI, 'CostCenter', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'WBS', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'Network', '', dict, true);
        libCom.getFieldValue(pageClientAPI, 'ActivityNum', '', dict, true);

        return libTSEvent.ValidateTotalHoursLessThan24(pageClientAPI, dict)
            .then(libTSEvent.ValidateHoursNonZero.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateOnEditFutureDate.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateActivityTypeIfRecOrder.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateOperationIfRecOrder.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateWorkorderRequiredIfActivityType.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateAbsAttOrActivityType.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidatePersonnelNumber.bind(null, pageClientAPI, dict), null)
            .then(libTSEvent.ValidateNonWorkOrderRelatedProperties.bind(null, pageClientAPI, dict), null)
            .then(function() {
                return true;
            }, function() {
                return false;
            }); //Pass back true or false to calling action;
        //            .then(libTSEvent.ValidateReadingIsNumeric.bind(null, pageClientAPI, dict), null)

    }

    static ValidateFutureDate(pageClientAPI, dict) {
        const currentDate = new Date();
        if (currentDate > dict.HourStartDtPicker && currentDate > dict.HourEndDtPicker) {
            return Promise.resolve(true);
        } else if (currentDate < dict.HourStartDtPicker) {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/StartInFutureError.action').then(function() {
                return Promise.reject(false);
            });
        } else if (currentDate < dict.HourEndDtPicker) {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/FinishInFutureError.action').then(function() {
                return Promise.reject(false);
            });
        }
        return Promise.resolve(true);
    }


    static ValidateStartBeforeFinish(pageClientAPI, dict) {
        if (dict.HourEndDtPicker > dict.HourStartDtPicker) {
            return Promise.resolve(true);
        } else {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/FinishBeforeStartError.action').then(function() {
                return Promise.reject(false);
            });
        }

    }

    static ValidateHoursNonZero(pageClientAPI, dict) {
        if (dict.DurationPkr > 0) {
            return Promise.resolve(true);
        } else {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/ZeroHoursError.action').then(function() {
                return Promise.reject(false);
            });
        }

    }

    static ValidateOnEditFutureDate(pageClientAPI, dict) {
        const currentDate = new Date();
        if (currentDate >= dict.DatePicker) {
            return Promise.resolve(true);
        } else {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/StartInFutureError.action').then(function() {
                return Promise.reject(false);
            });
        }
    }

    static ValidateActivityTypeIfRecOrder(pageClientAPI, dict) {
        if (!libVal.evalIsEmpty(dict.RecOrderLstPkr)) {
            if (!libVal.evalIsEmpty(dict.ActivityTypeLstPkr)) {
                return Promise.resolve(true);
            } else {
                return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/ActivityTypeRequiredError.action').then(function() {
                    return Promise.reject(false);
                });
            }
        } else {
            return Promise.resolve(true);
        }
    }

    static ValidateOperationIfRecOrder(pageClientAPI, dict) {
        if (!libVal.evalIsEmpty(dict.RecOrderLstPkr)) {
            if (!libVal.evalIsEmpty(dict.OperationLstPkr)) {
                return Promise.resolve(true);
            } else {
                return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/OperationRequiredError.action').then(function() {
                    return Promise.reject(false);
                });
            }
        } else {
            return Promise.resolve(true);
        }
    }

    static ValidateWorkorderRequiredIfActivityType(pageClientAPI, dict) {
        if (!libVal.evalIsEmpty(dict.ActivityTypeLstPkr)) {
            if (!libVal.evalIsEmpty(dict.RecOrderLstPkr)) {
                return Promise.resolve(true);
            } else {
                return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/WorkOrderRequiredError.action').then(function() {
                    return Promise.reject(false);
                });
            }
        } else {
            return Promise.resolve(true);
        }
    }

    /**
     * Only one out of CostCenter, WBS, and Network is allowed
     * @param {*} pageClientAPI
     * @param {*} dict
     * @returns
     */
    static ValidateNonWorkOrderRelatedProperties(pageClientAPI, dict) {

        const isEmpty = (value) => libVal.evalIsEmpty(value);

        if (!isEmpty(dict.CostCenter)) { //if cost center is entered then WBS and Network are not allowed
            if (isEmpty(dict.WBS) && isEmpty(dict.Network) && isEmpty(dict.ActivityNum)) {
                return Promise.resolve(true);
            } else {
                return libCom.showErrorDialog(pageClientAPI, pageClientAPI.localizeText('only_one_non_workorder_entry_allowed'));
            }
        } else if (!isEmpty(dict.WBS)) {
            if (isEmpty(dict.Network) && isEmpty(dict.ActivityNum)) {
                return Promise.resolve(true);
            } else {
                return libCom.showErrorDialog(pageClientAPI, pageClientAPI.localizeText('only_one_non_workorder_entry_allowed'));
            }
        } else if (!isEmpty(dict.Network)) { //if network is entered then activity num is also required
            if (!isEmpty(dict.ActivityNum)) {
                return Promise.resolve(true);
            } else {
                return libCom.showErrorDialog(pageClientAPI, pageClientAPI.localizeText('activity_num_required_with_network'));
            }
        } else if (!isEmpty(dict.ActivityNum)) { //if activity num is entered then network is also required
            return libCom.showErrorDialog(pageClientAPI, pageClientAPI.localizeText('network_required_with_activity_num'));
        }

        //If all are empty then it is valid
        return Promise.resolve(true);

    }

    static ValidateAbsAttOrActivityType(pageClientAPI, dict) {
        if (!libVal.evalIsEmpty(dict.ActivityTypeLstPkr) || !libVal.evalIsEmpty(dict.AbsAttLstPkr)) {
            return Promise.resolve(true);
        } else {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/AbsAttRequiredError.action').then(function() {
                return Promise.reject(false);
            });
        }
    }

    static ValidatePersonnelNumber(pageClientAPI, dict) {
        if (!libVal.evalIsEmpty(dict.ResponciblePersonelNum) || !IsAnotherTechnicianSelectEnabled(pageClientAPI)) {
            return Promise.resolve(true);
        } else {
            return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/TechnicianRequiredError.action').then(function() {
                return Promise.reject(false);
            });
        }
    }

    static ValidateTotalHoursLessThan24(pageClientAPI, dict) {

        if (pageClientAPI.getClientData().SkipCrewCheck) {
            return Promise.resolve(true); //Crew validation has already been done previously
        }

        const endDate = dict.Date;
        const totalHours = libTSEvent.GetHoursForDate(pageClientAPI, endDate);
        const currentHours = libTS.getActualHours(pageClientAPI, Number(libTSDetails.TimeSheetCreateUpdateHours(pageClientAPI)));

        return totalHours.then(function(value) {
            let onCreate = libCom.IsOnCreate(pageClientAPI);
            if (onCreate && (parseFloat(value) + currentHours) <= 24.0 ) {
                return Promise.resolve(true);
            } else if (!onCreate && (parseFloat(value) - parseFloat(libTS.getActualHours(pageClientAPI, pageClientAPI.binding.Hours)) + currentHours ) <= 24.0) {
                return Promise.resolve(true);
            } else if ((parseFloat(value) + currentHours) <= 24.0) {
                return Promise.resolve(true);
            } else {
                if (pageClientAPI.getClientData().EmployeeName) {
                    return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/DailyTotalExceededPersonnelError.action').then(function() {
                        return Promise.reject(false);
                    });
                } else {
                    return pageClientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/ErrorDialogs/DailyTotalExceededError.action').then(function() {
                        return Promise.reject(false);
                    });
                }
            }
        });
    }

    /**
     * When the accumulated hours are > 24 we will warn the user and suggest they enter the time over multiple days
     * @param {*} pageClientAPI
     * @param {*} dict
     */
    static ValidateCurrentHoursLessThan24(pageClientAPI) {

        let currentHours = 0;

        if (pageClientAPI.getClientData().timeSheetInitialDuration) {
            currentHours = pageClientAPI.getClientData().timeSheetInitialDuration;
        }
        if (currentHours > 0) {
            let dynamicParams = [Math.round(100 * currentHours) / 100];
            let message = pageClientAPI.localizeText('time_exceeds_24_hours',dynamicParams);
            return libCom.showWarningDialog(pageClientAPI, message);
        }
        return Promise.resolve(true);
    }

}

export class TimeSheetLibrary {

    static isOvertime(clientAPI, coActivityType) {
        let otFields = this.getOvertimeActivityTypes(clientAPI);
        return otFields.split(',').includes(coActivityType);
    }


    static isRegular(clientAPI, coActivityType) {
        let otTypes = this.getOvertimeActivityTypes(clientAPI);
        let nonWorkingTypes = this.getNonWorkingActivityTypes(clientAPI);
        return !otTypes.split(',').includes(coActivityType) && !nonWorkingTypes.split(',').includes(coActivityType) && !libVal.evalIsEmpty(coActivityType);
    }

    static getOvertimeActivityTypes(context) {
        const otTypes = libCom.getAppParam(context, 'TIMESHEET', 'OvertimeActivityTypes');
        return otTypes;
    }

    static getTimesheetCompletionHours(context) {
        const hours = libCom.getAppParam(context, 'TIMESHEET', 'CompletionHours');
        if (libCom.isDefined(hours)) {
            return hours;
        } else {
            return 8;
        }
    }

    static getNonWorkingActivityTypes(context) {
        return libCom.getAppParam(context, 'TIMESHEET', 'NonWorkingActivityTypes');
    }

    static isNonWorking(clientAPI, coActivityType) {
        let nonWorkingTypes = this.getNonWorkingActivityTypes(clientAPI);
        return nonWorkingTypes.split(',').includes(coActivityType);
    }

    /**
     * Get formatted CatsTimesheetOverviewRows entity set
     * so that we can query the backend
     *
     * @param {*} context
     * @param {String} date Date string
     * @returns {String} Same date string but formatted differently as stated above.
     */
    static getEntitySetWithBackendFormat(context, date) {
        let odataDate = new ODataDate(date);
        let dateStr = odataDate.queryString(context, 'date', 6);
        return `CatsTimesheetOverviewRows(${dateStr})`;
    }
    /**
     * Filter should restrict timesheet list to previous time period to today.
     *
     * @param {*} clientAPI
     */
    static TimeSheetEntriesListQueryOptions(clientAPI) {

        let date = new Date();
        // Add offset to next Sunday
        let offset = 7 - date.getDay();
        date.setDate(date.getDate() + offset);
        let odataDate = new ODataDate(date);

        return `$orderby=Date desc&$filter=Date le ${odataDate.queryString(clientAPI, 'date')}`;
    }

    static TimeSheetEntryAttendAbsenceQueryOptions(clientAPI) {

        return libCom.getUserPersArea(clientAPI).then(persAreaResult => {
            return libCom.getUserPersSubArea(clientAPI).then(persSubAreaResult => {
                const filter = "$filter=PersonnelArea eq '" + persAreaResult + "' and PersonnelSubarea eq '" + persSubAreaResult + "'&$orderby=AttendanceType asc";
                /**Implementing our Logger class*/
                Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), filter);
                return filter;
            });
        });
    }

    static GetWorkCenterFromObject(pageProxy, readLink) {
        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '')
            .then(function(workorders) {
                const workOrder = workorders.getItem(0);
                const workCenterInternalId = workOrder.WorkCenterInternalId;
                if (!libVal.evalIsEmpty(workCenterInternalId)) {
                    return workCenterInternalId;
                } else if (!libVal.evalIsEmpty(workOrder.MainWorkCenter) && !libVal.evalIsEmpty(workOrder.MainWorkCenterPlant)) {
                    return {
                        mainWorkCenter: workOrder.MainWorkCenter,
                        mainWorkCenterPlant: workOrder.MainWorkCenterPlant,
                    };
                } else {
                    return undefined;
                }
            });

    }

    static ShouldEnableSubOperations(pageProxy) {
        let operation = libTSDetails.TimeSheetCreateUpdateOperation(pageProxy);

        if (operation) {
            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', operation + '/SubOperations', [], '').then(function(subOps) {
                return !libVal.evalIsEmpty(subOps);
            });
        }
        return Promise.resolve(false);
    }

    /**
     * Duration control is rounding to nearest hundredth.  This returns the actual value without the rounding for display accuracy on client
     */
    static getActualHours(context, roundedHours) {

        const intervalInMinutes = libCom.getAppParam(context, 'TIMESHEET', 'CATSMinutesInterval');

        let interval = parseFloat(intervalInMinutes / 60).toPrecision(16); // The Duration control requires precision upto 16 decimal points
        let hours = Math.floor(roundedHours);
        let minutesDecimal = roundedHours - hours;
        let minutes = Math.round(minutesDecimal / interval) * interval;

        let totalTime = hours + minutes;

        return totalTime;
    }


    /**
     * updates the workcenter in TimeSheetEntryCreateUpdate page
     */

    static updateWorkCenter(context, workCenter) {
        const filterQuery = !workCenter || typeof workCenter === 'string' ? `$filter=WorkCenterId eq '${workCenter}'` : `$filter=ExternalWorkCenterId eq '${workCenter.mainWorkCenter}' and PlantId eq '${workCenter.mainWorkCenterPlant}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filterQuery).then(result => {
            if (result && result.getItem(0)) {
                let costCenter = result.getItem(0).CostCenter;
                let controllingArea = result.getItem(0).ControllingArea;
                let externalWorkCenterId = result.getItem(0).ExternalWorkCenterId;
                let filter;

                if (controllingArea) {
                    filter = `$filter=CostCenter eq '${costCenter}' and ControllingArea eq '${controllingArea}'&$orderby=ActivityType`;
                } else {
                    filter = `$filter=CostCenter eq '${costCenter}'&$orderby=ActivityType`;
                }

                let activityListPickerProxy = libCom.getControlProxy(context,'ActivityTypeLstPkr');
                let activitySpecifier = activityListPickerProxy.getTargetSpecifier();
                activitySpecifier.setEntitySet('COActivityTypes');
                activitySpecifier.setReturnValue('{ActivityType}');
                activitySpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                activitySpecifier.setQueryOptions(filter);
                activityListPickerProxy.setEditable(true);

                let workCenterProxy = libCom.getControlProxy(context, 'WorkCenterLstPkr');
                workCenterProxy.setValue(externalWorkCenterId);

                return activityListPickerProxy.setTargetSpecifier(activitySpecifier);
            }
            return Promise.resolve(true);
        });
    }

    static setOperationSpecifier(picker, entity, filter) {
        let specifier = picker.getTargetSpecifier();
        specifier.setEntitySet(entity);
        specifier.setReturnValue('{@odata.readLink}');
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setQueryOptions(filter);
        specifier.setDisplayValue('{{#Property:OperationNo}} - {{#Property:OperationShortText}}');
        return picker.setTargetSpecifier(specifier);
    }

    static setSubOperationSpecifier(picker, entity, filter) {
        let specifier = picker.getTargetSpecifier();
        specifier.setEntitySet(entity);
        specifier.setReturnValue('{@odata.readLink}');
        specifier.setService('/SAPAssetManager/Services/AssetManager.service');
        specifier.setQueryOptions(filter);
        specifier.setDisplayValue('{{#Property:SubOperationNo}} - {{#Property:OperationShortText}}');
        return picker.setTargetSpecifier(specifier);
    }
  
    static updateActivityType(context) {
        let operation = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:OperationLstPkr/#Value'));
        let workOrder = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:RecOrderLstPkr/#Value'));

       
        if (!libVal.evalIsEmpty(workOrder) && !libVal.evalIsEmpty(operation)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', operation, [], '$select=ActivityType').then(function(data) {
                if (data.getItem(0)) {
                    const activityType = data.getItem(0)?.ActivityType || '';
                    let control = libCom.getControlProxy(context, 'ActivityTypeLstPkr');
                    return control.setValue(activityType); 
                } else {
                    return Promise.resolve(true);
                }             
            });
        } else {    
            return Promise.resolve(true);
        }
    }
}

export class TimeSheetDetailsLibrary {

    static TimeSheetEntryDetailsOTHours(pageClientAPI) {
        let date = libCom.getTargetPathValue(pageClientAPI, '#Property:Date');
        //Set defaults

        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], "$filter=Date eq datetime'" + date + "'")
            .then(function(timeEntries) {
                let otHours = 0.0;
                timeEntries.forEach(function(element) {
                    if (libTS.isOvertime(pageClientAPI, element.ActivityType)) {
                        otHours += libTS.getActualHours(pageClientAPI, element.Hours);
                    }
                });
                return libCom.toTwoPlaces(pageClientAPI, otHours);
            });
    }

    static TimeSheetEntryDetailsRegularHours(pageClientAPI) {
        let date = libCom.getTargetPathValue(pageClientAPI, '#Property:Date');
        //Set defaults

        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], "$filter=Date eq datetime'" + date + "'")
            .then(function(timeEntries) {
                let regHours = 0.0;
                timeEntries.forEach(function(element) {
                    if (libTS.isRegular(pageClientAPI, element.ActivityType)) {
                        regHours += libTS.getActualHours(pageClientAPI, element.Hours);
                    }
                });
                return libCom.toTwoPlaces(pageClientAPI, regHours);

            });
    }

    static TimeSheetEntryDetailsNonWorkingHours(pageClientAPI) {
        let date = libCom.getTargetPathValue(pageClientAPI, '#Property:Date');
        //Set defaults

        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], "$filter=Date eq datetime'" + date + "'")
            .then(function(timeEntries) {
                let hours = 0.0;
                timeEntries.forEach(function(element) {
                    if (!libTS.isRegular(pageClientAPI, element.ActivityType) && !libTS.isOvertime(pageClientAPI, element.ActivityType)) {
                        hours += libTS.getActualHours(pageClientAPI, element.Hours);
                    }
                });
                return libCom.toTwoPlaces(pageClientAPI, hours);

            });
    }

    static TimeSheetEntryDetailsTotalHours(context, usePersonnelNum='') {
        let date = context.binding.Date;
        //Set defaults
        const personnelNumFilter = usePersonnelNum.length ? `PersonnelNumber eq '${usePersonnelNum}' and ` : '';
        const filter = `$filter=${personnelNumFilter}Date eq datetime'${date}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], filter)
            .then(function(timeEntries) {
                let hours = 0.0;
                timeEntries.forEach(function(element) {
                    hours += libTS.getActualHours(context, element.Hours);
                });
                return hours;

            });

    }
    static TimeSheetTotalHoursWithDate(pageClientAPI, date, usePersonnelNum='') {
        // adding personel num to the filter if it was passed
        const personnelNumFilter = usePersonnelNum.length ? `PersonnelNumber eq '${usePersonnelNum}' and ` : '';
        const filter = `$filter=${personnelNumFilter}Date eq datetime'${date}'`;
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], filter)
            .then(function(timeEntries) {
                let hours = 0.0;
                timeEntries.forEach(function(element) {
                    hours += libTS.getActualHours(pageClientAPI, element.Hours);
                });
                return hours;

            });

    }
    static TimeSheetEntryDetailsFormat(sectionProxy) {
        const section = sectionProxy.getName();
        let value = '';

        if (section === 'TimeEntries') {
            const property = sectionProxy.getProperty();

            switch (property) {
                case 'Title': {//Hours
                    let hours = sectionProxy.binding.Hours;

                    let hoursNum = sectionProxy.formatNumber(hours,null,{maximumFractionDigits:2, minimumFractionDigits : 0});
                    let hoursTextLocal = sectionProxy.localizeText('hours_suffix');
                    let hrsText = hoursNum + ' ' + hoursTextLocal;

                    value = hrsText;
                    break;
                }
                case 'Subhead': {//Type (formatted) Working/Non Working
                    let coActivityType = sectionProxy.binding.ActivityType;
                    if (libTS.isRegular(sectionProxy, coActivityType) || libTS.isOvertime(sectionProxy, coActivityType)) {
                        if (libTS.isRegular(sectionProxy, coActivityType)) {
                            value = sectionProxy.localizeText('regular_hours');
                            break;
                        } else {
                            value = sectionProxy.localizeText('overtime_hours');
                            break;
                        }
                    } else {
                        value = sectionProxy.localizeText('non_working_hours');
                        break;
                    }
                }
                case 'Description': {//Job or sub type
                    const jobText = sectionProxy.localizeText('workorder');
                    const jobStepText = sectionProxy.localizeText('operation');
                    const jobSubStepText = sectionProxy.localizeText('suboperation');

                    const orderId = sectionProxy.binding.RecOrder;
                    const jobStep = sectionProxy.binding.Operation;
                    const jobSubStep = sectionProxy.binding.SubOperation;

                    if (orderId) {
                        let text = jobText + ' ' + orderId;
                        if (jobStep) {
                            text += '\n' + jobStepText + ' ' + jobStep;
                            if (jobSubStep) {
                                text += ' - ' + jobSubStepText + ' ' + jobSubStep;
                            }
                        }
                        value = text;
                        break;
                    } else {
                        break;
                    }
                }
                default:
                    break;
            }
        }

        return value;
    }

    static TimeSheetCreateUpdateDate(clientAPI, mDate = undefined) {
        let entryDate;
        if (mDate !== undefined) {
            entryDate = new ODataDate(mDate);
        } else if (!libVal.evalIsEmpty(clientAPI.getBindingObject()) && !libVal.evalIsEmpty(clientAPI.getBindingObject().Date)) {
            let today = new Date();
            let hours = today.getHours();
            let minutes = today.getMinutes();
            if (hours<10) hours = '0' + hours;
            if (minutes<10) minutes = '0' + minutes;
            let timestring = hours + ':' + minutes + ':00';
            entryDate = new ODataDate(clientAPI.getBindingObject().Date, timestring);
        } else {
            //The date picker will have the current time so no need to add the offset
            let dateFieldValue = libCom.getFieldValue(clientAPI, 'HourEndDtPicker');
            entryDate = new ODataDate(dateFieldValue ? dateFieldValue : null);
        }

        return entryDate.toLocalDateString();
    }

    static TimeSheetCreateUpdateHours(clientAPI) {
        let elapsed = libCom.getFieldValue(clientAPI, 'DurationPkr');
        return elapsed.toString();
    }

    static TimeSheetEditUpdateHours(clientAPI) {
        let hours = libCom.getFieldValue(clientAPI, 'DurationPkr');
        return hours.toString();
    }

    static TimeSheetSelectedPersonelNumber(clientAPI) {
        return libCom.getListPickerValue(libCom.getFieldValue(clientAPI, 'ResponciblePersonelNum'));
    }

    static TimeSheetCreateUpdateAttAbs(clientAPI) {

        let aaType = libCom.getTargetPathValue(clientAPI, '#Control:AbsAttLstPkr/#Value');
        return libCom.getListPickerValue(aaType);
    }

    static TimeSheetCreateUpdateAttAbsTypeIsEditable(clientAPI) {
        return libCom.getEntitySetCount(clientAPI,'AttendanceTypes', libTS.TimeSheetEntryAttendAbsenceQueryOptions(clientAPI)).then(count => {
            return count > 0;
        });
    }

    static TimeSheetCreateUpdateActivityType(clientAPI) {

        let activityType = libCom.getTargetPathValue(clientAPI, '#Control:ActivityTypeLstPkr/#Value');
        return libCom.getListPickerValue(activityType);
    }

    static TimeSheetCreateUpdateActivityTypeIsEditable(clientAPI) {
       return libCom.getEntitySetCount(clientAPI,'COActivityTypes', libTSActivityTypeCostCenter(clientAPI)).then(count => {
            return count > 0;
        });
    }

    static TimeSheetCreateUpdateOperation(clientAPI) {

        let operation = libCom.getTargetPathValue(clientAPI, '#Control:OperationLstPkr/#Value');
        return libCom.getListPickerValue(operation);
    }


    static TimeSheetCreateUpdateSubOperation(clientAPI) {

        let subOp = libCom.getTargetPathValue(clientAPI, '#Control:SubOperationLstPkr/#Value');
        return libCom.getListPickerValue(subOp);
    }

    static TimeSheetCreateUpdateWorkCenter(clientAPI) {

        let workcenter = libCom.getTargetPathValue(clientAPI, '#Control:WorkCenterLstPkr/#Value');
        return libCom.getListPickerValue(workcenter);
    }

    static TimeSheetListIconImages(pageProxy) {

        let datetime = pageProxy.binding.Date;
        let local;

        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', [], "$filter=Date eq datetime'" + datetime + "'")
            .then(function(timeEntries) {
                local = false;
                timeEntries.forEach(function(element) {
                    if (!local && element['@sap.isLocal']) {
                        local = true;
                    }
                });
                return local;
            }, error => {
                /**Implementing our Logger class*/
                Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), error);
                return false;
            });

    }
}

export class TimeSheetControlsLibrary {

    static UpdateDuration(pageProxy) {

        if (pageProxy.getClientData().LOADED) {
            if (!pageProxy.getClientData().UPDATOR) {
                pageProxy.getClientData().UPDATOR = 'HOURS';
            }

            if (pageProxy.getClientData().UPDATOR === 'HOURS') {
                try {
                    const start = libCom.getTargetPathValue(pageProxy, '#Control:HourStartDtPicker/#Value');
                    const end = libCom.getTargetPathValue(pageProxy, '#Control:HourEndDtPicker/#Value');
                    const elapsed = (end - start) / 3600000.0;
                    const epsilon = 1 / 7200;
                    if (elapsed > epsilon) {
                        let durationControl = pageProxy.getControl('FormCellContainer').getControl('DurationPkr');
                        durationControl.setValue(elapsed);
                    }
                } catch (err) {
                    /**Implementing our Logger class*/
                    Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), 'Error seting duration ${err}');
                }
            } else {
                pageProxy.getClientData().UPDATOR = '';
            }

        }

    }

    static UpdateHoursFromDuration(pageProxy) {

        if (pageProxy.getClientData().LOADED) {


            if (!pageProxy.getClientData().UPDATOR) {
                pageProxy.getClientData().UPDATOR = 'DURATION';
            }

            if (pageProxy.getClientData().UPDATOR === 'DURATION') {
                const start = libCom.getTargetPathValue(pageProxy, '#Control:HourStartDtPicker/#Value');
                let durationControl = pageProxy.getControl('FormCellContainer').getControl('DurationPkr');
                let endControl = pageProxy.getControl('FormCellContainer').getControl('HourEndDtPicker');

                let newDate = new Date(start);
                let endDate = new Date(newDate.setTime(newDate.getTime() + durationControl.getValue() * 3600000));
                endControl.setValue(endDate);
            } else {
                pageProxy.getClientData().UPDATOR = '';
            }

        }

    }

}

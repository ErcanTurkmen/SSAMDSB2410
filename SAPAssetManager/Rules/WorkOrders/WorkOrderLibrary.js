import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import assnType from '../Common/Library/AssignmentType';
import ConstantsLibrary from '../Common/Library/ConstantsLibrary';
import libWoMobile from './MobileStatus/WorkOrderMobileStatusLibrary';
import DocumentLibrary from '../Documents/DocumentLibrary';
import libControlDescription from '../Common/Controls/DescriptionNoteControl';
import Logger from '../Log/Logger';
import { UserPreferenceLibrary as libUserPref } from '../UserPreferences/UserPreferencesLibrary';
//This reference to itself is necessary because promises lose context when running these functions,
//causing sub-rules to be unaccessable when using "this." syntax
import { WorkOrderLibrary as libWo, WorkOrderControlsLibrary as libWoControls, PrivateMethodsLibrary as libPrivate } from './WorkOrderLibrary';
import markedJobCreateUpdateOnCommit from '../MarkedJobs/MarkedJobCreateUpdateOnCommit';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import OperationMobileStatus from '../MobileStatus/OperationMobileStatus';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import ODataDate from '../Common/Date/ODataDate';
import PersonaLibrary from '../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from './ListView/WorkOrdersFSMQueryOption';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import { PartnerFunction } from '../Common/Library/PartnerFunction';
import { OperationLibrary as libOperations } from './Operations/WorkOrderOperationLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import WorkOrderCreateUpdatePrioritiesList from './CreateUpdate/WorkOrderCreateUpdatePrioritiesList';
import WorkOrderCreateGetDefaultOrderType from './CreateUpdate/WorkOrderCreateGetDefaultOrderType';
import TodaysServiceOrderDate from '../ServiceOrders/TodaysServiceOrderDate';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import SoldToPartyLstPkrIsEditable from '../ServiceOrders/CreateUpdate/SoldToPartyLstPkrIsEditable';
import IsFromOnlineFlocCreate from '../Common/IsFromOnlineFlocCreate';
import FSMOverviewHelpers from '../OverviewPage/Helpers/FSMOverviewHelpers';


/**
 * Contains all common Work Order related method, except CreateUpdate page event and contorl method;
 * NOTE: For CreateUpdate related Event and Control please use WorkOrderEventLibrary and WorkWorkControlsLibrary
 */
export class WorkOrderLibrary {

    /**
     * Set FollowUpFlagPage variable
     * @param {IPageProxy} context
     */
    static setFollowUpFlagPage(context) {
        if (context._page) {
            libCommon.setStateVariable(context, 'FollowUpFlagPage', libCommon.getPageName(context));
        } else {
            libCommon.setStateVariable(context, 'FollowUpFlagPage', true);
        }
    }

    /**
     * Get FollowUpFlagPage variable
     * @param {IPageProxy} context
     * @return {string|undefined}
     */
    static getFollowUpFlagPage(context) {
        return libCommon.getStateVariable(context, 'FollowUpFlagPage');
    }

    /**
     * Remove FollowUpFlagPage variable
     * @param {IPageProxy} context
     */
    static removeFollowUpFlagPage(context) {
        libCommon.removeStateVariable(context, 'FollowUpFlagPage');
    }

    /**
     * Set the ChangeSet flag
     * @param {IPageProxy} context
     * @param {boolean} FlagValue
     */
    static setFollowUpFlag(context, FlagValue) {
        libCommon.setStateVariable(context, 'OnFollowUpWorkOrder', FlagValue, libWo.getFollowUpFlagPage(context));
    }

    /**
     * gets the 'OnFollowUpWorkOrder'
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     *
     * @memberof WorkOrderLibrary
     */
    static getFollowUpFlag(context) {
        const page = libWo.getFollowUpFlagPage(context);

        if (!page) {
            return false;
        }
        if (page === true) {
            return true;
        }

        let result = libCommon.getStateVariable(context, 'OnFollowUpWorkOrder', page);
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    /**
     * Set the FollowOn flag
     * @param {IPageProxy} context
     * @param {boolean} FlagValue
     */
    static setFollowOnFlag(context, FlagValue) {
        libCommon.setStateVariable(context, 'OnFollowOnWorkOrder', FlagValue, libWo.getFollowUpFlagPage(context));
    }

    /**
     * gets the 'OnFollowOnWorkOrder'
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     *
     * @memberof WorkOrderLibrary
     */
    static getFollowOnFlag(context) {
        const page = libWo.getFollowUpFlagPage(context);

        if (!page) {
            return false;
        }

        let result = libCommon.getStateVariable(context, 'OnFollowOnWorkOrder', page);
        if (!result && page === true) {
            return true;
        }
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    /**
     * Gets the count of High and Very High Workorders
     */
    static highPriorityOrdersCount(sectionProxy) {
        const queryOptions = libWo.attachWorkOrdersFilterByAssgnTypeOrWCM(sectionProxy, libWo.getFilterForHighPriorityWorkorders(sectionProxy));
        return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOptions);
    }

    /**
     * Gets the count of work orders with exact status
     * @param {IClientAPI} sectionProxy
     * @param {string} status
     * @param {{lowerBound: Date, upperBound: Date}} dates
     * @param {string} field
     * @return {number}
     */
    static statusOrdersCount(sectionProxy, status, dates, field) {
        return this.statusOrdersFilter(sectionProxy, status, dates, field).then(filter => {
            return sectionProxy.count(
                '/SAPAssetManager/Services/AssetManager.service',
                'MyWorkOrderHeaders',
                libWo.attachWorkOrdersFilterByAssgnTypeOrWCM(sectionProxy, filter),
            );
        });
    }

    /**
    * Provides filter query for the service orders with exact status and date
    * @param {IClientAPI} sectionProxy
    * @param {string} status
    * @param {{lowerBound: Date, upperBound: Date}} dates
    * @param {string} field
    * @return {string}
    */
    static statusOrdersFilter(sectionProxy, status, dates, field) {
        return WorkOrdersFSMQueryOption(sectionProxy).then(types => {
            return this.dateOrdersFilter(sectionProxy, dates, field).then(dateFilter => {
                let queryOption = `$filter=OrderMobileStatus_Nav/MobileStatus eq '${status}' and ${dateFilter}`;

                if (!libVal.evalIsEmpty(types)) {
                    queryOption += ' and ' + types;
                }

                return queryOption;
            });

        });
    }

    /**
    * Gets the actual date from ActualDate state variavle if it exists
    * @param {IClientAPI} sectionProxy
    * @returns {{lowerBound: Date, upperBound: Date}}
    */
    static getActualDates(sectionProxy) {
        let dates = libCommon.getStateVariable(sectionProxy, 'ActualDates');
        let isFST = PersonaLibrary.isFieldServiceTechnician(sectionProxy);
        if (!dates && isFST) {
            // taking default date from one place for all FST persona
            // Demo conponent has different flow of getting default date
            // so we need to get it from TodaysServiceOrderDate, now date.now
            const defaultDateISO = TodaysServiceOrderDate(sectionProxy);
            if (defaultDateISO) {
                const selectedDefaultVal = FSMOverviewHelpers.defaultPeriodValue(sectionProxy);
                return FSMOverviewHelpers.getBoundsFromSelectedValue(sectionProxy, selectedDefaultVal, defaultDateISO);
            }
        }
        return dates || this.getBoundsFromDate(new Date());
    }

    /**
     * @param {Date} date
     * @returns {{lowerBound: Date, upperBound: Date}}
     */
    static getBoundsFromDate(date) {
        const currentDate = new Date(new Date(date).setHours(0, 0, 0, 0));
        return {
            lowerBound: currentDate,
            upperBound: currentDate,
        };
    }

    /**
     * @param {{lowerBound: Date, upperBound: Date}} dates
     * @returns {{currentDate: ODataDate, startDate: ODataDate, endDate: ODataDate}}
     */
    static getFilterDatesFromBounds(dates) {
        //There are a couple of reasons why the below code is needed.
        //First, the backend provides the date and time in separate fields and there is no way to do a date comparison query by using both fields.
        //Second, the date and time provided by the backend is in the backend timezone so we need to convert that to the local timezone
        //So, first we will gather operations by using range of 1 day before and 1 day after the selected day so it covers all timezones
        //Then, we will take the date and time of the order/operation and create a date object in the current timezone
        //Then, take this date and see if it falls into the selected day.
        //Currently lower bound is responsible for sart and current date. Everything that is below it must be filtered in OperationsFilter/WOfilter functions
        //upper bound is responsible for end date. If we need one day filter - upperBound should be equal lowerBound
        //in other cases it would be presented as a time period filter

        const { lowerBound, upperBound } = dates;
        const currentDate = new ODataDate(lowerBound);

        const oneDayBack = (new Date(lowerBound)).setDate(lowerBound.getDate() - 1);
        const startDate = new ODataDate(oneDayBack);

        const oneDayAhead = (new Date(upperBound)).setDate(upperBound.getDate() + 1);
        const endDate = new ODataDate(oneDayAhead);

        return {
            currentDate,
            startDate,
            endDate,
        };
    }

    /**
     * Returns the filter values for actual date
     * @param {IClientAPI} sectionProxy
     * @param {{lowerBound: Date, upperBound: Date}} dates
     * @param {string} field
     * @return {string}
     */
    static dateOperationsFilter(sectionProxy, dates, field) {
        const { currentDate, startDate, endDate } = this.getFilterDatesFromBounds(dates);

        let query = `$filter=${field} ge ${startDate.queryString(sectionProxy, 'date')} and ${field} le ${endDate.queryString(sectionProxy, 'date')}`;
        return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], libOperations.attachOperationsFilterByAssgnTypeOrWCM(sectionProxy, query)).then(operations => {
            let todayOperations = [];

            if (operations.length > 0) {
                for (let i = 0; i < operations.length; i++) {
                    let operationRecord = operations.getItem(i);
                    let operationStartDate = new ODataDate(operationRecord[field]);

                    if (operationStartDate.date() >= currentDate.date() && operationStartDate.date() < endDate.date()) {
                        todayOperations.push(`(OrderId eq '${operationRecord.OrderId}' and OperationNo eq '${operationRecord.OperationNo}')`);
                    }
                }
            }

            return todayOperations.length > 0 ? `(${todayOperations.join(' or ')})` : '';
        });
    }

    /**
     * Returns the filter values for actual date
     * @param {IClientAPI} sectionProxy
     * @param {{lowerBound: Date, upperBound: Date}} dates
     * @param {string} field
     * @return {string}
     */
    static dateOrdersFilter(sectionProxy, dates, field) {
        const { currentDate, startDate, endDate } = this.getFilterDatesFromBounds(dates);

        let query = `$filter=${field} ge ${startDate.queryString(sectionProxy, 'date')} and ${field} le ${endDate.queryString(sectionProxy, 'date')}`;
        return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], query).then(orders => {
            let todayOrders = [];

            if (orders.length > 0) {
                for (let i = 0; i < orders.length; i++) {
                    let orderRecord = orders.getItem(i);
                    let orderStartDate = new ODataDate(orderRecord[field]);

                    if (orderStartDate.date() >= currentDate.date() && orderStartDate.date() < endDate.date()) {
                        todayOrders.push(`(OrderId eq '${orderRecord.OrderId}')`);
                    }
                }
            }

            return todayOrders.length > 0 ? `(${todayOrders.join(' or ')})` : '';
        });
    }


    /**
     * Gets the filter for the query for High and Very High Workorders.
     */
    static getFilterForHighPriorityWorkorders(context) {
        libCommon.setStateVariable(context, 'CustomListFilter', "(Priority eq '1' or  Priority eq '2')");
        return "$filter=(Priority eq '1' or  Priority eq '2')";
    }

    /**
     * Checks to see if the work order from context is marked or not.
     * @param {*} pageClientAPI
     * @return true if work order is marked.
     */
    static isMarkedWorkOrder(pageProxy) {
        let woId = libUserPref.getPreferenceName(pageProxy);
        woId = woId.replace(/'/g, "''");
        let queryoption = `$filter=PreferenceName eq '${woId}' and PreferenceGroup eq 'MARKED_JOBS' and PreferenceValue eq 'true'&$orderby=PreferenceName`;
        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], queryoption).then(markedJobs => {
            return !libVal.evalIsEmpty(markedJobs);
        });
    }
    /**
    * Get Prioirty of the Work Order context
    * @param context
    * @return Priority Description if not null else empty space string
    */
    static getWorkOrderPriorityFormat(context) {
        let binding = context.getBindingObject();
        if (binding && binding.WOPriority && binding.WOPriority.PriorityDescription) {
            return binding.WOPriority.PriorityDescription;
        } else if (binding?.PriorityDescription) {
            return binding?.PriorityDescription;
        }
        return ' ';
    }

    /**
     * Gets the query options for work order list view.
     */
    static getWorkOrdersListViewQueryOptions(context) {
        let queryBuilder = context.dataQueryBuilder();
        queryBuilder.select('*,OrderMobileStatus_Nav/*,WODocuments/DocumentID,WOPartners/Employee_Nav/EmployeeName,WOPartners/PartnerFunction,MarkedJob/PreferenceValue,WOPriority/PriorityDescription,WOPriority/Priority');
        queryBuilder.expand('WODocuments,WODocuments/Document,OrderMobileStatus_Nav/OverallStatusCfg_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav');
        queryBuilder.orderBy('Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus');
        return queryBuilder;
    }

    /**
     * Gets the High and Very High Workorders for the List view.
     */
    static getHighPriorityWorkOrdersQueryOptions(context) {
        let queryBuilder = context.dataQueryBuilder();
        queryBuilder.select('WOPartners/PartnerFunction,WOPartners/Employee_Nav/EmployeeName,CostCenter,WODocuments/DocumentID,ObjectKey,MaintenanceActivityType,OrderType,Priority,DueDate,HeaderEquipment,OrderDescription,OrderId,MainWorkCenter,MainWorkCenterPlant,PlanningPlant,OrderMobileStatus_Nav/MobileStatus,OrderMobileStatus_Nav/CreateUserGUID,WOPriority/PriorityDescription,WOPriority/Priority,MarkedJob/PreferenceValue,ObjectNumber');
        queryBuilder.filter("(Priority eq '1' or  Priority eq '2')");
        queryBuilder.expand('WODocuments,WODocuments/Document,OrderMobileStatus_Nav/OverallStatusCfg_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,WOGeometries,WOGeometries/Geometry,HeaderLongText,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav');
        queryBuilder.orderBy('Priority,DueDate,OrderId');
        return queryBuilder;
    }

    static getWorkOrderDetailsNavQueryOption(context) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
            return '$select=*,WOPartners/PartnerFunction,FunctionalLocation/FuncLocDesc,OrderMobileStatus_Nav/*&$expand=WODocuments,OrderMobileStatus_Nav/OverallStatusCfg_Nav,FunctionalLocation,Operations,Operations/SubOperations,WOGeometries/Geometry,MarkedJob,Confirmations,UserTimeEntry_Nav,WOObjectList_Nav,WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav,EAMChecklist_Nav';
        } else {
            return '$select=*,WOPartners/PartnerFunction,FunctionalLocation/FuncLocDesc,OrderMobileStatus_Nav/*&$expand=WODocuments,OrderMobileStatus_Nav/OverallStatusCfg_Nav,FunctionalLocation,Operations,Operations/SubOperations,WOGeometries/Geometry,MarkedJob,Confirmations,UserTimeEntry_Nav,WOObjectList_Nav,WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav';
        }
    }

    /**
     * Gets the query option filter used to get all the marked jobs from UserPreferences EntitySet
     */
    static getMarkedJobsQueryOptionsFilter() {
        return "$filter=(PreferenceGroup eq 'MARKED_JOBS' and PreferenceValue eq 'true')&$orderby=PreferenceName";
    }

    /**
     * Query option filter used to retrieve all reminders from UserPreferences EntitySet.
     */
    static getRemindersQueryOptionsFilter() {
        return "$filter=(PreferenceGroup eq 'REMINDERS')&$orderby=PreferenceName";
    }

    /**
     * Gets all the UserPreferences properties for a given Job.
     * @param pageClientAPI Page Client API
     * @param orderId ID of the Job for which you want to get the UserPreferences info.
     * @return Promise that holds the results in an array.
     */
    static getUserPreferences(pageClientAPI, orderId) {
        let queryOptions = '$orderby=PreferenceName';
        if (!libVal.evalIsEmpty(orderId)) {
            queryOptions += "&$filter=(PreferenceName eq '" + orderId + "')";
        }
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], queryOptions);
    }

    /**
     * Gets the query option filter used to get all the Follow On Work Orders for a base order
     */
    static WorkOrdersDetailsFollowOnQueryOption(context) {
        let queryBuilder = context.dataQueryBuilder();
        queryBuilder.expand('WODocuments,WODocuments/Document,OrderMobileStatus_Nav/OverallStatusCfg_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav');
        queryBuilder.orderBy('Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus');

        let searchString = context.searchString;
        if (searchString) {
            let searchByProperties = ['OrderId', 'WOPriority/PriorityDescription', 'OrderDescription'];
            ModifyListViewSearchCriteria(context, 'MyWorkOrderHeader', searchByProperties);
            queryBuilder.filter(libCommon.combineSearchQuery(searchString, searchByProperties));
        }

        if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            let reference = context.binding.OrderId;
            queryBuilder.filter(`ReferenceOrder eq '${reference}'`);
            return queryBuilder;
        } else {
            return queryBuilder;
        }
    }
    /**
     * Get work orders filter value for WCM persona
     * @returns {String}
     */
    static getWCMWorkOrdersFilter(context) {
        return `(OrderMobileStatus_Nav/SystemStatusCode ne null and substringof('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/WorkClearanceManagement.global').getValue()}', OrderMobileStatus_Nav/SystemStatusCode))`;
    }

    /**
     * Get work orders filter value by assignment type
     * @param {IClientAPI} context MDK context
     * @returns {String}
     */
    static getWorkOrdersFilterByAssignmentType(context) {
        try {
            if (PersonaLibrary.isWCMOperator(context)) {
                return '';
            }

            const assignmentTypeValue = libCommon.getWorkOrderAssignmentType(context, true);
            const filters = [];
            assignmentTypeValue.split(',').forEach(assignmentType => {
                let filter = '';

                switch (assignmentType) {
                    case '1':
                        filter = `((WOPartners/any(partner:partner/PartnerFunction eq 'VW' and (partner/PersonnelNum eq '${libCommon.getPersonnelNumber()}' or partner/Partner eq '${libCommon.getPersonnelNumber()}'))) or sap.islocal())`;
                        break;
                    case '5':
                        filter = `PlannerGroup eq '${libCommon.getDefaultUserParam('USER_PARAM.IHG')}'`;
                        break;
                    case '7':
                        filter = `(WOPartners/any(partner:partner/PartnerFunction eq 'VU' and partner/Partner eq '${libCommon.getSapUserName(context)}') or sap.islocal())`;
                        break;
                    case '8':
                        filter = `MainWorkCenter eq '${assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'MainWorkCenter')}'`;
                        break;
                }

                if (!libVal.evalIsEmpty(filter)) {
                    filters.push(filter);
                }
            });

            if (libVal.evalIsEmpty(filters)) {
                return '';
            } else {
                return filters.length === 1 ? filters[0] : `(${filters.join(' or ')})`;
            }
        } catch (err) {
            console.log(err);
            return '$top=0';
        }
    }

    /**
     * Get work orders filter value for WCM persona or by assignment type
     * @param {IClientAPI} context MDK context
     * @returns {String}
     */
    static getWorkOrdersFilterByAssgnTypeOrWCM(context) {
        return PersonaLibrary.isWCMOperator(context) ? this.getWCMWorkOrdersFilter(context) : this.getWorkOrdersFilterByAssignmentType(context);
    }

    /**
     * Attach work orders filter to query options
     * @param {IClientAPI} context MDK context
     * @param {String|DataQueryBuilder} queryOptions query options
     * @param {Boolean} useQueryBuilder should be true in case when we use DataQueryBuilder
     * @returns {String|DataQueryBuilder}
     */
    static attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions = '', useQueryBuilder = false) {
        try {
            const filter = this.getWorkOrdersFilterByAssgnTypeOrWCM(context);

            if (libVal.evalIsEmpty(filter)) {
                return queryOptions;
            }

            if (useQueryBuilder) {
                if (queryOptions.hasFilter) {
                    queryOptions.filter().and(filter);
                } else {
                    queryOptions.filter(filter);
                }

                return queryOptions;
            } else {
                return libCommon.attachFilterToQueryOptionsString(queryOptions, filter);
            }
        } catch (err) {
            console.log(err);
            return '$top=0';
        }
    }

    /**
     * Gets a particular UserPreferences property for a given Job.
     * @param pageClientAPI Page Client API
     * @param orderId ID of the Job for which you want to get the UserPreferences property.
     * @param propertyName Name of the UserPreferences property you are looking for.
     * @return Value of the UserPreferences property for a given Job or blank if not found.
     */
    static getUserPreferencesProperty(pageClientAPI, orderId, propertyName) {
        let propertyValue = '';
        if (libVal.evalIsEmpty(orderId)) {
            return propertyValue;
        }
        return libWo.getUserPreferences(pageClientAPI, orderId).then(userPreferences => {
            if (userPreferences.length > 0) {
                propertyValue = userPreferences.getItem(0)[propertyName];
            }
            if (libVal.evalIsEmpty(propertyValue)) {
                return '';
            } else {
                return propertyValue;
            }
        });
    }

    /**
     * Dynamically set the CreateLinks of the WorkOrder
     * @param {IPageProxy}
     */
    static getCreateUpdateLinks(pageProxy) {
        const links = [];
        let onCreate = libCommon.IsOnCreate(pageProxy);

        //check Equipment ListPicker, if value is set, add Equipment link
        let equipment = libWoControls.getEquipment(pageProxy);
        if (equipment && equipment !== '' && !libCommon.isCurrentReadLinkLocal(equipment)) {
            let equipmentLink = pageProxy.createLinkSpecifierProxy(
                'Equipment',
                'MyEquipments',
                `$filter=EquipId eq '${equipment}'`,
            );
            links.push(equipmentLink.getSpecifier());
        }

        //check Functional Location ListPicker, if value is set, add Func Loc link
        let funcLoc = libWoControls.getFunctionalLocation(pageProxy);
        if (funcLoc && funcLoc !== '' && !libCommon.isCurrentReadLinkLocal(funcLoc)) {
            let funcLocLink = pageProxy.createLinkSpecifierProxy(
                'FunctionalLocation',
                'MyFunctionalLocations',
                `$filter=FuncLocIdIntern eq '${funcLoc}'`,
            );
            links.push(funcLocLink.getSpecifier());
        }

        //update notification link if coming from Notification details
        if (pageProxy.binding.FromNotification) {
            let notificationLink = pageProxy.createLinkSpecifierProxy(
                'Notification',
                'MyNotificationHeaders',
                `$filter=NotificationNumber eq '${pageProxy.binding.NotificationNumber}'`,
            );
            links.push(notificationLink.getSpecifier());
        }

        //update Priority PrioritySeg link
        let priority = libWoControls.getPriority(pageProxy);
        let planningPlant = libWoControls.getPlanningPlant(pageProxy);
        let orderType = libWoControls.getOrderType(pageProxy);
        if (onCreate) {
            let linkPromises = [];
            linkPromises.push(
                pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['PriorityType'], `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then(orderTypes => {
                    if (orderTypes.getItem(0)) {
                        let priorityType = orderTypes.getItem(0).PriorityType;
                        if (!libVal.evalIsEmpty(priority) && !libVal.evalIsEmpty(priorityType)) {
                            let priorityLink = pageProxy.createLinkSpecifierProxy(
                                'WOPriority',
                                'Priorities',
                                `$filter=PriorityType eq '${priorityType}' and Priority eq '${priority}'`,
                            );
                            links.push(priorityLink.getSpecifier());
                        }
                    }
                    return links;
                }),
            );
            if (equipment && equipment !== '' && libCommon.isCurrentReadLinkLocal(equipment)) {
                linkPromises.push(
                    libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                        let equipmentLink = pageProxy.createLinkSpecifierProxy(
                            'Equipment',
                            'MyEquipments',
                            `$filter=EquipId eq '${equipmentId}'`,
                        );
                        links.push(equipmentLink.getSpecifier());
                        return links;
                    }),
                );
            }
            if (funcLoc && funcLoc !== '' && libCommon.isCurrentReadLinkLocal(funcLoc)) {
                linkPromises.push(
                    libCommon.getEntityProperty(pageProxy, `MyFunctionalLocations(${funcLoc})`, 'FuncLocIdIntern').then(funcLocId => {
                        let flocLink = pageProxy.createLinkSpecifierProxy(
                            'FunctionalLocation',
                            'MyFunctionalLocations',
                            `$filter=FuncLocIdIntern eq '${funcLocId}'`,
                        );
                        links.push(flocLink.getSpecifier());
                        return links;
                    }),
                );
            }
            return Promise.all(linkPromises).then(() => {
                return links;
            });
        } else {
            let priorityType = pageProxy.getBindingObject().PriorityType;
            if (!libVal.evalIsEmpty(priority)) {
                let priorityLink = pageProxy.createLinkSpecifierProxy(
                    'WOPriority',
                    'Priorities',
                    `$filter=PriorityType eq '${priorityType}' and Priority eq '${priority}'`,
                );
                links.push(priorityLink.getSpecifier());
            }

            return Promise.resolve(links);
        }
    }

    /**
     * Dynamically set the DeleteLinks of WorkOrders
     */
    static getDeleteLinks(context) {
        let links = [];

        //check Equipment ListPicker, if not set and there is already a equipment. Remove it
        let equipment = libWoControls.getEquipment(context);
        if (!equipment && context.binding.Equipment) {
            let equipmentLink = context.createLinkSpecifierProxy(
                'Equipment',
                'MyEquipments',
                '',
                context.binding.Equipment['@odata.readLink'],
            );
            links.push(equipmentLink.getSpecifier());
        }

        //check Functional Location ListPicker, if not set and there is already a functional loc. Remove it
        let funcLoc = libWoControls.getFunctionalLocation(context);
        if (!funcLoc && context.binding.FunctionalLocation) {
            let funcLocLink = context.createLinkSpecifierProxy(
                'FunctionalLocation',
                'MyFunctionalLocations',
                '',
                context.binding.FunctionalLocation['@odata.readLink'],
            );
            links.push(funcLocLink.getSpecifier());
        }

        return links;
    }

    /**
     * Equipment or functional location changed, so set the work center plant and main work center from the technical object, or back to default
     * @param {*} context
     * @param {*} workCenterRow
     */
    static reloadWorkCenterPlant(context, workCenterRow) {

        let defaultWorkCenterPlant = assnType.getWorkOrderAssignmentDefaults().WorkCenterPlant.default;
        let defaultMainWorkCenter = assnType.getWorkOrderAssignmentDefaults().MainWorkCenter.default;
        let workCenterPlantLstPkrControl = context.evaluateTargetPath('#Control:WorkCenterPlantLstPkr');
        let mainWorkCenterLstPkrControl = context.evaluateTargetPath('#Control:MainWorkCenterLstPkr');
        let workCenterPlantSelected = libCommon.getListPickerValue(context.getControls()[0].getControl('WorkCenterPlantLstPkr').getValue());
        let mainWorkCenterSelected = libCommon.getListPickerValue(context.getControls()[0].getControl('MainWorkCenterLstPkr').getValue());

        if (workCenterRow) { //Use the plant and work center from the technical object
            defaultWorkCenterPlant = workCenterRow.PlantId;
            defaultMainWorkCenter = workCenterRow.ExternalWorkCenterId;
        }
        if (defaultWorkCenterPlant !== workCenterPlantSelected) {
            workCenterPlantLstPkrControl.setValue(defaultWorkCenterPlant);
            libCommon.setStateVariable(context, 'ResetWorkCenter', defaultMainWorkCenter);
            libCommon.setStateVariable(context, 'ResetWorkCenterPlant', defaultWorkCenterPlant);
            return libWoControls.updateMainWorkCenter(context);
        } else if (defaultMainWorkCenter !== mainWorkCenterSelected) {
            mainWorkCenterLstPkrControl.setValue(defaultMainWorkCenter);
        }
        return Promise.resolve(true);
    }

    /**
     * Reset the planning plant list picker (from equipment or func loc or user default)
     * Also reset the work center plant
     * @param {*} context
     * @param {*} planningControl
     * @param {*} plant
     * @param {*} workCenterRow
     */
    static reloadPlanningPlant(context, planningControl, plant, workCenterRow) {
        if (plant) { ///Reset the planning plant and order types
            planningControl.setValue(plant);
            libCommon.setStateVariable(context, 'TypePlanningPlant', plant);
            return libWoControls.updateOrderType(context).then(() => {
                return libWo.reloadWorkCenterPlant(context, workCenterRow);
            });
        } else {
            return libWo.reloadWorkCenterPlant(context, workCenterRow);
        }
    }

    /**
     * Checks if binding object is a service order or a work order.
     * @param {*} context
     * @returns true if binding object is a service order.
     */
    static isServiceOrder(context) {
        let binding = context.getPageProxy().getActionBinding() || context.getPageProxy().binding;
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            binding = context.getPageProxy().binding.WOHeader;
        }
        if (binding['@odata.type'] !== '#sap_mobile.MyWorkOrderHeader') {
            binding = context.getPageProxy().binding;
        }
        if (libCommon.isDefined(binding.isServiceOrder)) {
            return Promise.resolve(binding.isServiceOrder);
        }
        let orderType = binding.OrderType;
        let planningPlant = binding.PlanningPlant;

        if (!libCommon.isDefined(orderType) || !libCommon.isDefined(planningPlant)) {
            return Promise.resolve(false);
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then((result) => {
            if (result.length > 0 && result.getItem(0).ServiceType === 'X') {
                binding.isServiceOrder = true;
            } else {
                binding.isServiceOrder = false;
            }
            return Promise.resolve(binding.isServiceOrder);
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `isServiceOrder(context) error: ${error}`);
            return Promise.resolve(false);
        });
    }

    /**
     * Checks if order being created is a service order.
     * @param {*} context
     * @returns true if the order being created on WorkOrderCreateUpdate.page is a service order.
     */
    static isServiceOrderCreateUpdate(context) {
        try {
            let planningPlant = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#SelectedValue');
            let orderType = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#SelectedValue');
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then((result) => {
                if (result.length > 0) {
                    return Promise.resolve(result.getItem(0).ServiceType === 'X');
                }
                return Promise.resolve(false);
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `isServiceOrderCreateUpdate(context) Error: ${error}`);
                return Promise.resolve(false);
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `isServiceOrderCreateUpdate(context) Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Checks if sold party required.
     * @param {*} context
     * @returns {boolean}
     */
    static isSoldPartyRequired(context, extOrderType) {
        try {
            const orderType = extOrderType || libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#SelectedValue');
            const partnerFunc = PartnerFunction.getSoldToPartyPartnerFunction();
            if (!SoldToPartyLstPkrIsEditable(context)) {
                return Promise.resolve(false);
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PartnerDetProcs', [], `$filter=OrderType eq '${orderType}' and PartnerFunction eq '${partnerFunc}'`).then((result) => {
                if (result.length > 0) {
                    return Promise.resolve(result.getItem(0).PartnerIsMandatory === 'X');
                }
                return Promise.resolve(false);
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `isSoldPartyRequired(context) Error: ${error}`);
                return Promise.resolve(false);
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `isSoldPartyRequired(context) Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    static updateSoldToPartyCaption(context) {
        return libWo.getSoldToPartyCaption(context).then((caption) => {
            try {
                const soldToPartyControl = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:SoldToPartyLstPkr');
                return soldToPartyControl.setCaption(caption);
            } catch (error) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `updateSoldToPartyCaption(context) Error: ${error}`);
                return Promise.resolve(false);
            }
        });
    }

    static getSoldToPartyCaption(context, extOrderType) {
        return libWo.isSoldPartyRequired(context, extOrderType).then((required) => {
            return `${context.localizeText('sold_to_party')}${required ? '*' : ''}`;
        });
    }

    static setServiceOrderCreateUpdateFields(context) {
        let binding = context.getPageProxy().binding;
        if (binding.FromNotification) {
            //No need to set visibility for soldToPartyLstPkr & accountIndicatorLstPkr. Both fields should already be visible.
            return Promise.resolve();
        }
        try {
            return libWo.isServiceOrderCreateUpdate(context).then((isServiceOrder) => {
                let formCellContainer = context.getControl('FormCellContainer');
                let soldToPartyLstPkr = formCellContainer.getControl('SoldToPartyLstPkr');
                let accountIndicatorLstPkr = formCellContainer.getControl('AccountIndicatorLstPkr');
                //Show or hide soldToPartyLstPkr and accountIndicatorLstPkr based on selected order type and planning plant.
                soldToPartyLstPkr.setVisible(isServiceOrder);
                accountIndicatorLstPkr.setVisible(isServiceOrder);
                return Promise.resolve();
            }).catch((err) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `setServiceOrderCreateUpdateFields(context) Error: ${err}`);
                return Promise.resolve();
            });
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `setServiceOrderCreateUpdateFields(context) Error: ${error}`);
            return Promise.resolve();
        }
    }

    static getWorkOrderData(context, binding) {
        if (libVal.evalIsEmpty(binding)) {
            return null;
        }

        switch (binding['@odata.type']) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
                return binding;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue():
                return binding.WOHeader;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue():
                return binding.WorkOrderOperation && binding.WorkOrderOperation.WOHeader;
            default:
                return null;
        }
    }

    static isWorkOrderHasSpecificSystemStatus(context, customBinding, systemStatus) {
        const binding = customBinding || context.binding;
        const workOrder = this.getWorkOrderData(context, binding);
        const systemStatusCode = workOrder && workOrder.OrderMobileStatus_Nav && workOrder.OrderMobileStatus_Nav.SystemStatusCode;

        if (!libVal.evalIsEmpty(systemStatusCode)) {
            return systemStatusCode.includes(systemStatus);
        }
        return false;
    }

    /**
     *  Check that WO has system statuses related to WCM process
     */
    static isWCMWorkOrder(context, customBinding) {
        return this.isWorkOrderHasSpecificSystemStatus(context, customBinding, context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/WorkClearanceManagement.global').getValue());
    }

    /**
     *  Check that WO has system status Created
     */
    static isWorkOrderInCreatedState(context, customBinding) {
        return this.isWorkOrderHasSpecificSystemStatus(context, customBinding, context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/CreatedState.global').getValue());
    }

    static addTagsForWCMAndCreatedWorkOrder(context, tags) {
        if (PersonaLibrary.isWCMOperator(context)) {
            return Promise.resolve(tags);
        }

        const filters = [];

        if (this.isWorkOrderInCreatedState(context)) {
            filters.push(`SystemStatus eq '${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/CreatedState.global').getValue()}'`);
        }

        if (this.isWCMWorkOrder(context)) {
            filters.push(`SystemStatus eq '${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/WorkClearanceManagement.global').getValue()}'`);
        }

        if (libVal.evalIsEmpty(filters)) {
            return Promise.resolve(tags);
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', ['StatusText'], `$filter=${filters.join(' or ')}&$orderby=SystemStatus`)
            .then(result => {
                return tags.concat([...result.map(status => status.StatusText)]);
            })
            .catch((error) => {
                Logger.error('addTagsForWCMAndCreatedWorkOrder error', error);
                return tags;
            });
    }
}

/**
 * This stores the Work Order page's event related methods
 */
export class WorkOrderEventLibrary {

    /**
     * Triggered when the page is loaded
     * @param {IPageProxy} pageClientAPI
     */
    static createUpdateOnPageLoad(pageClientAPI) {
        if (!pageClientAPI.getClientData().LOADED) {
            let onCreate = libCommon.IsOnCreate(pageClientAPI);
            let onFollowUp = libWo.getFollowUpFlag(pageClientAPI);

            libPrivate._setTitle(pageClientAPI, onCreate, onFollowUp);
            this.setDefaultValues(pageClientAPI, onCreate, onFollowUp);

            pageClientAPI.getClientData().LOADED = true;
        }
    }

    /**
     * execute the validation rule of Work Order Create/Update action
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @return {Boolean}
     *
     * @memberof WorkOrderEventLibrary
     */
    static createUpdateValidationRule(pageProxy) {
        let valPromises = [];

        let formCellContainer = pageProxy.getControl('FormCellContainer');
        let allControls = formCellContainer.getControls();
        for (let item of allControls) {
            item.clearValidationOnValueChange();
        }
        formCellContainer.redraw();

        // get all of the validation promises
        valPromises.push(libControlDescription.validationCharLimit(pageProxy));

        // check attachment count, run the validation rule if there is an attachment
        if (DocumentLibrary.attachmentSectionHasData(pageProxy)) {
            valPromises.push(DocumentLibrary.createValidationRule(pageProxy));
        }

        // check all validation promises;
        // if all resolved -> return true
        // if at least 1 rejected -> return false
        return Promise.all(valPromises).then((results) => {
            const pass = results.reduce((total, value) => {
                return total && value;
            });
            if (!pass) {
                throw new Error();
            }
            return true;
        }).catch(() => {
            return false;
        });
    }

    /**
     * Triggered when one of the control has changed the value; Binded to each control
     * Have an optional parameter to determine if the rule is being called from Extension or Not
     * @param {ControlProxy} control
     * @param  {Bool} isExtensionControl
     */
    static createUpdateOnChange(control, isExtensionControl = false) {

        //check wether it is invoke from a rule or by user
        if (control.getPageProxy().getClientData().LOADED && !control.getClientData().SetValueFromRule) {
            let name = control.getName();
            // TODO: Remove this workaround when we get the hierarchy list picker support from sdk.
            // If user select a child from a hierarchy, we are losing the pageProxy binding so have to check and re-assign it.
            if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
                control.getPageProxy()._context.binding = control.binding;
            }
            let context = control.getPageProxy();
            switch (name) {
                case 'PlanningPlantLstPkr':
                    return libWoControls.updateOrderType(context).then(() => {
                        return libWoControls.updateFunctionalLocation(context, isExtensionControl).then(() => {
                            return libWoControls.updateEquipment(context).then(() => {
                            });
                        });
                    });
                case 'TypeLstPkr':
                    return libWoControls.updatePriority(context).then(() => {
                        return libWo.setServiceOrderCreateUpdateFields(context).then(() => {
                            return libWo.isServiceOrder(context).then(isSrvOrd => {
                                return isSrvOrd && libWo.updateSoldToPartyCaption(context);
                            });
                        });
                    });
                case 'FunctionalLocationLstPkr':
                case 'FuncLocHierarchyExtensionControl':
                    libWoControls.updateEquipment(context, isExtensionControl).then(() => {
                        let newPlant = assnType.getWorkOrderAssignmentDefaults().PlanningPlant.default;
                        let flocSelected = isExtensionControl ? context.getControls()[0].getControl('FuncLocHierarchyExtensionControl').getValue() :
                            libCommon.getListPickerValue(context.getControls()[0].getControl('FunctionalLocationLstPkr').getValue());
                        let planningPlant = libCommon.getListPickerValue(context.getControls()[0].getControl('PlanningPlantLstPkr').getValue());
                        let planningPlantControl = context.evaluateTargetPath('#Control:PlanningPlantLstPkr');
                        let target = '';

                        if (flocSelected) {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['PlanningPlant', 'WorkCenter_Main_Nav/ExternalWorkCenterId', 'WorkCenter_Main_Nav/PlantId'], "$expand=WorkCenter_Main_Nav&$filter=FuncLocIdIntern eq '" + flocSelected + "'").then(function(result) {
                                let row = result.getItem(0);
                                newPlant = row.PlanningPlant;
                                if (newPlant && (newPlant !== planningPlant)) {
                                    target = newPlant;
                                }
                                return libWo.reloadPlanningPlant(context, planningPlantControl, target, row.WorkCenter_Main_Nav);
                            });
                        } else {
                            if (newPlant && (newPlant !== planningPlant)) {
                                target = newPlant;
                            }
                            return libWo.reloadPlanningPlant(context, planningPlantControl, target);
                        }
                    });
                    break;
                case 'EquipmentLstPkr':
                case 'EquipHierarchyExtensionControl':
                    libWoControls.updateFloc(control.getPageProxy(), isExtensionControl).then(() => {
                        let newPlant = assnType.getWorkOrderAssignmentDefaults().PlanningPlant.default;
                        let flocSelected = context.getControls()[0].getControl('FuncLocHierarchyExtensionControl').getValue();
                        let equipSelected = isExtensionControl ? context.getControls()[0].getControl('EquipHierarchyExtensionControl').getValue() :
                            libCommon.getListPickerValue(context.getControls()[0].getControl('EquipmentLstPkr').getValue());
                        let planningPlant = libCommon.getListPickerValue(context.getControls()[0].getControl('PlanningPlantLstPkr').getValue());
                        let planningPlantControl = context.evaluateTargetPath('#Control:PlanningPlantLstPkr');
                        let target = '';

                        if (equipSelected) {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['PlanningPlant', 'WorkCenter_Main_Nav/ExternalWorkCenterId', 'WorkCenter_Main_Nav/PlantId'], "$expand=WorkCenter_Main_Nav&$filter=EquipId eq '" + equipSelected + "'").then(function(result) {
                                let row = result.getItem(0);
                                newPlant = row.PlanningPlant;
                                if (newPlant && (newPlant !== planningPlant)) {
                                    target = newPlant;
                                }
                                return libWo.reloadPlanningPlant(context, planningPlantControl, target, row.WorkCenter_Main_Nav);
                            });
                        } else if (flocSelected) {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['PlanningPlant', 'WorkCenter_Main_Nav/ExternalWorkCenterId', 'WorkCenter_Main_Nav/PlantId'], "$expand=WorkCenter_Main_Nav&$filter=FuncLocIdIntern eq '" + flocSelected + "'").then(function(result) {
                                let row = result.getItem(0);
                                newPlant = row.PlanningPlant;
                                if (newPlant && (newPlant !== planningPlant)) {
                                    target = newPlant;
                                }
                                return libWo.reloadPlanningPlant(context, planningPlantControl, target, row.WorkCenter_Main_Nav);
                            });
                        } else {
                            if (newPlant && (newPlant !== planningPlant)) {
                                target = newPlant;
                            }
                            return libWo.reloadPlanningPlant(context, planningPlantControl, target);
                        }
                    });
                    break;
                case 'WorkCenterPlantLstPkr':
                    libWoControls.updateMainWorkCenter(context);
                    break;
                default:
                    break;
            }

            //JCL - Not doing this for now.  Put in place when we can handle for all fields
            if (!libVal.evalIsEmpty(control.getValue())) {
                control.clearValidation();
            }
        } else {
            //value is set or changed by the user, not from rule or code behind
            control.getClientData().SetValueFromRule = false;
        }
        return Promise.resolve(true);
    }

    /**
     * Set controls' visibility
     * @param {IPageProxy} pageProxy
     * @param {boolean} isOnCreate
     */
    static createUpdateVisibility(control) {

        let controlName = control.getName();
        let isOnCreate = libCommon.IsOnCreate(control.getPageProxy());
        let result = false;

        switch (controlName) {
            case 'LongTextNote':
                result = libPrivate._shouldNoteVisible(isOnCreate);
                break;
            case 'Marked':
                result = libPrivate._shouldMarkedJobSwitchVisible(isOnCreate);
                break;
            default:
                result = true;
        }

        return result;
    }

    /**
     * This will returns the correct QueryOptions for each control
     * @param {IControlProxy} controlProxy
     */
    static createUpdateControlsQueryOptions(controlProxy) {
        let controlName;
        let context;
        try {
            controlName = controlProxy.getName();
            context = controlProxy.getPageProxy();
        } catch (err) {
            controlProxy = controlProxy.binding.clientAPI;
            controlName = controlProxy.getName();
            context = controlProxy.getPageProxy();
        }

        //Determine if we are on create
        let onCreate = libCommon.IsOnCreate(context);
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            return this.MeterWorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate);
        } else {
            return this.WorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate);
        }

    }

    static WorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate) {
        let result = '';
        // Based on the control we are on, return the right query or list items accordingly
        switch (controlName) {
            case 'PrioritySeg':
            case 'PriorityLstPkr':
                {
                    //Priority is based on PriorityType property that live inside OrderTypes
                    result = libPrivate._prioritySeg(controlProxy, onCreate);
                    break;
                }
            case 'FunctionalLocationLstPkr':
            case 'FuncLocHierarchyExtensionControl':
                {
                    //if on create, get the default value from app param
                    let planningPlant = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#SelectedValue');
                    if (!libVal.evalIsEmpty(planningPlant)) {
                        result = `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                    } else {
                        planningPlant = onCreate ? assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant') : libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
                        let target = libCommon.getStateVariable(context, 'WODefaultPlanningPlant');
                        if (!libVal.evalIsEmpty(target)) {
                            planningPlant = target;
                        }
                        result = `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                    }
                    break;
                }
            case 'EquipmentLstPkr':
            case 'EquipHierarchyExtensionControl':
                {
                    let funcLoc;
                    if (controlName === 'EquipHierarchyExtensionControl') {
                        funcLoc = context.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                    }
                    if (!funcLoc && funcLoc !== '') {
                        funcLoc = libCommon.getTargetPathValue(controlProxy, '#Property:HeaderFunctionLocation');
                    }
                    let planningPlant = onCreate ? assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant') : libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
                    let target = libCommon.getStateVariable(context, 'WODefaultPlanningPlant');
                    if (target) {
                        planningPlant = target;
                    }
                    if (funcLoc) {
                        result = "$orderby=EquipId&$filter=(FuncLocIdIntern eq '" + funcLoc + "')";
                    } else {
                        result = "$orderby=EquipId&$filter=(PlanningPlant eq '' or PlanningPlant eq '" + planningPlant + "')";
                    }
                    break;
                }
            case 'MainWorkCenterLstPkr':
                {
                    let plant = assnType.getWorkOrderAssignmentDefaults().WorkCenterPlant.default;
                    let target = libCommon.getStateVariable(context, 'WODefaultWorkCenterPlant');
                    if (target) {
                        plant = target;
                    }
                    if (!onCreate) {
                        plant = libCommon.getTargetPathValue(controlProxy, '#Property:MainWorkCenterPlant');
                    }
                    if (!plant) {
                        plant = '';
                    }
                    result = "$orderby=ExternalWorkCenterId&$filter=PlantId eq '" + plant + "'";
                    break;
                }
            default:
                break;
        }

        return Promise.resolve(result);
    }

    static MeterWorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate) {
        let result = '';
        // Based on the control we are on, return the right query or list items accordingly
        switch (controlName) {
            case 'PrioritySeg':
            case 'PriorityLstPkr':
                {
                    let woOrderType = onCreate ? libCommon.getAppParam(controlProxy, 'WORKORDER', 'OrderType') : libCommon.getTargetPathValue(controlProxy, '#Property:OrderType');
                    result = controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${woOrderType}'`).then(function(myOrderTypes) {
                        let record = myOrderTypes.getItem(0);
                        return "$filter=PriorityType eq '" + record.PriorityType + "'&$orderby=Priority";
                    });
                    break;
                }
            case 'FunctionalLocationLstPkr':
            case 'FuncLocHierarchyExtensionControl':
                {
                    //if on create, get the default value from app param
                    let planningPlant = onCreate ? assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant') : libCommon.getTargetPathValue(context, '#Property:PlanningPlant');
                    result = `$orderby=FuncLocId&$filter=PlanningPlant eq '${planningPlant}'`;
                    break;
                }
            case 'EquipmentLstPkr':
            case 'EquipHierarchyExtensionControl':
                {
                    let funcLoc;
                    if (controlName === 'EquipHierarchyExtensionControl') {
                        funcLoc = context.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                    }
                    if (!funcLoc && funcLoc !== '') {
                        funcLoc = libCommon.getTargetPathValue(controlProxy, '#Property:HeaderFunctionLocation');
                    }
                    let planningPlant = onCreate ? assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant') : libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');

                    if (funcLoc && funcLoc !== '') {
                        result = "$orderby=EquipId&$filter=FuncLocId eq '" + funcLoc + "'";
                    } else {
                        result = "$orderby=EquipId&$filter=(PlanningPlant eq '' or PlanningPlant eq '" + planningPlant + "')";
                    }
                    break;
                }
            default:
                break;
        }
        return Promise.resolve(result);
    }
    /**
     * This will returns the correct PickerItems for the Picker Controls
     * @param {IControlProxy} controlProxy
     */
    static createUpdateControlsPickerItems(controlProxy) {
        let controlName = controlProxy.getName();

        //Determine if we are on create
        //let onCreate = libCommon.IsOnCreate(controlProxy.getPageProxy());

        // Based on the control we are on, return the right list items accordingly
        if (controlName === 'PlanningPlantLstPkr') {
            return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], '$orderby=PlanningPlant').then(obArray => {
                let jsonResult = [];
                obArray.forEach(function(element) {
                    jsonResult.push(
                        {
                            'DisplayValue': `${element.PlanningPlant} - ${element.PlantDescription}`,
                            'ReturnValue': element.PlanningPlant,
                        });
                });
                const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                return finalResult;
            });
        } else if (controlName === 'WorkCenterPlantLstPkr') {
            //TODO - AssignmentType case scenario will be needed here after more AssignmentType are introduced
            //let planningPlant = onCreate ? appParams.get('PlanningPlant') : libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
            //let mainWorkCenter = userInfo.get('USER_PARAM.AGR');
            //let queryOption = `$filter=PlantId eq '${planningPlant}' and ExternalWorkCenterId eq '${mainWorkCenter}'`;

            return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], '').then(function(obArray) {
                let jsonResult = [];
                obArray.forEach(function(element) {
                    jsonResult.push(
                        {
                            'DisplayValue': `${element.PlantId} - ${element.WorkCenterName}`,
                            'ReturnValue': element.PlantId,
                        });
                });
                const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                return finalResult;
            });
        } else if (controlName === 'TypeLstPkr') {
            let filter = '$orderby=OrderType';
            if (libCommon.IsOnCreate(controlProxy.getPageProxy()) && IsPhaseModelEnabled(controlProxy)) {
                filter = "$orderby=OrderType&$filter=PhaseModelActive ne 'X'"; //Do not allow phase model order types during create WO
            }

            let getFSMTypesFilterQuery = Promise.resolve();
            if (PersonaLibrary.isFieldServiceTechnician(controlProxy.getPageProxy())) {
                getFSMTypesFilterQuery = WorkOrdersFSMQueryOption(controlProxy.getPageProxy());
            }
            return getFSMTypesFilterQuery.then((fsmFilter) => {
                if (fsmFilter) {
                    if (filter.includes('$filter')) {
                        filter += ` and ${fsmFilter}`;
                    } else {
                        filter += `&$filter=${fsmFilter}`;
                    }
                }
                return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], filter).then(function(obArray) {
                    let jsonResult = [];
                    obArray.forEach(function(element) {
                        jsonResult.push(
                            {
                                'DisplayValue': `${element.OrderType} - ${element.OrderTypeDesc}`,
                                'ReturnValue': element.OrderType,
                            });
                    });
                    const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
                    let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                    return finalResult;
                });
            });
        } else {
            return Promise.resolve([]);
        }
    }

    /**
     * Triggered when the user hit "Save" button
     * @param {IPageProxy} pageProxy
     */
    static CreateUpdateOnCommit(pageProxy) {

        let formCellContainer = pageProxy.getControl('FormCellContainer');

        //Temporary Workaround for an issue where the hierarchy list picker is wiping out the binding on the page. MDK issue logged MDKBUG-585.
        //Get the binding from the formcellcontainer
        if (libVal.evalIsEmpty(pageProxy.binding)) {
            pageProxy._context.binding = formCellContainer.binding;
        }

        //Determine if we are on edit vs. create
        let onCreate = libCommon.IsOnCreate(pageProxy);

        if (onCreate) {
            //get the value from controls that need to pass to Operation create
            let planningPlant = libWoControls.getPlanningPlant(pageProxy);
            let workCenter = libWoControls.getMainWorkCenter(pageProxy);
            let workCenterPlant = libWoControls.getWorkCenterPlant(pageProxy);
            let orderType = libWoControls.getOrderType(pageProxy);
            let floc = IsFromOnlineFlocCreate(pageProxy) ? pageProxy.binding.HeaderFunctionLocation : formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
            let description = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:DescriptionNote/#Value');
            let equipment = pageProxy.binding.OnlineEquipment ?
                formCellContainer.getControl('OnlineEquipControl').getValue()?.split(' - ')?.[0] :
                formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();

            let woDefaultValue = {
                'PlanningPlant': planningPlant,
                'MainWorkCenter': workCenter,
                'MainWorkCenterPlant': workCenterPlant,
                'OrderType': orderType,
                'Description': description,
                'Equipment': equipment,
                'FunctionalLocation': floc,
            };

            libCommon.setStateVariable(pageProxy, 'WorkOrder', woDefaultValue);
            libCommon.setStateVariable(pageProxy, 'FromOperationsList', false);
            let descriptionCtrlValue = formCellContainer.getControl('AttachmentDescription').getValue();
            let attachmentCtrlValue = formCellContainer.getControl('Attachment').getValue();
            libCommon.setStateVariable(pageProxy, 'DocDescription', descriptionCtrlValue);
            libCommon.setStateVariable(pageProxy, 'Doc', attachmentCtrlValue);
            libCommon.setStateVariable(pageProxy, 'Class', pageProxy.binding?.isServiceOrder ? 'ServiceOrder' : 'WorkOrder');
            libCommon.setStateVariable(pageProxy, 'ObjectKey', 'OrderId');
            libCommon.setStateVariable(pageProxy, 'entitySet', 'MyWorkOrderDocuments');
            libCommon.setStateVariable(pageProxy, 'parentEntitySet', 'MyWorkOrderHeaders');
            libCommon.setStateVariable(pageProxy, 'parentProperty', 'WOHeader');
            libCommon.setStateVariable(pageProxy, 'attachmentCount', DocumentLibrary.validationAttachmentCount(pageProxy));

            return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action');
        } else {
            return markedJobCreateUpdateOnCommit(pageProxy).then(() => {
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderUpdate.action');
            });
        }
    }

    /**
     * set the default values of the page's control
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @param {boolean} onCreate
     * @param {boolean} onFollowUp
     *
     * @memberof WorkOrderEventLibrary
     */
    static setDefaultValues(pageProxy, onCreate, onFollowUp) {
        if (onCreate && onFollowUp) {
            const descriptionControl = libCommon.getControlProxy(pageProxy, 'DescriptionNote');
            descriptionControl.setValue(descriptionControl.getValue());

            const prioritySegCtrl = libCommon.getControlProxy(pageProxy, 'PrioritySeg');
            const priorityLstPkrCtrl = libCommon.getControlProxy(pageProxy, 'PriorityLstPkr');
            const priorityCtrl = prioritySegCtrl.getVisible() ? prioritySegCtrl : priorityLstPkrCtrl;

            priorityCtrl.setValue(ConstantsLibrary.defaultPriority);
        }

        const typePkr = pageProxy.getControl('FormCellContainer').getControl('TypeLstPkr');
        typePkr.setEditable(onCreate);

        pageProxy.getClientData().DefaultValuesLoaded = true;
    }

    static createOnSuccess(pageProxy) {
        let assignmentType = libCommon.getWorkOrderAssignmentType(pageProxy);

        switch (assignmentType) {
            case '1':
                // Header Level - WorkOrderPartner
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderPartnerCreate.action');
            case '2':
                // Operation Level - Personel Number
                return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
            case '3':
                // Sub Operation Level - Personel Number
                return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
            case '4':
                // Operation Level - Employee ID
                return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
            case '5':
                // Header Level - Planner Group
                return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
            case '6':
                // Operation Level - Work Center
                return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
            case '7':
                // Header Level - Business Partner
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderPartnerCreate.action');
            case '8':
                // Header Level - Work Center
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action');
            case 'A':
                // Operation Level - MRS (N/A)
                return Promise.resolve(true);
            default:
                //assuming default is 8
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action');
        }
    }

    static getWorkOrderMobileStatusText(context) {
        return libWoMobile.headerMobileStatus(context).then((mStatus) => {
            const woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mStatus)) { //Clock in/out feature enabled and user is clocked in to this WO, regardless of mobile status
                return context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
            } else {
                if (mStatus === 'D-COMPLETE') {
                    return '';
                }
                return mStatus ? context.localizeText(mStatus) : '';
            }
        });
    }

    /**
     * Used for formatting and adding data to WorkOrders list view
     * @param context WorkOrderListView page context
     */
    static WorkOrdersListViewFormat(context) {
        const section = context.getName();
        const property = context.getProperty();
        const binding = context.binding;
        let value = '';
        const clientData = libCommon.getClientDataForPage(context);
        switch (section) {
            case 'WorkOrdersListSection':
            case 'SupervisorSectionForWorkOrders':
            case 'TechnicianSectionForWorkOrders':
            case 'HighPriorityOrdersSection':
            case 'ServiceOrders':
            case 'ConfirmationListSection':
            case 'ConfirmationItemsSection':
            case 'OrderDetailsSection':
            case 'ServiceItemsListSection':
            case 'ServiceOrderHeaderInfo':
            case 'ConfirmationDetails':
            case 'ConfItemDetails':
            case 'ConfItemDetailsNonService':
            case 'ServiceItemDetailsSection':
            case 'ServiceRequests':
            case 'RequestDetailsSection':
            case 'ServiceRequestHeaderInfo':
            case 'ServiceRequestsListSection':
            case 'ConfirmationsSection':
            case 'WCMOverviewWorkorders':
            case 'ServiceQuotationItemDetailsSection':
            case 'WCMRelatedWorkOrdersTable':
                switch (property) {
                    case 'StatusText':
                        try {
                            //Priorities and OrderTypes were cached prior to list screen loading
                            value = clientData.Priorities[clientData.OrderTypes[binding.OrderType].PriorityType + binding.Priority].PriorityDescription;
                            break;
                        } catch (err) {
                            break;
                        }
                    case 'Value':
                    case 'SubstatusText':
                        value = this.getWorkOrderMobileStatusText(context);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return value;
    }

    /**
     * Used for formatting and adding data to SubOperations list view
     * @param context SubOperationsListView page context
     */
    static SubOperationsListViewFormat(context) {
        const section = context.getName();
        const property = context.getProperty();

        if ((property === 'SubstatusText') && (section === 'WorkOrderSubOperationListSection')) {
            if (libClock.isBusinessObjectClockedIn(context)) {
                const stringForSubOpSubtext = context.localizeText('clocked_in');
                return stringForSubOpSubtext;
            }
        }
        return '';
    }

    static getWorkOrderOperationMobileStatusText(context) {
        const status = OperationMobileStatus(context);
        const woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

        return libMobile.isMobileStatusConfirmed(context).then(function(confirmed) {
            let assignmentType = libCommon.getWorkOrderAssnTypeLevel(context);

            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, status)) { //Clock in/out feature enabled and user is clocked in to this Operation, regardless of mobile status
                return context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
            } else if (assignmentType === 'Operation') {
                return status;
            } else if (confirmed) {
                return context.localizeText(complete);
            } else {
                return status;
            }
        });
    }

    /**
     * Used for formatting and adding data to Operations list view
     * @param context WorkOrderOperationsListView page context
     */
    static WorkOrderOperationsListViewFormat(context) {
        const section = context.getName();
        const property = context.getProperty();

        if ((property === 'Subhead' && section === 'OperationsObjectCardCollection') || ((property === 'StatusText') && (section === 'WorkOrderOperationListSection')) || (section === 'OperationsObjectTable')) {
            return this.getWorkOrderOperationMobileStatusText(context);
        }
        if (((property === 'SubstatusText') && (section === 'SupervisorSectionForOperations')) || (section === 'TechnicianSectionForOperations') || section === 'ServiceItems' || section === 'ServiceRequests' || section === 'ServiceOperations') {
            const status = OperationMobileStatus(context);
            const woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, status)) { //Clock in/out feature enabled and user is clocked in to this Operation, regardless of mobile status
                return context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
            } else {
                return status;
            }
        }
        return '';
    }
}

/**
 * The following class stores all of the Work Order controls specific methods
 */
export class WorkOrderControlsLibrary {

    /**
     * Planning Plant getter
     * @param {IPageProxy} pageProxy
     */
    static getPlanningPlant(pageProxy) {
        let planningPlant = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#Value');
        return libCommon.getListPickerValue(planningPlant);
    }

    /**
     * OrderType getter
     * @param {IPageProxy} pageProxy
     */
    static getOrderType(pageProxy) {
        let orderType = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#Value');
        return libCommon.getListPickerValue(orderType);
    }

    /**
     * Priority getting from visible control
     * @param {IPageProxy} pageProxy
     */
    static getPriority(pageProxy) {
        let priority;
        const segmentedControl = pageProxy.evaluateTargetPathForAPI('#Page:WorkOrderCreateUpdatePage/#Control:PrioritySeg');
        if (segmentedControl.getVisible()) {
            priority = segmentedControl.getValue();
        } else {
            priority = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:PriorityLstPkr/#Value');
        }

        return libCommon.getListPickerValue(priority);
    }

    /**
     * Funcational Location getter
     * @param {IPageProxy} pageProxy
     */
    static getFunctionalLocation(pageProxy) {
        let funcLocControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl');
        if (funcLocControl !== undefined && funcLocControl.getValue() !== undefined) {
            return funcLocControl.getValue();
        }
        return '';
    }

    /**
     * FunctionalLocation getter
     * @param {IPageProxy} pageProxy
     */
    static getFunctionalLocationValue(pageProxy) {
        if (IsFromOnlineFlocCreate(pageProxy)) {
            return pageProxy.binding?.HeaderFunctionLocation || '';
        }

        let funcLocControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl');
        if (funcLocControl !== undefined && funcLocControl.getValue() !== undefined) {
            let floc = funcLocControl.getValue();
            if (libCommon.isCurrentReadLinkLocal(floc)) {
                return libCommon.getEntityProperty(pageProxy, `MyFunctionalLocations(${floc})`, 'FuncLocIdIntern').then(flocIdIntern => {
                    return flocIdIntern;
                });
            }
            return floc;
        }
        return '';
    }


    /**
     * Equipment getter
     * @param {IPageProxy} pageProxy
     */
    static getEquipment(pageProxy) {
        let equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:EquipHierarchyExtensionControl');
        if (equipControl !== undefined && equipControl.getValue() !== undefined) {
            return equipControl.getValue();
        }
        return '';
    }

    /**
     * Equipment getter
     * @param {IPageProxy} pageProxy
     */
    static getEquipmentValue(pageProxy) {
        let equipControl;
        let equipment;
        if (pageProxy.binding.OnlineEquipment) {
            equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:OnlineEquipControl');
            if (equipControl !== undefined && equipControl.getValue() !== undefined) {
                equipment = equipControl.getValue();
                return equipment.split(' - ')[0];
            }
            return '';
        }
        equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:EquipHierarchyExtensionControl');
        if (equipControl !== undefined && equipControl.getValue() !== undefined) {
            equipment = equipControl.getValue();
            if (libCommon.isCurrentReadLinkLocal(equipment)) {
                return libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                    return equipmentId;
                });
            }
            return equipment;
        }
        return '';
    }

    /**
     * BusinessArea getter
     * @param {IPageProxy} pageProxy
     */
    static getBusinessArea(pageProxy) {
        let businessArea = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:BusinessAreaLstPkr/#Value');
        return libCommon.getListPickerValue(businessArea);
    }

    /**
     * WorkCenterPlant getter
     * @param {IPageProxy} pageProxy
     */
    static getWorkCenterPlant(pageProxy) {
        let workCenterPlant = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:WorkCenterPlantLstPkr/#Value');
        return libCommon.getListPickerValue(workCenterPlant);
    }

    /**
     * MainWorkCenter getter
     * @param {IPageProxy} pageProxy
     */
    static getMainWorkCenter(pageProxy) {
        let mainWorkCenter = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:MainWorkCenterLstPkr/#Value');
        return libCommon.getListPickerValue(mainWorkCenter);
    }

    /**
     * Update the order type control
     * @param {IPageProxy} pageProxy
     */
    static updateOrderType(pageProxy) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let planningPlantControl = formCellContainer.getControl('PlanningPlantLstPkr');
            let typeControl = formCellContainer.getControl('TypeLstPkr');
            const typeCtrlSpecifier = typeControl.getTargetSpecifier();
            let plantPickerValue = libCommon.getListPickerValue(planningPlantControl.getValue());
            if (libCommon.getStateVariable(pageProxy, 'TypePlanningPlant')) {
                plantPickerValue = libCommon.getStateVariable(pageProxy, 'TypePlanningPlant');
                libCommon.removeStateVariable(pageProxy, 'TypePlanningPlant');
            }
            let phase = '';
            if (libCommon.IsOnCreate(pageProxy) && IsPhaseModelEnabled(pageProxy)) {
                phase = " and PhaseModelActive ne 'X'"; //Do not allow phase model order types during create WO
            }
            let query = "$filter=PlanningPlant eq '" + plantPickerValue + "'" + phase + '&$orderby=OrderType';
            typeCtrlSpecifier.setQueryOptions(query);
            typeCtrlSpecifier.setDisplayValue('{{#Property:OrderType}} - {{#Property:OrderTypeDesc}}');
            typeCtrlSpecifier.setReturnValue('{OrderType}');
            typeCtrlSpecifier.setEntitySet('OrderTypes');
            typeCtrlSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            return typeControl.setTargetSpecifier(typeCtrlSpecifier).then(() => {
                if (libCommon.getListPickerValue(formCellContainer.getControl('TypeLstPkr').getValue())) {
                    if (plantPickerValue) {
                        typeControl.setValue(libCommon.getListPickerValue(formCellContainer.getControl('TypeLstPkr').getValue()));
                    } else {
                        typeControl.setValue('');
                    }
                } else {
                    typeControl.setValue(libCommon.getAppParam(pageProxy, 'WORKORDER', 'OrderType'));
                }
                return Promise.resolve(true);
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `updateOrderType Error: ${err}`);
            return Promise.resolve(true);
        }
    }

    static rebindWorkCenterPlant(pageProxy) {
        let formCellContainer = pageProxy.getControl('FormCellContainer');
        let wcp = formCellContainer.getControl('WorkCenterPlantLstPkr');
        wcp.redraw();
    }

    /**
     * Update Main Work Center control
     * @param {IPageProxy} pageProxy
     */
    static updateMainWorkCenter(pageProxy) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let workCenterPlantControlValue = libCommon.getListPickerValue(formCellContainer.getControl('WorkCenterPlantLstPkr').getValue());
            let mainWorkCenterControl = formCellContainer.getControl('MainWorkCenterLstPkr');
            let workCenterPlantSpecifier = mainWorkCenterControl.getTargetSpecifier();

            if (libCommon.getStateVariable(pageProxy, 'ResetWorkCenterPlant')) {
                workCenterPlantControlValue = libCommon.getStateVariable(pageProxy, 'ResetWorkCenterPlant');
                libCommon.removeStateVariable(pageProxy, 'ResetWorkCenterPlant');
            }
            workCenterPlantSpecifier.setQueryOptions("$orderby=ExternalWorkCenterId&$filter=PlantId eq '" + workCenterPlantControlValue + "'");
            return mainWorkCenterControl.setTargetSpecifier(workCenterPlantSpecifier).then(() => {
                if (libCommon.getStateVariable(pageProxy, 'ResetWorkCenter')) {
                    mainWorkCenterControl.setValue(libCommon.getStateVariable(pageProxy, 'ResetWorkCenter'));
                    libCommon.removeStateVariable(pageProxy, 'ResetWorkCenter');
                }
                return Promise.resolve(true);
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `updateMainWorkCenter Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Priority control
     * @param {IPageProxy} pageProxy
     */
    static updatePriority(pageProxy) {
        try {
            // you need to get OrderType, then find out PriorityType that is associated with that OrderType;
            // because Priority depends on PriorityType property in OrderType
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let planningPlantValue = libCommon.getListPickerValue(formCellContainer.getControl('PlanningPlantLstPkr').getValue());
            let orderTypeValue = libCommon.getListPickerValue(formCellContainer.getControl('TypeLstPkr').getValue());

            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${orderTypeValue}' and PlanningPlant eq '${planningPlantValue}'`)
                .then(async function(myOrderTypes) {
                    let priorityType = '';
                    if (myOrderTypes && myOrderTypes.length > 0) {
                        priorityType = myOrderTypes.getItem(0).PriorityType;
                    } else {
                        priorityType = await WorkOrderCreateGetDefaultOrderType(pageProxy);
                    }

                    let prioritiesQueryOptions = '';

                    if (priorityType) {
                        prioritiesQueryOptions = `$filter=PriorityType eq '${priorityType}'&$orderby=Priority`;
                    } else {
                        prioritiesQueryOptions = '$orderby=Priority';
                    }

                    const prioritiesList = await WorkOrderCreateUpdatePrioritiesList(pageProxy, prioritiesQueryOptions);

                    const priorityControlSeg = formCellContainer.getControl('PrioritySeg');
                    const priorityControlLstPkr = formCellContainer.getControl('PriorityLstPkr');
                    const currentPriorityValue = libCommon.getListPickerValue(priorityControlSeg.getVisible() ? priorityControlSeg.getValue() : priorityControlLstPkr.getValue());
                    const isCurrentPriorityValueExists = prioritiesList.some(priority => priority.ReturnValue === currentPriorityValue);
                    const newPriorityValue = isCurrentPriorityValueExists ? currentPriorityValue : ConstantsLibrary.defaultPriority;

                    //The maximum number of segments is 5 for iOS
                    const isSegmentedShouldBeVisible = prioritiesList.length <= 5;

                    priorityControlSeg.setVisible(isSegmentedShouldBeVisible);
                    priorityControlLstPkr.setVisible(!isSegmentedShouldBeVisible);

                    if (isSegmentedShouldBeVisible) {
                        priorityControlSeg.setSegments(prioritiesList);
                        priorityControlSeg.setValue(newPriorityValue);
                    } else {
                        priorityControlLstPkr.setPickerItems(prioritiesList);
                        priorityControlLstPkr.setValue(newPriorityValue);
                    }

                    return Promise.resolve(true);
                });

        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `updatePriority Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Functional Location control
     * @param {IPageProxy} pageProxy
     */
    static updateFunctionalLocation(pageProxy, isExtensionControl = false) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let planningPlantControlValue = libCommon.getListPickerValue(formCellContainer.getControl('PlanningPlantLstPkr').getValue());
            let funcLocControl = isExtensionControl ? formCellContainer.getControl('FuncLocHierarchyExtensionControl')
                : formCellContainer.getControl('FunctionalLocationLstPkr');
            let funcLocControlValue = isExtensionControl ? formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue()
                : libCommon.getListPickerValue(formCellContainer.getControl('FunctionalLocationLstPkr').getValue());

            if (isExtensionControl) {
                let extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
                if (!libVal.evalIsEmpty(planningPlantControlValue)) {
                    return extension.reload();
                }
                return Promise.resolve(true);
            } else {
                let funLocCtrlSpecifier = funcLocControl.getTargetSpecifier();
                if (!libVal.evalIsEmpty(planningPlantControlValue)) {
                    funLocCtrlSpecifier.setQueryOptions("$filter=(PlanningPlant eq '' or PlanningPlant eq '" + planningPlantControlValue + "')&$orderby=FuncLocIdIntern");
                } else {
                    funLocCtrlSpecifier.setQueryOptions("$filter=(PlanningPlant eq '')&$orderby=FuncLocIdIntern");
                }
                return funcLocControl.setTargetSpecifier(funLocCtrlSpecifier).then(() => {
                    if (!libVal.evalIsEmpty(funcLocControlValue)) {
                        funcLocControl.setValue(funcLocControlValue);
                    }
                    return Promise.resolve(true);
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `updateFunctionalLocation Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Equipment control
     * Have an optional parameter to determine if the rule is being called from Extension or Not
     * @param {IPageProxy} pageProxy
     * @param  {Bool} isExtensionControl
     */
    static updateEquipment(pageProxy, isExtensionControl = false) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let funcLocControlValue = isExtensionControl ? formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue() :
                libCommon.getListPickerValue(formCellContainer.getControl('FunctionalLocationLstPkr').getValue());
            let equipmentControl = formCellContainer.getControl('EquipmentLstPkr');
            let equipmentControlValue = isExtensionControl ? formCellContainer.getControl('EquipHierarchyExtensionControl').getValue() :
                libCommon.getListPickerValue(formCellContainer.getControl('EquipmentLstPkr').getValue());
            let planningPlantControlValue = libCommon.getListPickerValue(formCellContainer.getControl('PlanningPlantLstPkr').getValue());
            if (isExtensionControl) {
                let extension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
                pageProxy.getClientData().overrideValue = true;
                return extension.reload().then(() => {
                    if (funcLocControlValue && equipmentControlValue) {
                        extension.setData(equipmentControlValue);
                    }
                    return Promise.resolve(true);
                });
            } else {
                let equipmentCtrlSpecifier = equipmentControl.getTargetSpecifier();
                if (funcLocControlValue) {
                    equipmentCtrlSpecifier.setQueryOptions("$orderby=EquipId&$filter=(FuncLocIdIntern eq '" + funcLocControlValue + "')");
                } else if (planningPlantControlValue) {
                    equipmentCtrlSpecifier.setQueryOptions("$orderby=EquipId&$filter=(PlanningPlant eq '' or PlanningPlant eq '" + planningPlantControlValue + "')");
                } else {
                    equipmentCtrlSpecifier.setQueryOptions("$orderby=EquipId&$filter=(PlanningPlant eq '')");
                }
                return equipmentControl.setTargetSpecifier(equipmentCtrlSpecifier).then(() => {
                    if (equipmentControlValue) {
                        equipmentControl.setValue(equipmentControlValue);
                    }
                    return Promise.resolve(true);
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `UpdateEquipment Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Functional Location control
     * Have an optional parameter to determine if the rule is being called from Extension or Not
     * @param {IPageProxy} pageProxy
     * @param  {Bool} isExtensionControl
     */
    static updateFloc(pageProxy, isExtensionControl = false) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let funcLocControl = isExtensionControl ? formCellContainer.getControl('FuncLocHierarchyExtensionControl') : formCellContainer.getControl('FunctionalLocationLstPkr');
            let equipmentControlValue = isExtensionControl ? formCellContainer.getControl('EquipHierarchyExtensionControl').getValue() : formCellContainer.getControl('EquipmentLstPkr').getValue();

            if (isExtensionControl) {
                let extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
                pageProxy.getClientData().overrideValue = true;
                if (equipmentControlValue) {
                    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$filter=EquipId eq '${equipmentControlValue}'&$expand=FunctionalLocation&$orderby=EquipId`).then(results => {
                        if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                            extension.setData(results.getItem(0).FuncLocIdIntern);
                        } else {
                            funcLocControl.setData('');
                        }
                        return true;
                    });
                }
                return Promise.resolve(true);
            } else {
                if (equipmentControlValue && libCommon.getListPickerValue(equipmentControlValue) !== '') {
                    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$filter=EquipId eq '${libCommon.getListPickerValue(equipmentControlValue)}'&$expand=FunctionalLocation&$orderby=EquipId`).then(results => {
                        if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                            funcLocControl.setValue(results.getItem(0).FuncLocIdIntern, false);
                        } else {
                            funcLocControl.setValue(''); //Equipment has no FLOC
                        }
                        return Promise.resolve(true);
                    });
                }
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `UpdateFloc Error: ${err}`);
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

}

export class PrivateMethodsLibrary {

    static _setTitle(context, onCreate, onFollowUp) {
        let title = '';
        let isFST = PersonaLibrary.isFieldServiceTechnician(context);

        if (onCreate) {
            if (onFollowUp) {
                title = context.localizeText('add_order');
            } else {
                title = isFST ? context.localizeText('add_service_order') : context.localizeText('add_workorder');
            }
        } else {
            title = isFST ? context.localizeText('edit_service_order') : context.localizeText('edit_workorder');
        }
        context.setCaption(title);
    }

    static _isMainWorkCenterEditable(control, isOnCreate, isLocal) {
        let assignmentType = libCommon.getWorkOrderAssignmentType(control.getPageProxy());
        if (assignmentType === 8) {
            return false;
        } else if (!isOnCreate && !isLocal) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * return Note visibility based on isOnCreate;
     *
     * @static
     * @param {boolean} isOnCreate
     * @returns {boolean}
     *
     * @memberof PrivateMethodsLibrary
     */
    static _shouldNoteVisible(isOnCreate) {
        return isOnCreate;
    }

    /**
     * return MarkedJob Switch visibility
     *
     * @static
     * @param {boolean} isOnCreate
     * @returns {boolean}
     *
     * @memberof PrivateMethodsLibrary
     */
    static _shouldMarkedJobSwitchVisible(isOnCreate) {
        return !isOnCreate;
    }

    /**
     * Returns the PriorityType query based on order type and planning plant lookups.
     * @param {*} controlProxy Context page that holds the work order binding object.
     * @param {boolean} onCreate True if we are creating a new work order. False if we are editing an existing one.
     * @returns {String}
     */
    static _prioritySeg(controlProxy, onCreate) {
        let onFollowUp = libWo.getFollowUpFlag(controlProxy);
        let woOrderType = (onCreate && !onFollowUp) ? libCommon.getAppParam(controlProxy, 'WORKORDER', 'OrderType') : libCommon.getTargetPathValue(controlProxy, '#Property:OrderType');
        let planningPlant = '';
        if (onCreate) {
            planningPlant = libWoControls.getPlanningPlant(controlProxy.getPageProxy());
            if (!planningPlant) {
                planningPlant = libCommon.getStateVariable(controlProxy, 'WODefaultPlanningPlant');
            }
            if (!planningPlant) {
                planningPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
            }
        } else {
            planningPlant = libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
        }
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${woOrderType}' and PlanningPlant eq '${planningPlant}'`).then(function(myOrderTypes) {
            let priorityType = '';
            if (myOrderTypes && myOrderTypes.length > 0) {
                priorityType = myOrderTypes.getItem(0).PriorityType;
            }
            if (priorityType) {
                return "$filter=PriorityType eq '" + priorityType + "'&$orderby=Priority";
            } else {
                return WorkOrderCreateGetDefaultOrderType(controlProxy).then(defaultType => {
                    return "$filter=PriorityType eq '" + defaultType + "'&$orderby=Priority";
                });
            }
        });
    }
}

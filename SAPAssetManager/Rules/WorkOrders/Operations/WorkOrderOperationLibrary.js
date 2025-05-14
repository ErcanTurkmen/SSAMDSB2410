import libCommon from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';
import libVal from '../../Common/Library/ValidationLibrary';
import libControlDescription from '../../Common/Controls/DescriptionNoteControl';
import Logger from '../../Log/Logger';
import OpCreateSuccess from '../Operations/CreateUpdate/WorkOrderOperationBatchCreate';
import { OperationControlLibrary as libOperationControl, PrivateMethodLibrary as libPrivate } from './WorkOrderOperationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import WorkOrderOperationsFSMQueryOption from './WorkOrderOperationsFSMQueryOption';
import { WorkOrderLibrary as libWO } from '../WorkOrderLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsFromOnlineFlocCreate from '../../Common/IsFromOnlineFlocCreate';
import { NoteLibrary } from '../../Notes/NoteLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import DocumentLibrary from '../../Documents/DocumentLibrary';

/**
 * Contains the methods that are general to Operation
 */
export class OperationLibrary {

    /**
     * Dynamically set the CreateLinks of the WorkOrder
     * @param {IPageProxy}
     * @return {Array} array of create update links
     */
    static getCreateUpdateLinks(pageProxy) {
        const links = [];

        let onCreate = libCommon.IsOnCreate(pageProxy);
        let onChangeSet = libCommon.isOnChangeset(pageProxy);
        let onWOChangeSet = libCommon.isOnWOChangeset(pageProxy);
        let parentWorkOrderPromise = libPrivate._getParentWorkOrder(pageProxy, onWOChangeSet);
        if (libCommon.isDefined(libOperationControl.getWorkOrder(pageProxy))) {
            if (onCreate) {
                if (onChangeSet && onWOChangeSet) {
                    let woLink = pageProxy.createLinkSpecifierProxy(
                        'WOHeader',
                        'MyWorkOrderHeaders',
                        '',
                        'pending_1',
                    );
                    links.push(woLink.getSpecifier());
                } else {
                    let woReadLink = libOperationControl.getWorkOrder(pageProxy);
                    let woLink = pageProxy.createLinkSpecifierProxy(
                        'WOHeader',
                        'MyWorkOrderHeaders',
                        '',
                        woReadLink,
                    );
                    links.push(woLink.getSpecifier());
                }
            }

            //check Equipment ListPicker, if value is set, add Equipment link
            let equipment = libOperationControl.getEquipment(pageProxy);
            if (!libVal.evalIsEmpty(equipment) && !libCommon.isCurrentReadLinkLocal(equipment)) {
                let equipmentLink = pageProxy.createLinkSpecifierProxy(
                    'EquipmentOperation',
                    'MyEquipments',
                    `$filter=EquipId eq '${equipment}'`,
                );
                links.push(equipmentLink.getSpecifier());
            }

            //check Functional Location ListPicker, if value is set, add Func Loc link
            let funcLoc = libOperationControl.getFunctionalLocation(pageProxy);
            if (!libVal.evalIsEmpty(funcLoc) && !libCommon.isCurrentReadLinkLocal(funcLoc)) {
                let funcLocLink = pageProxy.createLinkSpecifierProxy(
                    'FunctionalLocationOperation',
                    'MyFunctionalLocations',
                    `$filter=FuncLocIdIntern eq '${funcLoc}'`,
                );
                links.push(funcLocLink.getSpecifier());
            }

            let linkPromises = [];
            if (equipment && equipment !== '' && libCommon.isCurrentReadLinkLocal(equipment)) {
                linkPromises.push(
                    libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                        let equipmentLink = pageProxy.createLinkSpecifierProxy(
                            'EquipmentOperation',
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
                            'FunctionalLocationOperation',
                            'MyFunctionalLocations',
                            `$filter=FuncLocIdIntern eq '${funcLocId}'`,
                        );
                        links.push(flocLink.getSpecifier());
                        return links;
                    }),
                );
            }
            if (linkPromises.length > 0) {
                return Promise.all(linkPromises).then(() => {
                    return links;
                });
            }

            return links;
        } else {
            return parentWorkOrderPromise.then(parentWorkOrder => {
                // if on workorder create, we will need to add the folllowing link
                if (onCreate) {
                    if (onChangeSet && onWOChangeSet) {
                        let woLink = pageProxy.createLinkSpecifierProxy(
                            'WOHeader',
                            'MyWorkOrderHeaders',
                            '',
                            'pending_1',
                        );
                        links.push(woLink.getSpecifier());
                    } else {
                        let woReadLink = parentWorkOrder['@odata.readLink'];
                        let woLink = pageProxy.createLinkSpecifierProxy(
                            'WOHeader',
                            'MyWorkOrderHeaders',
                            '',
                            woReadLink,
                        );
                        links.push(woLink.getSpecifier());
                    }
                }

                //check Equipment ListPicker, if value is set, add Equipment link
                let equipment = libOperationControl.getEquipment(pageProxy);
                if (!libVal.evalIsEmpty(equipment) && !libCommon.isCurrentReadLinkLocal(equipment)) {
                    let equipmentLink = pageProxy.createLinkSpecifierProxy(
                        'EquipmentOperation',
                        'MyEquipments',
                        `$filter=EquipId eq '${equipment}'`,
                    );
                    links.push(equipmentLink.getSpecifier());
                }

                //check Functional Location ListPicker, if value is set, add Func Loc link
                let funcLoc = libOperationControl.getFunctionalLocation(pageProxy);
                funcLoc = decodeURIComponent(funcLoc); //ICMTANGOAMF10-16403 - bug fix
                if (!libVal.evalIsEmpty(funcLoc) && !libCommon.isCurrentReadLinkLocal(funcLoc)) {
                    let funcLocLink = pageProxy.createLinkSpecifierProxy(
                        'FunctionalLocationOperation',
                        'MyFunctionalLocations',
                        `$filter=FuncLocIdIntern eq '${funcLoc}'`,
                    );
                    links.push(funcLocLink.getSpecifier());
                }

                let linkPromises = [];
                if (equipment && equipment !== '' && libCommon.isCurrentReadLinkLocal(equipment)) {
                    linkPromises.push(
                        libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                            let equipmentLink = pageProxy.createLinkSpecifierProxy(
                                'EquipmentOperation',
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
                                'FunctionalLocationOperation',
                                'MyFunctionalLocations',
                                `$filter=FuncLocIdIntern eq '${funcLocId}'`,
                            );
                            links.push(flocLink.getSpecifier());
                            return links;
                        }),
                    );
                }
                if (linkPromises.length > 0) {
                    return Promise.all(linkPromises).then(() => {
                        return links;
                    });
                }

                return links;
            });
        }

    }

    /**
     * Dynamically set the Delete of the WorkOrder
     * @param {IPageProxy}
     * @return {Array} array of create update links
     */
    static getDeleteLinks(pageProxy) {
        const links = [];

        //check Equipment ListPicker, if value is set, add Equipment link
        let equipment = libOperationControl.getEquipment(pageProxy);
        if (libVal.evalIsEmpty(equipment) && pageProxy.binding.EquipmentOperation) {
            let equipmentLink = pageProxy.createLinkSpecifierProxy(
                'EquipmentOperation',
                'MyEquipments',
                '',
                pageProxy.binding.EquipmentOperation['@odata.readLink'],
            );
            links.push(equipmentLink.getSpecifier());
        }

        //check Functional Location ListPicker, if value is set, add Func Loc link
        let funcLoc = libOperationControl.getFunctionalLocation(pageProxy);
        if (libVal.evalIsEmpty(funcLoc) && pageProxy.binding.FunctionalLocationOperation) {
            let funcLocLink = pageProxy.createLinkSpecifierProxy(
                'FunctionalLocationOperation',
                'MyFunctionalLocations',
                '',
                pageProxy.binding.FunctionalLocationOperation['@odata.readLink'],
            );
            links.push(funcLocLink.getSpecifier());
        }

        return links;

    }

    /**
     * Gets the count of operations with exact status
     * @param {IClientAPI} sectionProxy
     * @param {string} status
     * @param {{lowerBound: Date, upperBound: Date}} dates
     * @param {string} field
     * @return {number}
     */
    static statusOperationsCount(sectionProxy, status, dates, field) {
        return this.statusOperationFilter(sectionProxy, status, dates, field).then(filter => {
            return sectionProxy.count(
                '/SAPAssetManager/Services/AssetManager.service',
                'MyWorkOrderOperations',
                this.attachOperationsFilterByAssgnTypeOrWCM(sectionProxy, filter),
            );
        });
    }

    /**
     * Provides filter query for the service operations with exact status and date
     * @param {IClientAPI} sectionProxy
     * @param {string} status
     * @param {{lowerBound: Date, upperBound: Date}} dates
     * @param {string} field
     * @return {string}
     */
    static statusOperationFilter(sectionProxy, status, dates, field) {
        return WorkOrderOperationsFSMQueryOption(sectionProxy).then(types => {
            return libWO.dateOperationsFilter(sectionProxy, dates, field).then(dateFilter => {
                let queryOption = `$filter=OperationMobileStatus_Nav/MobileStatus eq '${status}' and ${dateFilter}`;
                if (!libVal.evalIsEmpty(types)) {
                    queryOption += ' and ' + types;
                }
                return queryOption;
            });

        });
    }

    /**
     * Get operations filter value by assignment type
     * @param {IClientAPI} context MDK context
     * @returns {String}
     */
    static getOperationsFilterByAssignmentType(context) {
        try {
            if (PersonaLibrary.isWCMOperator(context)) {
                return '';
            }

            const assignmentTypeValue = libCommon.getWorkOrderAssignmentType(context, true);
            const workCenters = libCommon.getParsedUserWorkCenters();
            const filters = [];
            assignmentTypeValue.split(',').forEach(assignmentType => {
                let filter = '';

                switch (assignmentType) {
                    case '2':
                        filter = `(PersonNum eq '${libCommon.getPersonnelNumber()}' or sap.islocal())`;
                        break;
                    case '4':
                        filter = '(NumberOfCapacities gt 0 or NumberOfCapacities eq null)';
                        break;
                    case '6':
                        filter = '(' + workCenters.map(workCenter => `MainWorkCenter eq '${workCenter}'`).join(' or ') + ')';
                        break;
                }

                if (!libVal.evalIsEmpty(filter)) {
                    filters.push(filter);
                }
            });

            if (libVal.evalIsEmpty(filters)) {
                return '';
            } else {
                if (filters.length === 1) {
                    return filters[0];
                }
                return `(${filters.join(' or ')})`;
            }
        } catch (err) {
            console.log(err);
            return '$top=0';
        }
    }

    /**
     * Get operations filter value for WCM persona or by assignment type
     * @param {IClientAPI} context MDK context
     * @returns {String}
     */
    static getOperationsFilterByAssgnTypeOrWCM(context) {
        return PersonaLibrary.isWCMOperator(context) ? OperationConstants.WCMOperationsFilter(context) : this.getOperationsFilterByAssignmentType(context);
    }

    /**
     * Attach operations filter to query options
     * @param {IClientAPI} context MDK context
     * @param {String|DataQueryBuilder} queryOptions query options
     * @param {Boolean} useQueryBuilder should be true in case when we use DataQueryBuilder
     * @returns {String|DataQueryBuilder}
     */
    static attachOperationsFilterByAssgnTypeOrWCM(context, queryOptions = '', useQueryBuilder = false) {
        const filter = this.getOperationsFilterByAssgnTypeOrWCM(context);

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
    }
}

/**
 * Contains the methods that are page Event related
 */
export class OperationEventLibrary {

    /**
     * Trigger during PageLoad
     * @param {IPageProxy} pageProxy
     */
    static createUpdateOnPageLoad(pageProxy) {
        if (!pageProxy.getClientData().LOADED) {
            //Determine if we are on edit vs. create
            let onCreate = libCommon.IsOnCreate(pageProxy);
            this.createUpdateVisibility(pageProxy, onCreate);

            if (onCreate) {
                //Get title
                let title = pageProxy.localizeText('add_operation');
                pageProxy.setCaption(title);

                this.setDefaultValues(pageProxy);
            } else {
                let title = pageProxy.localizeText('edit_operation');
                pageProxy.setCaption(title);
                let stylizer = new Stylizer(['GrayText']);
                let formCellContainerProxy = pageProxy.getControl('FormCellContainer');
                let workCenterPlant = formCellContainerProxy.getControl('WorkCenterPlantLstPkr');
                let workCenterLstPkr = formCellContainerProxy.getControl('WorkCenterLstPkr');
                stylizer.apply(workCenterPlant, 'Value');
                stylizer.apply(workCenterLstPkr, 'Value');
            }
        }
        pageProxy.getClientData().LOADED = true;
        return true;
    }

    /**
     * validation rule of Operation Create/Update action
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
            const allValidationPassed = results.every((value) => value);
            return allValidationPassed;
        }).catch(() => {
            return false;
        });
    }

    /**
     * Trigger during Page Unload
     * @param {IPageProxy} pageProxy
     */
    static createUpdateOnPageUnloaded(pageProxy) {
        //reset global state
        libCommon.setOnCreateUpdateFlag(pageProxy, '');

        let workOrderDV = libCommon.getStateVariable(pageProxy, 'WorkOrder');
        if (workOrderDV) {
            // if this changeset was a WorkOrder/Operation changeset, reset the ChangeSet flag to false.
            // Because this is the last action of the changeset
            libCommon.setOnChangesetFlag(pageProxy, false);
        }
    }

    /**
     * Trigger by control, when it has binding to the following OnChange method
     * @param {IControlProxy} controlProxy
     */
    static createUpdateOnChange(controlProxy) {
        try {
            if (controlProxy.getPageProxy().getClientData().LOADED && !controlProxy.getClientData().SetValueFromRule) {
                let name = controlProxy.getName();
                // TODO: Remove this workaround when we get the hierarchy list picker support from sdk.
                // If user select a child from a hierarchy, we are losing the pageProxy binding so have to check and re-assign it.
                if (libVal.evalIsEmpty(controlProxy.getPageProxy().binding)) {
                    controlProxy.getPageProxy()._context.binding = controlProxy.binding;
                }
                switch (name) {
                    case 'FuncLocHierarchyExtensionControl':
                        return libOperationControl.updateEquipment(controlProxy.getPageProxy());
                    case 'EquipHierarchyExtensionControl':
                        return libOperationControl.updateFloc(controlProxy.getPageProxy());
                    case 'ControlKeyLstPkr':
                        break;
                    case 'WorkCenterLstPkr':
                        break;
                    case 'WorkCenterPlantLstPkr':
                        break;
                    case 'WorkOrderLstPkr': { //Handle enable/disable of equip/floc based on order type of parent WO
                        let pageProxy = controlProxy.getPageProxy();
                        let woNumReadLink = libOperationControl.getWorkOrder(pageProxy);
                        let formCellContainer = pageProxy.getControl('FormCellContainer');
                        let params = {};

                        params.funcLocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control;
                        params.funcLocExtension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
                        params.equipmentControl = formCellContainer.getControl('EquipHierarchyExtensionControl')._control;
                        params.equipmentExtension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
                        params.descriptionControl = formCellContainer.getControl('DescriptionNote');
                        params.equipValue = '';
                        params.flocValue = '';
                        params.descriptionValue = '';
                        params.planningPlant = '';
                        params.enable = false;
                        params.pageProxy = pageProxy;

                        if (woNumReadLink) { //Read defaults from work order header for this new operation
                            return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', woNumReadLink, ['OrderType', 'PlanningPlant', 'HeaderEquipment', 'HeaderFunctionLocation', 'OrderDescription'], '').then(result => {
                                if (result && result.length > 0) {
                                    let woRow = result.getItem(0);
                                    params.equipValue = woRow.HeaderEquipment;
                                    params.flocValue = woRow.HeaderFunctionLocation;
                                    params.descriptionValue = woRow.OrderDescription;
                                    params.planningPlant = woRow.PlanningPlant;
                                    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=(OrderType eq '${woRow.OrderType}' and PlanningPlant eq '${woRow.PlanningPlant}')`).then(function(myOrderTypes) {
                                        if (myOrderTypes && myOrderTypes.length > 0) {
                                            let record = myOrderTypes.getItem(0);
                                            params.enable = (record.ObjectListAssignment === ''); //Are equip and floc allowed for operations?
                                        }
                                        return libOperationControl.updateEquipFuncLocAfterWorkOrderChange(params);
                                    });
                                }
                                return libOperationControl.updateEquipFuncLocAfterWorkOrderChange(params);
                            });
                        }
                        return libOperationControl.updateEquipFuncLocAfterWorkOrderChange(params);
                    }
                    default:
                        break;
                }
            } else {
                controlProxy.getClientData().SetValueFromRule = false;
            }
            return Promise.resolve(true);
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), err);
        }
        return Promise.resolve(false);
    }

    /**
     * Set the visible state of the fields
     * @param {IPageProxy} pageProxy
     * @param {boolean} isOnCreate
     */
    static createUpdateVisibility(pageProxy, isOnCreate) {
        let noteNoteControl = pageProxy.getControl('FormCellContainer').getControl('LongTextNote');
        noteNoteControl.setVisible(isOnCreate);
    }

    /**
     * Dynamically bind the queryoptions to the controls
     * @param {IControlProxy} controlProxy
     */
    static createUpdateControlsQueryOptions(controlProxy) {
        let result = '';
        try {
            let controlName;
            try {
                controlName = controlProxy.getName();
            } catch (err) {
                controlProxy = controlProxy.binding.clientAPI;
                controlName = controlProxy.getName();
            }
            let onWoChangeSet = libCommon.isOnWOChangeset(controlProxy);
            let pageProxy = controlProxy.getPageProxy();
            let parentWorkOrderPromise = libPrivate._getParentWorkOrder(pageProxy, onWoChangeSet);

            return parentWorkOrderPromise.then(parentWorkOrder => {
                let planningPlant = '';

                if (parentWorkOrder && parentWorkOrder.PlanningPlant) {
                    planningPlant = parentWorkOrder.PlanningPlant;
                }
                let target = libCommon.getStateVariable(pageProxy, 'WODefaultPlanningPlant');
                if (target) {
                    planningPlant = target;
                }
                // Based on the control we are on, return the right query or list items accordingly
                switch (controlName) {
                    case 'FuncLocHierarchyExtensionControl':
                        result = `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                        break;
                    case 'EquipHierarchyExtensionControl': {
                        let funcLoc = pageProxy.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                        let reset = libCommon.getStateVariable(pageProxy, 'WODefaultReset');
                        if (!funcLoc && funcLoc !== '') {
                            funcLoc = libCommon.getTargetPathValue(pageProxy, '#Property:OperationFunctionLocation') || libCommon.getTargetPathValue(pageProxy, '#Property:HeaderFunctionLocation');
                        }
                        result = '$orderby=EquipId';
                        result += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                        if (funcLoc && !reset) {
                            result += " and FuncLocIdIntern eq '" + funcLoc + "'";
                        }
                        break;
                    }
                    case 'ControlKeyLstPkr':
                        result = '$orderby=ControlKey';
                        break;
                    default:
                        break;
                }
                return result;
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), err);
        }
        return result;
    }

    /**
     * Dynamically bind the queryoptions to the controls
     * @param {IControlProxy} controlProxy
     */
    static createUpdateControlsPickerItems(controlProxy) {
        try {
            let controlName = controlProxy.getName();
            let result = '';

            //var that tells if we are on create
            let onCreate = libCommon.IsOnCreate(controlProxy.getPageProxy());

            //var that tells if we are on ChangeSet
            let onWoChangeSet = libCommon.isOnWOChangeset(controlProxy);
            let parentWorkOrderPromise = libPrivate._getParentWorkOrder(controlProxy.getPageProxy(), onWoChangeSet);

            return parentWorkOrderPromise.then(parentWorkOrder => {
                // Based on the control we are on, return the right query or list items accordingly
                if (controlName === 'WorkCenterPlantLstPkr') {
                    let entityRead = null;
                    let mainWorkCenter = '';

                    if (onCreate) {
                        mainWorkCenter = parentWorkOrder.MainWorkCenter;
                    } else {
                        mainWorkCenter = libCommon.getTargetPathValue(controlProxy, '#Property:MainWorkCenter');
                    }
                    if (mainWorkCenter) {
                        entityRead = controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=ExternalWorkCenterId eq '${mainWorkCenter}'`);
                    } else {
                        throw 'Return all work centers';
                    }

                    return entityRead.then(function(obArray) {
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
                } else {
                    return result;
                }
            }).catch(() => {
                Logger.error(controlProxy, 'WO Operation. No Parent WO exists returning all workcenters');
                let entity = controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], '');
                return entity.then(function(obArray) {
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
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(controlProxy, 'WO Operation' + err);
            return '';
        }
    }

    /**
     * Trigger when user hit save button
     * @param {IPageProxy} pageProxy
     */
    static createUpdateOnCommit(pageProxy) {
        //Determine if we are on edit vs. create
        let onCreate = libCommon.IsOnCreate(pageProxy);

        if (onCreate) {
            return OpCreateSuccess(pageProxy);
        } else {
            return OperationEventLibrary.addNoteAfterUpdate(pageProxy, '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationUpdate.action');
        }
    }

    static addNoteAfterUpdate(pageProxy, updateAction) {
        const noteControl = pageProxy.getControl('FormCellContainer')?.getControl('LongTextNote');
        const newNote = noteControl?.getValue();
        CommonLibrary.setStateVariable(pageProxy, 'skipToastAndClosePageOnDocumentCreate', !!newNote);  // if there is an STK in the note control (not visible), dont close the page before creating the note
        return pageProxy.executeAction(updateAction)
            .then(() => {
                if (!newNote) {
                    return undefined;
                }
                NoteLibrary.didSetNoteTypeTransactionForBindingType(pageProxy, pageProxy.binding);
                const type = NoteLibrary.getNoteTypeTransactionFlag(pageProxy);
                return NoteLibrary.noteDownload(pageProxy)
                    .then(oldNote => pageProxy.executeAction(oldNote ? type.noteUpdateAction : type.noteCreateAction));
            });
    }

    /**
     * Set the default value when its on create mode
     * @param {IPageProxy} pageProxy
     * @param {boolean} onCreate
     * @param {Map} userInfo
     */
    static setDefaultValues(pageProxy) {
        let onWoChangeSet = libCommon.isOnWOChangeset(pageProxy);
        let parentWorkOrderPromise = libPrivate._getParentWorkOrder(pageProxy, onWoChangeSet);

        // get the controls
        let controlKeyCtrl = pageProxy.getControl('FormCellContainer').getControl('ControlKeyLstPkr');


        parentWorkOrderPromise.then(parentWorkOrder => {
            // set the defaut value from Parent - WorkOrder
            controlKeyCtrl.setValue(parentWorkOrder.OrderType);

            //set the 'SetValueFromRule' flag of each control to true
            controlKeyCtrl.getClientData().SetValueFromRule = true;

            //set the 'DefaultValuesLoaded' flag of the page to true
            pageProxy.getClientData().DefaultValuesLoaded = true;
        });

        if (libCommon.getStateVariable(pageProxy, 'WorkOrder')) {
            pageProxy.getControl('FormCellContainer').getControl('WorkOrderLstPkr').setValue(libCommon.getStateVariable(pageProxy, 'WorkOrder')['@odata.readLink']);
        }
    }
}

/**
 * Contains the methods that are page control related
 */
export class OperationControlLibrary {

    /**
     * Handle setting enable state and default values for equipment/floc and description fields based on parent work order or operation
     */
    static updateEquipFuncLocAfterWorkOrderChange(params) {
        try {
            if (params.planningPlant) {
                params.pageProxy.getClientData().TempPlanningPlant = params.planningPlant;
            } else {
                params.pageProxy.getClientData().TempPlanningPlant = '';
            }
            params.funcLocExtension.setEditable(params.enable);
            params.equipmentExtension.setEditable(params.enable);
            if (!params.enable) {
                params.funcLocExtension.reload();
                params.equipmentExtension.reload();
            }
            if (params.descriptionValue) {
                params.descriptionControl.setValue(params.descriptionValue);
            } else {
                params.descriptionControl.setValue('');
            }
            if (params.equipValue && params.enable) { //Set the equipment, which will also set the floc
                return libOperationControl.updateFlocFilter(params.pageProxy, params.planningPlant).then(() => { //Reset the floc picker filter
                    return libOperationControl.updateEquipment(params.pageProxy, params.planningPlant, true).then(() => { //Reset the equipment picker filter
                        params.equipmentExtension.setData(params.equipValue);
                        params.funcLocExtension.setData(params.flocValue);
                        return Promise.resolve(true);
                    });
                });
            } else if (params.flocValue && params.enable) { //Only set the floc
                return libOperationControl.updateFlocFilter(params.pageProxy, params.planningPlant).then(() => { //Reset the floc picker filter
                    params.funcLocExtension.setData(params.flocValue);
                    return libOperationControl.updateEquipment(params.pageProxy, params.planningPlant, true).then(() => { //Reset the equipment picker filter
                        params.equipmentExtension.reload();
                        return Promise.resolve(true);
                    });
                });
            } else {
                return libOperationControl.updateFlocFilter(params.pageProxy, params.planningPlant).then(() => { //Reset the floc picker filter
                    return libOperationControl.updateEquipment(params.pageProxy, params.planningPlant, true).then(() => { //Reset the equipment picker filter
                        params.equipmentExtension.reload();
                        params.funcLocExtension.reload();
                        return Promise.resolve(true);
                    });
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(params.pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), `UpdateEquipFuncLocAfterWorkOrderChange Error: ${err}`);
        }
        return Promise.resolve(true);
    }

    static getPersonNum(pageProxy) {
        let assignmentType = libCommon.getWorkOrderAssignmentType(pageProxy);

        if (assignmentType === '2') {
            return libCommon.getPersonnelNumber();
        } else {
            return '';
        }
    }

    /**
     * get the new OperationNo for the next new operation
     *
     * @static
     * @param {any} pageProxy
     * @returns
     *
     * @memberof OperationControlLibrary
     */
    static getOperationNo(pageProxy) {
        let onWoChangeSet = libCommon.isOnWOChangeset(pageProxy);
        if (onWoChangeSet) {
            return '0010';
        } else {
            return libPrivate._getParentWorkOrder(pageProxy, onWoChangeSet).then(parentWorkOrder => {
                let woODataId = parentWorkOrder['@odata.id'];
                return pageProxy.count('/SAPAssetManager/Services/AssetManager.service', `${woODataId}/Operations`, '$orderby=OrderId')
                    .then(resultCount => {
                        return resultCount;
                    });
            });
        }
    }

    /**
     * Funcational Location getter
     * @param {IPageProxy} pageProxy
     */
    static getFunctionalLocation(pageProxy) {
        let funcLocControl = pageProxy.evaluateTargetPath('#Page:WorkOrderOperationAddPage/#Control:FuncLocHierarchyExtensionControl');
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

        let funcLocControl = pageProxy.evaluateTargetPath('#Page:WorkOrderOperationAddPage/#Control:FuncLocHierarchyExtensionControl');
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
        let equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderOperationAddPage/#Control:EquipHierarchyExtensionControl');
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
            equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderOperationAddPage/#Control:OnlineEquipControl');
            if (equipControl !== undefined && equipControl.getValue() !== undefined) {
                equipment = equipControl.getValue();
                return equipment.split(' - ')[0];
            }
            return '';
        }
        equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderOperationAddPage/#Control:EquipHierarchyExtensionControl');
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
     * WorkOrderParent getter
     * @param {IPageProxy} pageProxy
     */
    static getWorkOrder(pageProxy) {
        let wo = libCommon.getTargetPathValue(pageProxy, '#Control:WorkOrderLstPkr/#Value');
        return libCommon.getListPickerValue(wo);
    }

    /**
     * get the equipment description based on equipment id
     *
     * @static
     * @param {any} pageProxy
     *
     * @memberof OperationControlLibrary
     */
    static getEquipmentDescription(context, equipId) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${equipId}'`)
            .then(equipments => {
                if (!libVal.evalIsEmpty(equipments)) {
                    return equipments.getItem(0).EquipDesc;
                } else {
                    return '';
                }
            });
    }

    /**
     * get the func loc description based on functional location intern id
     *
     * @static
     * @param {any} pageProxy
     *
     * @memberof OperationControlLibrary
     */
    static getFuncLocDescription(context, funcLocInternId) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$filter=FuncLocIdIntern eq '${funcLocInternId}'`)
            .then(funcLocs => {
                if (!libVal.evalIsEmpty(funcLocs)) {
                    return funcLocs.getItem(0).FuncLocDesc;
                } else {
                    return '';
                }
            });
    }

    /**
     * ControlKey getter
     * @param {IPageProxy} pageProxy
     */
    static getControlKey(pageProxy) {
        let controlKey = libCommon.getTargetPathValue(pageProxy, '#Control:ControlKeyLstPkr/#Value');
        return libCommon.getListPickerValue(controlKey);
    }

    /**
     * WorkCenterPlant getter
     * @param {IPageProxy} pageProxy
     */
    static getWorkCenterPlant(pageProxy) {
        let workCenterPlant = libCommon.getTargetPathValue(pageProxy, '#Control:WorkCenterPlantLstPkr/#Value');
        return libCommon.getListPickerValue(workCenterPlant);
    }

    /**
     * MainWorkCenter getter
     * @param {IPageProxy} pageProxy
     */
    static getMainWorkCenter(pageProxy) {
        let workCenter = libCommon.getTargetPathValue(pageProxy, '#Control:WorkCenterLstPkr/#Value');
        return libCommon.getListPickerValue(workCenter);
    }

    /**
     * Update the equipment list picker choices based on functional location
     * @param {*} pageProxy
     * @param {*} reset If true, reset filter to all equipment regardless of current func loc
     */
    static updateEquipment(pageProxy, planningPlant, reset = false) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let onWOChangeSet = libCommon.isOnWOChangeset(pageProxy);
            let parentWorkOrderPromise;

            if (planningPlant) {
                parentWorkOrderPromise = Promise.resolve({ PlanningPlant: planningPlant });
            } else if (pageProxy.getClientData() && pageProxy.getClientData().TempPlanningPlant) {
                parentWorkOrderPromise = Promise.resolve({ PlanningPlant: pageProxy.getClientData().TempPlanningPlant });
            } else {
                parentWorkOrderPromise = libPrivate._getParentWorkOrder(pageProxy, onWOChangeSet);
            }
            return parentWorkOrderPromise.then(parentWorkOrder => {
                let newPlanningPlant = '';
                if (parentWorkOrder && parentWorkOrder.PlanningPlant) {
                    newPlanningPlant = parentWorkOrder.PlanningPlant;
                }
                libCommon.setStateVariable(pageProxy, 'WODefaultPlanningPlant', newPlanningPlant);
                libCommon.setStateVariable(pageProxy, 'WODefaultReset', reset);
                let extension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
                pageProxy.getClientData().overrideValue = true;
                return extension.reload().then(() => {
                    return Promise.resolve(true);
                });
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), `UpdateEquipment Error: ${err}`);
        }
        return Promise.resolve(false);
    }

    /**
     * Update the functional location list picker after a new work order is selected
     * @param {*} pageProxy
     * @param {*} planningPlant
     */
    static updateFlocFilter(pageProxy, planningPlant) {
        try {
            libCommon.setStateVariable(pageProxy, 'WODefaultPlanningPlant', planningPlant);
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
            return extension.reload().then(() => {
                return Promise.resolve(true);
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), `UpdateFlocFilter Error: ${err}`);
        }
        return Promise.resolve(false);
    }

    /**
     * Update Functional Location control
     * @param {IPageProxy} pageProxy
     */
    static updateFloc(pageProxy) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let funcLocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
            let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();

            if (equipmentControlValue) {
                return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$filter=EquipId eq '${equipmentControlValue}'`).then(results => {
                    if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                        funcLocControl.setData(results.getItem(0).FuncLocIdIntern);
                    } else {
                        funcLocControl.setData('');
                    }
                    return Promise.resolve(true);
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), `UpdateFloc Error: ${err}`);
        }
        return Promise.resolve(false);
    }
}

/**
 * contains the private method of the Operation page
 *
 * @export
 * @class PrivateMethodLibrary
 */
export class PrivateMethodLibrary {
    /**
     *
     *
     * @static
     * @param {IPageProxy} context
     * @returns
     *
     * @memberof PrivateMethodLibrary
     */
    static _getParentWorkOrder(context, onWoChangeSet) {
        if (context.getClientData().ParentWorkOrder) {
            return Promise.resolve(context.getClientData().ParentWorkOrder);
        } else {
            if (onWoChangeSet) {
                let workOrderDV = libCommon.getStateVariable(context, 'WorkOrder');
                context.getClientData().ParentWorkOrder = workOrderDV;
                return Promise.resolve(workOrderDV);
            } else {
                let woReadLink = context.binding ? context.binding['@odata.readLink'] : '';
                let onCreate = libCommon.IsOnCreate(context);
                if (!onCreate) {
                    woReadLink = context.binding['@odata.readLink'] + '/WOHeader';
                }

                if (!woReadLink) {
                    try {
                        woReadLink = libCommon.getListPickerValue(libCommon.getTargetPathValue(context, '#Control:WorkOrderLstPkr/#Value'));
                    } catch (error) {
                        Logger.error('_getParentWorkOrder', error);
                        return Promise.resolve(false);
                    }
                }

                if (woReadLink) {  //We may not have a parent work order
                    return context.read('/SAPAssetManager/Services/AssetManager.service', woReadLink, [], '').then(workOrder => {
                        context.getClientData().ParentWorkOrder = workOrder.getItem(0);
                        return workOrder.getItem(0);
                    });
                }
                return Promise.resolve(false);
            }
        }
    }
}

export class OperationConstants {
    static FromWOrkOrderOperationListQueryOptions(context, useDataQuery = true) {
        let expands = 'WOObjectList_Nav,Tools,OperationMobileStatus_Nav/OverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav,WOOprDocuments_Nav/Document,NotifHeader_Nav,Components';
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
            expands = 'InspectionPoint_Nav,WOObjectList_Nav,Tools,OperationMobileStatus_Nav/OverallStatusCfg_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav,WOOprDocuments_Nav/Document';
        }
        if (useDataQuery) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.expand(expands);
            queryBuilder.orderBy('OrderId,OperationNo,OperationMobileStatus_Nav/MobileStatus');
            return queryBuilder;
        }
        libCommon.setStateVariable(context, 'CustomListFilter', '');
        return '$expand=' + expands +
            '&$orderby=OrderId,OperationNo,OperationMobileStatus_Nav/MobileStatus';
    }

    static OperationListQueryOptions(context) {
        const expandFields = ['WOObjectList_Nav', 'Tools', 'OperationMobileStatus_Nav', 'OperationMobileStatus_Nav/OverallStatusCfg_Nav', 'OperationLongText', 'WOHeader', 'WOHeader/OrderMobileStatus_Nav', 'WOHeader/UserTimeEntry_Nav', 'UserTimeEntry_Nav', 'WOHeader/WOPriority', 'Employee_Nav', 'WOOprDocuments_Nav/Document'];
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
            expandFields.push('InspectionPoint_Nav');
        }
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
            expandFields.push('EAMChecklist_Nav');
        }
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            expandFields.push('WOHeader/OrderISULinks,WOHeader/DisconnectActivity_Nav');
        }

        const expands = `$expand=${expandFields.join(',')}`;
        libCommon.setStateVariable(context, 'CustomListFilter', '');
        return ''
            + expands
            + '&$orderby=OrderId,OperationNo,ObjectKey,OperationMobileStatus_Nav/MobileStatus';
    }

    static OperationsObjectCardCollectionQueryOptions(context, top) {
        let queryOptions = this.OperationListQueryOptions(context);
        const expandIdx = queryOptions.indexOf('$expand=');
        const ampersanIdxdAfterExpand = queryOptions.indexOf('&', expandIdx);
        const expandStr = queryOptions.substring(expandIdx, ampersanIdxdAfterExpand);
        const topQueryOptions = top ? `&top=${top}` : '';

        queryOptions = queryOptions.replace(expandStr, `${expandStr},Confirmations,OperationMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav/NextOverallStatusCfg_Nav,EquipmentOperation,EquipmentOperation/Location_Nav,FunctionalLocationOperation,FunctionalLocationOperation/Location_Nav`);

        return `${queryOptions}${topQueryOptions}`;
    }

    static WCMOperationsFilter(context) {
        return `(WOHeader/OrderMobileStatus_Nav/SystemStatusCode ne null and substringof('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/WorkClearanceManagement.global').getValue()}', WOHeader/OrderMobileStatus_Nav/SystemStatusCode))`;
    }

    static notFinallyConfirmedFilter() {
        return 'Confirmations/all(wp : wp/FinalConfirmation ne \'X\')';
    }
}

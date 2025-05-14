import libCom from '../Common/Library/CommonLibrary';
import libForm from '../Common/Library/FormatLibrary';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import libThis from './NotificationLibrary';
import libDoc from '../Documents/DocumentLibrary';
import Logger from '../Log/Logger';
import { GlobalVar as globals } from '../Common/Library/GlobalCommon';
import malfunctionStartDate from './MalfunctionStartDate';
import malfunctionStartTime from './MalfunctionStartTime';
import malfunctionEndDate from './MalfunctionEndDate';
import malfunctionEndTime from './MalfunctionEndTime';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import IsAndroid from '../Common/IsAndroid';
import libPersona from '../Persona/PersonaLibrary';
import { WorkOrderDetailsPageName } from '../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import { WorkOrderOperationDetailsPageNameToOpen } from '../WorkOrders/Operations/Details/WorkOrderOperationDetailsPageToOpen';

export default class {
    static NormalizeSequenceNumber(value) {
        return value !== undefined ? value : '[Local]';
    }

    /**
     * Used for getting the Part Group on Notification Item/Task/Activity Details page
     * USAGE: Format Rule
     * REFERENCES: PMCatalogCodes
     * @param {IControlProxy}
     */
    static NotificationCodeGroupStr(context, type, codeGroup) {
        let notif = (context.binding.Notification || context.binding.Item.Notification);
        const isAssignedToCatalogProfile = (context.getPageProxy ? context.getPageProxy() : context).getClientData()[`IsAssignedToCatalogProfile[${type}]`];
        return this.CatalogCodeQuery(context, notif, type).then(function(result) {
            let read;
            let descProperty = isAssignedToCatalogProfile ? 'Description' : 'CodeGroupDesc';
            if (isAssignedToCatalogProfile) {
                read = context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogProfiles(CodeGroup='${codeGroup}',CatalogProfile='${result.CatalogProfile}',Catalog='${result.Catalog}')`, [], '');
            } else {
                read = context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], `$filter=Catalog eq '${result.Catalog}' and CodeGroup eq '${codeGroup}'`);
            }
            return read.then(function(data) {
                return libForm.getFormattedKeyDescriptionPair(context, data.getItem(0).CodeGroup, data.getItem(0)[descProperty]);
            });
        });
    }
    /**
     * Used for getting Part Details on Notification Item/Task/Activity Details page
     * USAGE: Format Rule
     * REFERENCES: PMCatalogCodes
     */
    static NotificationCodeStr(context, type, codeGroup, code) {
        let notif = (context.binding.Notification || context.binding.Item.Notification);
        return this.CatalogCodeQuery(context, notif, type).then(function(result) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${result.Catalog}',Code='${code}',CodeGroup='${codeGroup}')`, [], '')
                .then(function(data) {
                    return libForm.getFormattedKeyDescriptionPair(context, data.getItem(0).Code, data.getItem(0).CodeDescription);
                });
        });

    }
    /**
     * Used for updating the Notification Task/Activity Code picker, based on selection from Group Picker
     * USAGE: List On Change Rule
     * References: (N/A)
     */
    static NotificationTaskActivityCreateUpdateCode(context, type) {
        let selection = context.getValue();
        const page = context.getPageProxy().getControl('FormCellContainer');
        if (!page.isContainer()) {
            return Promise.resolve();
        }
        let targetList = page.getControl('CodeLstPkr');
        let specifier = targetList.getTargetSpecifier();

        if (selection.length > 0) {
            let notif = context.getPageProxy().binding;
            if (notif && (notif['@odata.type'] === '#sap_mobile.MyNotificationItem' || notif['@odata.type'] === '#sap_mobile.MyNotificationTask' || notif['@odata.type'] === '#sap_mobile.MyNotificationActivity')) {
                notif = notif.Notification;
            } else if (notif && (notif['@odata.type'] === '#sap_mobile.MyNotificationItemCause' || notif['@odata.type'] === '#sap_mobile.MyNotificationItemTask' || notif['@odata.type'] === '#sap_mobile.MyNotificationItemActivity')) {
                notif = notif.Item.Notification;
            } else {
                // Special case: Edit Notification Breakdown on WO Complete -- do not overwrite notif
                if ((notif && notif['@odata.type'] !== '#sap_mobile.MyNotificationHeader') || notif === null) {
                    // Final case: We're creating a fresh Notification + Item
                    notif = {
                        // eslint-disable-next-line brace-style
                        'NotificationType': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue'); } catch (e) { return ''; } })(),
                        // eslint-disable-next-line brace-style
                        'HeaderEquipment': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                        // eslint-disable-next-line brace-style
                        'HeaderFunctionLocation': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                        // eslint-disable-next-line brace-style
                        'ExternalWorkCenterId': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:MainWorkCenterListPicker/#SelectedValue'); } catch (e) { return ''; } })(),
                    };
                }
            }
            return this.CatalogCodeQuery(context, notif, type).then(function(result) {
                selection = selection[0].ReturnValue;

                specifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
                specifier.setReturnValue('{Code}');

                specifier.setEntitySet('PMCatalogCodes');
                specifier.setService('/SAPAssetManager/Services/AssetManager.service');

                specifier.setQueryOptions("$filter=Catalog eq '" + result.Catalog + "' and CodeGroup eq '" + selection + "'&$orderby=Code");
                libCom.setEditable(targetList, true);

                return targetList.setTargetSpecifier(specifier).then(() => {
                    targetList.setValue('');
                });
            });
        } else {
            targetList.setValue('');
            targetList.setEditable(false);
            return Promise.resolve();
        }
    }
    /**
     * Used for updating the Notification Item Part picker, based on selection from Part Group Picker
     * USAGE: List On Change Rule
     * References: (N/A)
     */
    static NotificationItemCreateUpdatePart(context) {
        let selection = context.getValue();
        const page = context.getPageProxy().getControl('FormCellContainer');

        if (!page.isContainer()) {
            return null;
        }
        let targetList = page.getControl('PartDetailsLstPkr');
        let specifier = targetList.getTargetSpecifier();

        if (selection.length > 0) {
            // Grab current notification (if it exists)
            let notif = context.getPageProxy().binding || {};

            if (notif['@odata.type'] === '#sap_mobile.MyNotificationItem') {
                notif = notif.Notification;
            } else if (notif['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
                notif = {
                    // eslint-disable-next-line brace-style
                    'NotificationType': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue'); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderEquipment': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderFunctionLocation': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'ExternalWorkCenterId': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:MainWorkCenterListPicker/#SelectedValue'); } catch (e) { return ''; } })(),
                };
            }

            return this.CatalogCodeQuery(context, notif, 'CatTypeObjectParts').then(function(result) {
                selection = selection[0].ReturnValue;

                specifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
                specifier.setReturnValue('{Code}');

                specifier.setEntitySet('PMCatalogCodes');
                specifier.setService('/SAPAssetManager/Services/AssetManager.service');

                specifier.setQueryOptions("$filter=Catalog eq '" + result.Catalog + "' and CodeGroup eq '" + selection + "'&$orderby=Code");
                libCom.setEditable(targetList, true);

                return targetList.setTargetSpecifier(specifier).then(() => {
                    targetList.setValue('');
                });
            });
        } else {
            targetList.setValue('');
            libCom.setEditable(targetList, false);
            return Promise.resolve();
        }
    }
    /**
     * Used for updating the Notification Item Damage picker, based on selection from Damage Group Picker
     * USAGE: List On Change Rule
     * References: (N/A)
     */
    static NotificationItemCreateUpdateDamage(context) {
        let selection = context.getValue();
        const page = context.getPageProxy().getControl('FormCellContainer');
        if (!page.isContainer()) {
            return null;
        }
        let targetList = page.getControl('DamageDetailsLstPkr');
        let specifier = targetList.getTargetSpecifier();

        if (selection.length > 0) {
            // Grab current notification (if it exists)
            let notif = context.getPageProxy().binding || {};

            if (notif['@odata.type'] === '#sap_mobile.MyNotificationItem') {
                notif = notif.Notification;
            } else if (notif['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
                notif = {
                    // eslint-disable-next-line brace-style
                    'NotificationType': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue'); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderEquipment': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderFunctionLocation': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'ExternalWorkCenterId': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:MainWorkCenterListPicker/#SelectedValue'); } catch (e) { return ''; } })(),
                };
            }

            return this.CatalogCodeQuery(context, notif, 'CatTypeDefects').then(function(result) {
                selection = selection[0].ReturnValue;

                specifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
                specifier.setReturnValue('{Code}');

                specifier.setEntitySet('PMCatalogCodes');
                specifier.setService('/SAPAssetManager/Services/AssetManager.service');

                specifier.setQueryOptions("$filter=Catalog eq '" + result.Catalog + "' and CodeGroup eq '" + selection + "'&$orderby=Code");
                libCom.setEditable(targetList, true);

                return targetList.setTargetSpecifier(specifier).then(() => {
                    targetList.setValue('');
                });
            });
        } else {
            targetList.setValue('');
            libCom.setEditable(targetList, false);
            return Promise.resolve();
        }
    }
    /**
     *
     */
    static async NotificationCreateUpdatePrioritySelector(context) {
        let selection = context.getValue();
        let page = context.getPageProxy();

        // Set priorities based on Notification Type
        if (selection.length > 0) {
            selection = selection[0].ReturnValue;
            let priorityType = await context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${selection}'`).then(res => res.getItem(0).PriorityType);
            let priorities = await context.count('/SAPAssetManager/Services/AssetManager.service', 'Priorities', `$filter=PriorityType eq '${priorityType}'`);
            let targetList = (function() {
                let prioritySeg = page.evaluateTargetPathForAPI('#Control:PrioritySeg');
                let priorityLstPkr = page.evaluateTargetPathForAPI('#Control:PriorityLstPkr');
                // Per PO, we should only show 5 or fewer items in a segmented control. If more than 5 priorities, read from picker instead
                if (priorities > 5) {
                    priorityLstPkr.setVisible(true);
                    prioritySeg.setVisible(false);
                    return priorityLstPkr;
                } else {
                    priorityLstPkr.setVisible(false);
                    prioritySeg.setVisible(true);
                    return prioritySeg;
                }
            })();
            let specifier = targetList.getTargetSpecifier();
            specifier.setDisplayValue('{PriorityDescription}');
            specifier.setReturnValue('{Priority}');
            specifier.setEntitySet('Priorities');
            specifier.setService('/SAPAssetManager/Services/AssetManager.service');
            specifier.setQueryOptions(`$orderby=Priority&$filter=PriorityType eq '${priorityType}'`);
            let prioritySetter = targetList.setTargetSpecifier(specifier).then(function() {
                let binding = targetList.getBindingObject();
                if (binding.Priority === undefined) {
                    binding.Priority = libCom.getAppParam(targetList, 'NOTIFICATION', 'Priority');
                }
                targetList.setValue(binding.Priority);
            });

            let filters = [`NotifType eq '${selection}' and PartnerIsMandatory eq 'X'`, 'sap.entityexists(PartnerFunction_Nav)'];
            return prioritySetter.then(() => libThis.UpdatePartnerControls(context, filters));
        }
        return Promise.resolve();
    }

    static getRequiredMark(context) {
        return libPersona.isFieldServiceTechnician(context) ? '*' : '';
    }

    static async UpdatePartnerControls(context, filters) {
        let page = context.getPageProxy();
        let partnerSection = page.getControl('FormCellContainer').getSection('PartnerPickerSection');
        let partner1Picker = page.evaluateTargetPathForAPI('#Control:PartnerPicker1');
        let partner2Picker = page.evaluateTargetPathForAPI('#Control:PartnerPicker2');
        let queryOpts = `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=${filters.join(' and ')}`;
        const requiredMark = this.getRequiredMark(context);

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], queryOpts).then(result => {
            if (result.length > 0) {
                partnerSection.setVisible(true);

                let partner1 = result.getItem(0);

                if (IsAndroid(context)) {
                    partner1Picker._control.observable().setFilterCaption(`${partner1.PartnerFunction_Nav.Description}${requiredMark}`);
                } else {
                    partner1Picker._control._model.model.data.Caption = `${partner1.PartnerFunction_Nav.Description}${requiredMark}`;
                }

                partner1Picker.setVisible(true);
                let specifier1 = libThis.setPartnerPickerTarget(partner1.PartnerFunction_Nav.PartnerFunction, partner1Picker);

                if (result.length > 1) {
                    let partner2 = result.getItem(1);

                    if (IsAndroid(context)) {
                        partner2Picker._control.observable().setFilterCaption(`${partner2.PartnerFunction_Nav.Description}${requiredMark}`);
                    } else {
                        partner2Picker._control._model.model.data.Caption = `${partner2.PartnerFunction_Nav.Description}${requiredMark}`;
                    }
                    partner2Picker.setVisible(true);
                    let specifier2 = libThis.setPartnerPickerTarget(partner2.PartnerFunction_Nav.PartnerFunction, partner2Picker);

                    return Promise.all([specifier1, specifier2]);
                } else {
                    // Hide Partner 2 picker
                    partner2Picker.setVisible(false);
                    partner2Picker.setValue('');
                    return specifier1;
                }
            } else {
                // Hide partner section entirely
                partner1Picker.setValue('').setVisible(false);
                partner2Picker.setValue('').setVisible(false);
                partnerSection.setVisible(false);
                return Promise.resolve();
            }
        });
    }

    static GroupQuery(context, notification, type) {
        return this.CatalogCodeQuery(context, notification, type).then(function(value) {
            const isAssignedToCatalogProfile = (context.getPageProxy ? context.getPageProxy() : context).getClientData()[`IsAssignedToCatalogProfile[${type}]`];
            if (isAssignedToCatalogProfile) {
                return "$filter=Catalog eq '" + value.Catalog + "' and CatalogProfile eq '" + value.CatalogProfile + "'&$orderby=Catalog,CatalogProfile,CodeGroup";
            } else {
                return "$filter=Catalog eq '" + value.Catalog + "'&$orderby=Catalog,CodeGroup";
            }
        });
    }

    static CatalogCodeQuery(context, notification, type) {

        // We are not assigning EntitySet for Equipment and Functional Location to save the performance of this function. 
        //If the functional location or equipment is not selected, then we are returning the promise to avoid unnecessary reading
        let equipEntitySet = '';
        let flocEntitySet = '';
        let equipQuery, flocQuery = '';
        let workcenterEntitySet = 'WorkCenters';
        let workCenterQuery = '$filter=length(CatalogProfile) gt 0';

        // If we are not on a changeset (and do have a valid readLink)
        if (notification['@odata.readLink'] && notification['@odata.readLink'] !== 'pending_1') {
            equipEntitySet = notification['@odata.readLink'] + '/Equipment';
            flocEntitySet = notification['@odata.readLink'] + '/FunctionalLocation';

            equipQuery = '';
            flocQuery = '';
        }

        if (notification.HeaderEquipment) {
            equipEntitySet = 'MyEquipments';
            equipQuery = "$filter=EquipId eq '" + notification.HeaderEquipment + "' and length(CatalogProfile) gt 0";
        }

        if (notification.HeaderFunctionLocation) {
            flocEntitySet = 'MyFunctionalLocations';
            flocQuery = "$filter=FuncLocIdIntern eq '" + notification.HeaderFunctionLocation + "' and length(CatalogProfile) gt 0";
        }

        if (notification.MainWorkCenter) {
            workCenterQuery = "$filter=WorkCenterId eq '" + notification.MainWorkCenter + "' and length(CatalogProfile) gt 0";
        } else if (notification.ExternalWorkCenterId) {
            workCenterQuery = "$filter=ExternalWorkCenterId eq '" + notification.ExternalWorkCenterId + "' and length(CatalogProfile) gt 0";
        }

        // Handle optional order overrides
        let order = ['Equipment', 'FunctionalLocation', 'WorkCenter', 'NotificationType'];
        if (globals.getAppParam().CATALOGTYPE.CatalogProfileOrder) {
            order = globals.getAppParam().CATALOGTYPE.CatalogProfileOrder.split(/, ?/);
        }

        let reads = [];

        // Equipment Read
        if (!ValidationLibrary.evalIsEmpty(equipEntitySet) || !ValidationLibrary.evalIsEmpty(equipQuery)) {
            reads.push(context.read('/SAPAssetManager/Services/AssetManager.service', equipEntitySet, [], equipQuery));
        } else {
            reads.push(Promise.resolve([]));
        }
        // Functional Location Read
        if (!ValidationLibrary.evalIsEmpty(flocEntitySet) || !ValidationLibrary.evalIsEmpty(flocQuery)) {
            reads.push(context.read('/SAPAssetManager/Services/AssetManager.service', flocEntitySet, [], flocQuery));
        } else {
            reads.push(Promise.resolve([]));
        } 
        // WorkCenter Read
        reads.push(workCenterQuery ? context.read('/SAPAssetManager/Services/AssetManager.service', workcenterEntitySet, [], workCenterQuery) : Promise.resolve([]));
        // Notification Type Read
        reads.push(notification.NotificationType ? context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${notification.NotificationType}' and length(CatalogProfile) gt 0`) : Promise.resolve([]));

        return Promise.all(reads).then(function(readResults) {

            // Handle optional Catalog Type overrides and populate defaults
            let catalogs = { 'CatTypeActivities': '', 'CatTypeObjectParts': '', 'CatTypeDefects': '', 'CatTypeTasks': '', 'CatTypeCauses': '', 'CatTypeCoding': '' };
            for (let catType in catalogs) {
                if (readResults[3].getItem(0) && readResults[3].getItem(0)[catType]) {
                    catalogs[catType] = readResults[3].getItem(0)[catType];
                } else {
                    catalogs[catType] = globals.getAppParam().CATALOGTYPE[catType];
                }
            }

            let readResultsAssoc = {
                'Equipment': readResults[0],
                'FunctionalLocation': readResults[1],
                'WorkCenter': readResults[2],
                'NotificationType': readResults[3],
            };

            let catalogProfileResults = [];

            for (let i in order) {
                let current = readResultsAssoc[order[i]];

                if (current.length > 0 && current.getItem(0).CatalogProfile) {
                    catalogProfileResults.push(Promise.resolve(current.getItem(0)).then(function(value) {
                        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogProfiles', `$filter=Catalog eq '${catalogs[type]}' and CatalogProfile eq '${value.CatalogProfile}'&$orderby=Catalog,CatalogProfile`).then(function(cnt) {
                            return { item: value, count: cnt, catalogProfile: value.CatalogProfile };
                        });
                    }));
                }
            }

            return Promise.all(catalogProfileResults).then(function(codeReadResults) {
                const stateVarName = `IsAssignedToCatalogProfile[${type}]`;
                const clientData = (context.getPageProxy ? context.getPageProxy() : context).getClientData();
                for (let i in codeReadResults) {
                    if (codeReadResults[i].count > 0) {
                        clientData[stateVarName] = true;
                        if (codeReadResults[i].item['@odata.type'] === '#sap_mobile.NotificationType') {
                            return { 'Catalog': codeReadResults[i].item[type], 'CatalogProfile': codeReadResults[i].catalogProfile };
                        }
                        return { 'Catalog': catalogs[type], 'CatalogProfile': codeReadResults[i].catalogProfile };
                    }
                }
                clientData[stateVarName] = false;
                return { 'Catalog': catalogs[type], 'CatalogProfile': readResults[3].getItem(0) && readResults[3].getItem(0).CatalogProfile };
            });
        }).catch(error => {
            Logger.error('CatalogCodeQuery', error);
            return {};
        });
    }

    /**
     * Used for setting the List Target QueryOptions for Notification Task/Activity Group
     * USAGE: Target QueryOptions
     * References: MyEquipments, MyFunctionalLocations, NotificationTypes
     */
    static NotificationTaskActivityGroupQuery(context, type) {
        let binding = context.getPageProxy().binding;
        if (binding && (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader' || binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic')) {
            // Simple case: we're on a Notification already
            binding.HeaderFunctionLocation = context.getPageProxy().getControl('FormCellContainer')?.getControl('FuncLocHierarchyExtensionControl')?.getValue() || binding.HeaderFunctionLocation;
            binding.HeaderEquipment =  context.getPageProxy().getControl('FormCellContainer')?.getControl('EquipHierarchyExtensionControl')?.getValue() || binding.HeaderEquipment;
            return this.GroupQuery(context, binding, type);
        } else {
            // Alternate case: we're on an Item, Task, or Activity
            if (binding && binding['@odata.readLink'] && (binding['@odata.type'] === '#sap_mobile.MyNotificationItem' || binding['@odata.type'] === '#sap_mobile.MyNotificationTask' || binding['@odata.type'] === '#sap_mobile.MyNotificationActivity')) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Notification', [], '')
                    .then(function(data) {
                        return libThis.GroupQuery(context, data.getItem(0), type);
                    });
            } else if (binding && binding['@odata.readLink'] && (binding['@odata.type'] === '#sap_mobile.MyNotificationItemTask')) {
                return libThis.GroupQuery(context, binding.Item.Notification, type);
            } else {
                // Final case: We're creating a fresh Notification + Item
                binding = {
                    // eslint-disable-next-line brace-style
                    'NotificationType': (function() { try { return context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue'); } catch (e) { return binding.NotificationType || ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderEquipment': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderFunctionLocation': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'ExternalWorkCenterId': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:MainWorkCenterListPicker/#SelectedValue'); } catch (e) { return ''; } })(),
                };
                return this.GroupQuery(context, binding, type);
            }
        }
    }

    static NotificationTaskActivityCodeQuery(context, type, codeGroupName) {
        try {
            const codeGroup = libCom.getTargetPathValue(context, '#Property:' + codeGroupName);
            if (libCom.isDefined(codeGroup)) {
                libCom.setEditable(context, true);
            } else {
                libCom.setEditable(context, false);
            }
            let notif = context.getPageProxy().binding;

            if (notif && (notif['@odata.type'] === '#sap_mobile.MyNotificationItem' || notif['@odata.type'] === '#sap_mobile.MyNotificationActivity' || notif['@odata.type'] === '#sap_mobile.MyNotificationTask')) {
                notif = notif.Notification;
            } else if (notif && notif['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                notif = libCom.getStateVariable(context, 'CreateNotification');
            } else if (notif && notif['@odata.type'] === '#sap_mobile.MyNotificationItemCause' || notif['@odata.type'] === '#sap_mobile.MyNotificationItemTask' || notif['@odata.type'] === '#sap_mobile.MyNotificationItemActivity') {
                notif = notif.Item.Notification;
            }
            if (notif) {
                return this.CatalogCodeQuery(context, notif, type).then(function(result) {
                    return "$filter=Catalog eq '" + result.Catalog + "' and CodeGroup eq '" + codeGroup + "'&$orderby=Code,CodeGroup,Catalog";
                });
            } else {
                return '';
            }
        } catch (exception) {
            return '';
        }
    }

    /**
     * Used for setting the List Target QueryOptions for Notification Item Task/Activity Group
     * USAGE: Target QueryOptions
     * References: MyEquipments, MyFunctionalLocations, NotificationTypes
     */
    static NotificationItemTaskActivityGroupQuery(context, type) {
        const notificationItem = context.getPageProxy().binding;
        let parent = this;

        let specifier = '/Notification';

        // Special case: Edit Notification Breakdown on WO Complete
        if (notificationItem['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
            specifier = '';
        } else if (notificationItem['@odata.type'] !== '#sap_mobile.MyNotificationItem') {
            specifier = '/Item' + specifier;
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', notificationItem['@odata.readLink'] + specifier, [], '')
            .then(function(data) {
                return parent.GroupQuery(context, data.getItem(0), type);
            }, () => {
                // Final case: We're creating a fresh Notification + Item
                let binding = {
                    // eslint-disable-next-line brace-style
                    'NotificationType': (function() { try { return context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue'); } catch (e) { return notificationItem.NotificationType || ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderEquipment': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'HeaderFunctionLocation': (function() { try { return context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue(); } catch (e) { return ''; } })(),
                    // eslint-disable-next-line brace-style
                    'ExternalWorkCenterId': (function() { try { return context.getPageProxy().evaluateTargetPath('#Control:MainWorkCenterListPicker/#SelectedValue'); } catch (e) { return ''; } })(),
                };
                return parent.GroupQuery(context, binding, type);
            });
    }

    ////////////////////////////////////////////////////

    static NotificationPriority(context, notificationType, priority) {
        try {
            if (priority !== undefined && priority !== null) {
                let pageBinding = context.getPageProxy().getClientData();

                if (pageBinding.NotificationTypes && pageBinding.Priorities) {
                    return pageBinding.Priorities[pageBinding.NotificationTypes[notificationType]][priority];
                } else {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], '').then(function(data) {
                        // Make a dictionary cache of Notification Types
                        // pageBinding.NotificationTypes[NotifType] => PriorityType
                        pageBinding.NotificationTypes = Object();
                        data.forEach(function(value) {
                            pageBinding.NotificationTypes[value.NotifType] = value.PriorityType;
                        });
                        return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], '').then(function(priorityData) {
                            // Make a cache of Priorities
                            // pageBinding.Priorities[PriorityType] => {Priority, PriorityDescription}
                            pageBinding.Priorities = Object();
                            priorityData.forEach(function(value) {
                                let priorityMapping = pageBinding.Priorities[value.PriorityType];
                                if (!priorityMapping) {
                                    priorityMapping = {};
                                }
                                priorityMapping[value.Priority] = value.PriorityDescription;
                                pageBinding.Priorities[value.PriorityType] = priorityMapping;
                            });

                            // Return value
                            return pageBinding.Priorities[pageBinding.NotificationTypes[notificationType]][priority];
                        });
                    });
                }
            } else {
                return context.localizeText('unknown');
            }
        } catch (exception) {
            /**Implementing our Logger class*/
            Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotes.global').getValue(), '#Priority:Priority could not be evaluated. Returning Unknown.');
            return context.localizeText('unknown');
        }
    }

    /**
     * Set the FromWorkorder flag
     * @param {IPageProxy} context
     * @param {boolean} FlagValue
     */
    static setAddFromJobFlag(context, FlagValue) {
        libCom.setStateVariable(context, 'NotificationFromWorkorder', FlagValue, WorkOrderDetailsPageName(context));
    }

    /**
     * Set the FromWorkorder flag
     * @param {IPageProxy} context
     * @param {boolean} FlagValue
     */
    static setAddFromOperationFlag(context, FlagValue) {
        libCom.setStateVariable(context, 'NotificationFromOperation', FlagValue, WorkOrderOperationDetailsPageNameToOpen(context));
    }

    /**
     * Set the FromWorkorder flag
     * @param {IPageProxy} context
     * @param {boolean} FlagValue
     */
    static setAddFromSuboperationFlag(context, FlagValue) {
        libCom.setStateVariable(context, 'NotificationFromSubOperation', FlagValue);
    }

    /**
     * gets the FromWorkorder flag
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     *
     * @memberof WorkOrderLibrary
     */
    static getAddFromJobFlag(context) {
        let result = libCom.getStateVariable(context, 'NotificationFromWorkorder', WorkOrderDetailsPageName(context));
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    static getAddFromOperationFlag(context) {
        let result = libCom.getStateVariable(context, 'NotificationFromOperation', WorkOrderOperationDetailsPageNameToOpen(context));
        if (result) {
            return result;
        } else {
            return false;
        }
    }
    static getAddFromSuboperationFlag(context) {
        let result = libCom.getStateVariable(context, 'NotificationFromSubOperation');
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    /**
     * Set the FromMap flag
     * @param {IPageProxy} context
     * @param {boolean} FlagValue
     */
    static setAddFromMapFlag(context, FlagValue) {
        libCom.setStateVariable(context, 'NotificationFromMap', FlagValue);
    }


    /**
     * gets the FromMap flag
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     */
    static getAddFromMapFlag(context) {
        let result = libCom.getStateVariable(context, 'NotificationFromMap');
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    /**
     * Set the FromEquipment flag
     * @param {IPageProxy} context
     * @param {boolean} FlagValue
     */
    static setAddFromEquipmentFlag(context, FlagValue) {
        libCom.setStateVariable(context, 'NotificationFromEquipment', FlagValue, 'EquipmentDetailsPage');
    }


    /**
     * gets the FromEquipment flag
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     */
    static getAddFromEquipmentFlag(context) {
        let result = libCom.getStateVariable(context, 'NotificationFromEquipment', 'EquipmentDetailsPage');
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    /**
    * Set the FromFuncLoc flag
    * @param {IPageProxy} context
    * @param {boolean} FlagValue
    */
    static setAddFromFuncLocFlag(context, FlagValue) {
        libCom.setStateVariable(context, 'NotificationFromFunctionalLocation', FlagValue, 'FunctionalLocationDetails');
    }


    /**
     * gets the FromFuncLoc flag
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     */
    static getAddFromFuncLocFlag(context) {
        let result = libCom.getStateVariable(context, 'NotificationFromFunctionalLocation', 'FunctionalLocationDetails');
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    static NotificationCreateMainWorkCenter(context) {
        let mainWorkcenterPicker = context.getControls()[0].getControl('MainWorkCenterListPicker').getValue();
        let mainWorkcenter = mainWorkcenterPicker.length ? mainWorkcenterPicker[0].ReturnValue : '';

        if (!mainWorkcenter && libCom.getNotificationAssignmentType(context) === '5') {
            mainWorkcenter = libCom.getUserDefaultWorkCenter();
        }

        if (mainWorkcenter) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], "$filter=ExternalWorkCenterId eq '" + mainWorkcenter + "'")
                .then(function(result) {
                    return result.getItem(0).WorkCenterId;
                });
        } else {
            return '';
        }
    }

    static NotificationCreateMainWorkCenterPlant(context) {
        if (libCom.getNotificationAssignmentType(context) === '5') {
            return libCom.getNotificationPlanningPlant(context);
        }
        return '';
    }

    static NotificationCreateDefaultPlant(context) {
        return libCom.getUserDefaultPlant() || libCom.getNotificationPlanningPlant(context);
    }

    static NotificationCreateUpdateEquipmentLstPkrValue(context) {
        let page = context.evaluateTargetPathForAPI('#Page:NotificationAddPage') || context.evaluateTargetPath('#Page:DefectCreateUpdatePage');
        let equipValue = page.evaluateTargetPath('#Control:EquipHierarchyExtensionControl').getValue();

        if (!ValidationLibrary.evalIsEmpty(equipValue)) {
            if (libCom.isCurrentReadLinkLocal(equipValue)) {
                return libCom.getEntityProperty(context, `MyEquipments(${equipValue})`, 'EquipId').then(equipmentId => {
                    return equipmentId;
                });
            }
            return equipValue;
        }
        return '';
    }

    static NotificationCreateUpdateFunctionalLocationLstPkrValue(context) {
        let page = context.evaluateTargetPathForAPI('#Page:NotificationAddPage') || context.evaluateTargetPath('#Page:DefectCreateUpdatePage');
        let flocValue = page.evaluateTargetPath('#Control:FuncLocHierarchyExtensionControl').getValue();

        if (!ValidationLibrary.evalIsEmpty(flocValue)) {
            if (libCom.isCurrentReadLinkLocal(flocValue)) {
                return libCom.getEntityProperty(context, `MyFunctionalLocations(${flocValue})`, 'FuncLocIdIntern').then(flocIdIntern => {
                    return flocIdIntern;
                });
            }
            return flocValue;
        }
        return '';
    }

    static NotificationCreateUpdateTypeLstPkrValue(context) {
        let typeListPicker = libCom.getTargetPathValue(context, '#Control:TypeLstPkr/#Value');
        return libCom.getListPickerValue(typeListPicker);
    }

    static NotificationCreateUpdatePrioritySegValue(context) {
        let segmentIsVisible = context.evaluateTargetPathForAPI('#Control:PrioritySeg').getVisible();
        if (segmentIsVisible) {
            return (function() {
                try {
                    return context.evaluateTargetPath('#Control:PrioritySeg/#SelectedValue');
                } catch (exc) {
                    return '';
                }
            })();
        } else {
            return (function() {
                try {
                    return context.evaluateTargetPath('#Control:PriorityLstPkr/#SelectedValue');
                } catch (exc) {
                    return '';
                }
            })();
        }
    }

    static NotificationCreateUpdateBreakdownSwitchValue(context) {
        return libCom.getTargetPathValue(context, '#Control:BreakdownSwitch/#Value') !== '';
    }

    static NotificationCreateUpdateOrderId(context) {
        if (!ValidationLibrary.evalIsEmpty(libCom.getTargetPathValue(context, '#Property:OrderId'))) {
            return libCom.getTargetPathValue(context, '#Property:OrderId');
        } else if (libThis.getAddFromJobFlag(context)) {
            let workOrder = context.evaluateTargetPathForAPI(`#Page:${WorkOrderDetailsPageName(context)}`).getBindingObject();
            if (workOrder) {
                return workOrder.OrderId;
            }
        }
        return '';
    }

    /**
     * Handle error and warning processing for Notification create/update
     */
    static NotificationCreateUpdateValidation(context) {

        let dict = libCom.getControlDictionaryFromPage(context);
        dict.NotificationDescription.clearValidation();
        if (dict.TypeLstPkr) {
            dict.TypeLstPkr.clearValidation();
        }
        let valPromises = [];
        valPromises.push(libThis.CharacterLimitValidation(context, dict.NotificationDescription));
        valPromises.push(libThis.ValidateNoteNotEmpty(context, dict.NotificationDescription));
        valPromises.push(libThis.ValidateEndDate(context, dict.MalfunctionEndDatePicker));

        // check attachment count, run the validation rule if there is an attachment
        if (libDoc.attachmentSectionHasData(context)) {
            valPromises.push(libDoc.createValidationRule(context));
        }

        // if all resolved -> return true
        // if at least 1 rejected -> return false
        return Promise.allSettled(valPromises).then(results => {
            const pass = results.every(r => r.status === 'fulfilled');
            if (!pass) {
                throw new Error();
            }
            return true;
        }).catch(() => {
            let container = context.getControl('FormCellContainer');
            container.redraw();
            return false;
        });
    }

    /**
     * Handle error and warning processing for notification malfunction end date edit screen
     */
    static NotificationUpdateMalfunctionEndValidation(context) {

        let dict = libCom.getControlDictionaryFromPage(context);
        dict.MalfunctionEndDatePicker.clearValidation();

        let valPromises = [];
        valPromises.push(libThis.ValidateEndDate(context, dict.MalfunctionEndDatePicker));

        return Promise.all(valPromises).then((results) => {
            const pass = results.reduce((total, value) => {
                return total && value;
            });
            if (!pass) {
                throw new Error();
            }
            return true;
        }).catch(() => {
            let container = context.getControl('FormCellContainer');
            container.redraw();
            return false;
        });
    }

    /**
     * End date must be >= start date
     * @param {*} context
     * @param {*} control
     */
    static ValidateEndDate(context, control) {

        let startDate = malfunctionStartDate(context);
        let startTime = malfunctionStartTime(context);
        let endDate = malfunctionEndDate(context);
        let endTime = malfunctionEndTime(context);

        let start = libCom.getControlProxy(context, 'BreakdownStartSwitch').getValue();
        let end = libCom.getControlProxy(context, 'BreakdownEndSwitch').getValue();
        let breakdown = libCom.getControlProxy(context, 'BreakdownSwitch').getValue();

        // Validates that end time is greater than start time
        if (start && end) {
            let startDateTime = new OffsetODataDate(context, startDate, startTime).date();
            let endDateTime = new OffsetODataDate(context, endDate, endTime).date();

            if (startDateTime > endDateTime) {
                //Show all the malfunction controls.  They may not be visible depending on state of breakdown slider
                if (!breakdown) {
                    let formCellContainer = context.getControl('FormCellContainer');
                    formCellContainer.getControl('MalfunctionStartDatePicker').setVisible(true);
                    formCellContainer.getControl('MalfunctionStartTimePicker').setVisible(true);
                    formCellContainer.getControl('MalfunctionEndDatePicker').setVisible(true);
                    formCellContainer.getControl('MalfunctionEndTimePicker').setVisible(true);
                    formCellContainer.getControl('BreakdownStartSwitch').setVisible(true);
                    formCellContainer.getControl('BreakdownEndSwitch').setVisible(true);
                }
                control.clearValidation();
                libCom.executeInlineControlError(context, control, context.localizeText('validation_start_time_must_be_before_end_time'));
                return Promise.reject(false);
            }
        }

        // Validates that start time is not in the future
        if (start) {
            let nowDateTime = new Date();
            let startDateTime = new OffsetODataDate(context, startDate, startTime).date();

            if (startDateTime > nowDateTime) {
                control.clearValidation();
                context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                    'Properties': {
                        'Title': context.localizeText('warning'),
                        'Message': context.localizeText('from_in_future'),
                        'CancelCaption': context.localizeText('cancel'),
                        'OKCaption': context.localizeText('ok'),
                    },
                });
                return Promise.reject(false);
            }
        }

        // Validates that end time is not in the future
        if (end) {
            let nowDateTime = new Date();
            let endDateTime = new OffsetODataDate(context, endDate, endTime).date();

            if (endDateTime > nowDateTime) {
                control.clearValidation();
                context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                    'Properties': {
                        'Title': context.localizeText('warning'),
                        'Message': context.localizeText('validation_end_time_cant_be_greater_actual'),
                        'CancelCaption': context.localizeText('cancel'),
                        'OKCaption': context.localizeText('ok'),
                    },
                });
                return Promise.reject(false);
            }
        }
        return Promise.resolve(true);
    }

    static CharacterLimitValidation(context, control) {
        control.clearValidation();
        let descriptionLength = String(control.getValue()).length;
        let characterLimit = libCom.getAppParam(context, 'NOTIFICATION', 'DescriptionLength');
        let characterLimitInt = parseInt(characterLimit);

        if (descriptionLength <= characterLimitInt) {
            return Promise.resolve(true);
        } else {
            let dynamicParams = [characterLimit];
            let message = context.localizeText('validation_maximum_field_length', dynamicParams);
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }
    }

    static ValidateNotificationTypeNotEmpty(context, control) {
        if (ValidationLibrary.evalIsEmpty(libCom.getListPickerValue(control.getValue()))) {
            let message = context.localizeText('field_is_required');
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }
        return Promise.resolve(true);
    }

    static ValidateNoteNotEmpty(context, control) {
        if (!ValidationLibrary.evalIsEmpty(control.getValue())) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('field_is_required');
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }

    }

    static ValidateControlIsRequired(context, control) {
        let pass = false;
        const value = control.getValue();
        if (Array.isArray(value)) {
            if (control.getValue()[0]) {
                pass = true;
            }
        } else {
            if (!ValidationLibrary.evalIsEmpty(value)) {
                pass = true;
            }
        }

        if (pass) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('is_required');
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        }

    }

    /**
     * validation rule of NotificationItem Create/Update action
     *
     * @static
     * @param {IPageProxy} context
     * @return {Boolean}
     */
    static NotificationTaskOrActivityCreateUpdateValidationRule(context) {
        let dict = libCom.getControlDictionaryFromPage(context);
        dict.DescriptionTitle.clearValidation();
        dict.GroupLstPkr.clearValidation();
        dict.CodeLstPkr.clearValidation();

        let valPromises = [];
        // put all validation promises on array
        valPromises.push(libThis.CharacterLimitValidation(context, dict.DescriptionTitle));
        valPromises.push(libThis.ValidateControlIsRequired(context, dict.GroupLstPkr));
        valPromises.push(libThis.ValidateControlIsRequired(context, dict.CodeLstPkr));

        return Promise.all(valPromises).then(() => {
            return true;
        }).catch(() => {
            let container = context.getControl('FormCellContainer');
            container.redraw();
            return false;
        });
    }

    static createUpdateOnPageUnloaded(pageProxy) {
        //reset global state
        libCom.setOnCreateUpdateFlag(pageProxy, '');

    }

    /**
     * Formats the notification detail fields
     */
    static async notificationDetailsFieldFormat(sectionProxy, key) {

        let binding = sectionProxy.binding;
        let startDateTime;
        let endDateTime;
        const pageName = libCom.getPageName(sectionProxy);
        if (binding.MalfunctionStartDate) {
            startDateTime = new OffsetODataDate(sectionProxy, binding.MalfunctionStartDate, binding.MalfunctionStartTime);
        }
        if (binding.MalfunctionEndDate) {
            endDateTime = new OffsetODataDate(sectionProxy, binding.MalfunctionEndDate, binding.MalfunctionEndTime);
        }

        let value = '-';
        switch (key) {
            case 'MalfunctionStartDate':
                if (binding.MalfunctionStartDate && startDateTime) {
                    value = sectionProxy.formatDate(startDateTime.date());
                }
                return pageName === 'NotificationAddPage' && startDateTime ? startDateTime.date().toISOString() : value;
            case 'MalfunctionStartTime':
                if (binding.MalfunctionStartTime && startDateTime) {
                    value = sectionProxy.formatTime(startDateTime.date());
                }
                return pageName === 'NotificationAddPage' && startDateTime ? startDateTime.date().toISOString() : value;
            case 'MalfunctionEndDate':
                if (binding.MalfunctionEndDate && endDateTime) {
                    value = sectionProxy.formatDate(endDateTime.date());
                }
                return pageName === 'NotificationAddPage' && endDateTime ? endDateTime.date().toISOString() : value;
            case 'MalfunctionEndTime':
                if (binding.MalfunctionEndTime && endDateTime) {
                    value = sectionProxy.formatTime(endDateTime.date());
                }
                return pageName === 'NotificationAddPage' && endDateTime ? endDateTime.date().toISOString() : value;
            case 'Breakdown':
                if (binding.BreakdownIndicator) {
                    value = sectionProxy.localizeText('yes');
                } else {
                    value = sectionProxy.localizeText('no');
                }
                return value;
            case 'Effect':
                if (binding.Effect_Nav) {
                    value = `${binding.Effect_Nav.Effect} - ${binding.Effect_Nav.EffectDescription}`;
                }
                return value;
            case 'QMCodeGroup':
                if (binding.QMCatalog && binding.QMCodeGroup) {
                    return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', ['CatalogProfile'], `$filter=NotifType eq '${binding.NotificationType}'`).then(catalogProfileArray => {
                        if (catalogProfileArray.length > 0) {
                            return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogProfiles(CatalogProfile='${catalogProfileArray.getItem(0).CatalogProfile}',Catalog='${binding.QMCatalog}',CodeGroup='${binding.QMCodeGroup}')`, ['CodeGroup', 'Description'], '').then(pmCatalogProfileArray => {
                                if (pmCatalogProfileArray.length > 0) {
                                    let pmCatalogProfile = pmCatalogProfileArray.getItem(0);
                                    value = `${pmCatalogProfile.CodeGroup} - ${pmCatalogProfile.Description}`;
                                }
                                return value;
                            });
                        }

                        return value;
                    });
                }
                return value;
            case 'QMCode':
                if (binding.QMCatalog && binding.QMCodeGroup && binding.QMCode) {
                    return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${binding.QMCatalog}',CodeGroup='${binding.QMCodeGroup}',Code='${binding.QMCode}')`, ['Code', 'CodeDescription'], '').then(pmCatalogCodeArray => {
                        if (pmCatalogCodeArray.length > 0) {
                            let pmCatalogCode = pmCatalogCodeArray.getItem(0);
                            value = `${pmCatalogCode.Code} - ${pmCatalogCode.CodeDescription}`;
                        }
                        return value;
                    });
                }
                return value;
            case 'DetectionGroup':
                if (binding.DetectionGroup_Nav) {
                    value = `${binding.DetectionGroup_Nav.DetectionGroup} - ${binding.DetectionGroup_Nav.DetectionGroupDesc}`;
                }
                return value;
            case 'DetectionMethod':
                if (binding.DetectionCode_Nav) {
                    value = `${binding.DetectionCode_Nav.DetectionCode} - ${binding.DetectionCode_Nav.DetectionCodeDesc}`;
                }
                return value;
            case 'MalfunctionStartDateAndTime':
                if (startDateTime) {
                    value = sectionProxy.formatDatetime(startDateTime.date());
                }
                return value;
            case 'MalfunctionEndDateAndTime':
                if (endDateTime) {
                    value = sectionProxy.formatDatetime(endDateTime.date());
                }
                return value;
            case 'DetectionGroupAndMethod':
                if (binding.DetectionCode_Nav) {
                    const result = await Promise.all([
                        this.notificationDetailsFieldFormat(sectionProxy, 'DetectionGroup'),
                        this.notificationDetailsFieldFormat(sectionProxy, 'DetectionMethod'),
                    ]);

                    value = result.join(' / ');
                }
                return value;
            case 'FailureGroupAndMode': {
                if (binding.QMCatalog && binding.QMCodeGroup) {
                    const result = await Promise.all([
                        this.notificationDetailsFieldFormat(sectionProxy, 'QMCodeGroup'),
                        this.notificationDetailsFieldFormat(sectionProxy, 'DetectionGroup'),
                    ]);

                    value = result.join(' / ');
                }

                return value;
            }                
            default:
                return '';
        }
    }

    /**
     * Sets the query options for the controls that are driven by the Notification Type
     * @returns {Promise}
     */

    static setFailureAndDetectionGroupQuery(context) {

        let pageProxy = context.getPageProxy();
        let binding = pageProxy.binding;

        let formCellContainer = pageProxy.getControl('FormCellContainer');
        let typeListPicker = formCellContainer.getControl('TypeLstPkr');
        let notificationType = libCom.getListPickerValue(typeListPicker.getValue());

        let failureModeGroupPicker = formCellContainer.getControl('QMCodeGroupListPicker');
        let failureModeGroupspecifier = failureModeGroupPicker.getTargetSpecifier();

        let detectionGroupPicker = formCellContainer.getControl('DetectionGroupListPicker');
        let detectionGroupSpecifier = detectionGroupPicker.getTargetSpecifier();

        if (notificationType) {
            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${notificationType}')`, [], '').then(async result => {
                if (result && result.getItem(0)) {
                    let DetectionCatalog_Nav;
                    try {
                        DetectionCatalog_Nav = await pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `${result.getItem(0)['@odata.readLink']}/DetectionCatalog_Nav`, [], '').then(result2 => result2.getItem(0)).catch(() => null);
                    } catch (error) {
                        Logger.error('setFailureAndDetectionGroupQuery', error);
                    }
                    let catalogProfile = result.getItem(0).CatalogProfile;

                    let failureModeCatalogType = result.getItem(0).CatTypeCoding ? result.getItem(0).CatTypeCoding : 'D';
                    let failureModeGroupfilter = '';

                    if (catalogProfile) {
                        failureModeGroupfilter = `$filter=Catalog eq '${failureModeCatalogType}' and CatalogProfile eq '${catalogProfile}'&$orderby=CodeGroup`;
                    }

                    if (binding.DetectionCatalog && binding.DetectionCodeGroup) {//A value exists for Detection Group so set the appropriate query options for Detection Method
                        let detectionCodePicker = formCellContainer.getControl('DetectionMethodListPicker');
                        let detectionCodeSpecifier = detectionCodePicker.getTargetSpecifier();

                        let detectionCodeFilter = `$filter=DetectionCatalog eq '${binding.DetectionCatalog}' and DetectionGroup eq '${binding.DetectionCodeGroup}'&$orderby=DetectionCode`;
                        detectionCodeSpecifier.setQueryOptions(detectionCodeFilter);
                        detectionCodePicker.setEditable(true);
                        detectionCodePicker.setTargetSpecifier(detectionCodeSpecifier);
                    }

                    if (DetectionCatalog_Nav) {
                        let detectionGroupFilter = `$filter=DetectionCatalog eq '${DetectionCatalog_Nav.DetectionCatalog}'&$orderby=DetectionGroup`;

                        detectionGroupSpecifier.setQueryOptions(detectionGroupFilter);
                        detectionGroupPicker.setEditable(true);
                        detectionGroupPicker.setTargetSpecifier(detectionGroupSpecifier);
                    }

                    failureModeGroupspecifier.setQueryOptions(failureModeGroupfilter);
                    failureModeGroupPicker.setEditable(true);
                    return failureModeGroupPicker.setTargetSpecifier(failureModeGroupspecifier).then(() => {
                        if (binding.QMCatalog && binding.QMCodeGroup) {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', ['CatalogProfile'], `$filter=NotifType eq '${binding.NotificationType}'`).then(catalogProfileArray => {
                                if (catalogProfileArray.length > 0) {
                                    failureModeGroupPicker.setValue(`PMCatalogProfiles(CatalogProfile='${catalogProfileArray.getItem(0).CatalogProfile}',Catalog='${binding.QMCatalog}',CodeGroup='${binding.QMCodeGroup}')`);
                                }
                                return Promise.resolve(true);
                            });
                        }
                        return Promise.resolve(true);
                    });
                }
                return Promise.resolve();
            }, () => {
                // Read failed. Return a resolved promise to keep the picker happy.
                return Promise.resolve();
            });
        } else {
            failureModeGroupPicker.setEditable(false);
            failureModeGroupPicker.setValue('');

            detectionGroupPicker.setEditable(false);
            detectionGroupPicker.setValue('');

            return Promise.resolve();
        }
    }

    /**
     * Checks if context.binding object is a service notification or not.
     *
     * @param {*} context
     * @returns true if context.binding is a service notification.
     */
    static isServiceNotification(context) {
        let binding = context.binding;
        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
            binding = context.getPageProxy().binding;
        }
        if (libCom.isDefined(binding.isServiceNotification)) {
            return Promise.resolve(binding.isServiceNotification);
        }
        let notifType = binding.NotificationType;
        let serviceNotifCategory = context.getGlobalDefinition('/SAPAssetManager/Globals/Notifications/ServiceNotification.global').getValue();
        return libThis.getNotificationCategory(context, notifType).then(notifCategory => {
            binding.isServiceNotification = false;
            if (notifCategory === serviceNotifCategory) {
                binding.isServiceNotification = true;
            }
            return binding.isServiceNotification;
        });
    }

    /**
     * This function will look up the notification category based on the notification type which is given.
     * A notification category of 3 means it’s a service notification for CS.
     * A category of 2 means it’s a quality notification for QM. A category of 1 means it’s a normal notification.
     * @param {*} context
     * @returns Blank if no notification category is found in NotificationTypes entity-set.
     *          Otherwise, one of 3 global values will be returned based on the notification type.
     *          They are QualityNotification.global for QM, ServiceNotification.global for CS, or Notification.global for a normal notification.
     */
    static getNotificationCategory(context, notificationType) {
        let qualityNotif = context.getGlobalDefinition('/SAPAssetManager/Globals/Notifications/QualityNotification.global').getValue();
        let serviceNotif = context.getGlobalDefinition('/SAPAssetManager/Globals/Notifications/ServiceNotification.global').getValue();
        let basicNotif = context.getGlobalDefinition('/SAPAssetManager/Globals/Notifications/Notification.global').getValue();
        if (notificationType) {
            let queryOptions = `$filter=NotifType eq '${notificationType}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', ['NotifCategory'], queryOptions).then(typeResult => {
                if (typeResult && typeResult.length !== 0) {
                    switch (typeResult.getItem(0).NotifCategory) {
                        case '02':
                            return qualityNotif;
                        case '03':
                            return serviceNotif;
                        case '01':
                        default:
                            return basicNotif;
                    }
                }
                return '';
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), `getNotificationCategory(context,notificationType) error: ${error}`);
                return '';
            });
        }
        return '';
    }

    /**
     * This function creates the appropriate Target Object depending on the Business Partner type for the given list picker
     * @param {string} partnerType
     * @param {ListPicker} partnerPicker
     * @returns Promise‹any›
     */
    static setPartnerPickerTarget(partnerType, partnerPicker) {
        let displayValue = '';
        let returnValue = '';
        let entitySet = '';

        switch (partnerType) {
            case 'SP':
                displayValue = 'Name1';
                returnValue = 'Customer';
                entitySet = 'Customers';
                break;
            case 'VN':
                displayValue = 'Name1';
                returnValue = 'Vendor';
                entitySet = 'Vendors';
                break;
            case 'AO':
            case 'KU':
            case 'VU':
                displayValue = 'UserName';
                returnValue = 'UserId';
                entitySet = 'SAPUsers';
                break;
            case 'VW':
                displayValue = 'EmployeeName';
                returnValue = 'PersonnelNumber';
                entitySet = 'Employees';
                break;
            default:
                break;
        }

        let partnerPickerSpecifier = partnerPicker.getTargetSpecifier();
        partnerPickerSpecifier.setDisplayValue(`{{#Property:${displayValue}}} - {{#Property:${returnValue}}}`);
        partnerPickerSpecifier.setReturnValue(`{${returnValue}}`);

        partnerPickerSpecifier.setEntitySet(`${entitySet}`);
        partnerPickerSpecifier.setQueryOptions(`$orderby=${displayValue} asc`);
        partnerPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        return partnerPicker.setTargetSpecifier(partnerPickerSpecifier);
    }

    /**
     * @param {Object.<string, number>} controlNameToMaxLength
     */
    static Validate(context, formCellContainer, requiredControlNames, controlNameToMaxLength) {
        const controls = formCellContainer.getControls().filter(c => requiredControlNames.includes(c.getName()) || (c.getName() in controlNameToMaxLength));
        controls.forEach(c => c.clearValidationOnValueChange());
        formCellContainer.redraw();

        const fieldsWithErrors = ValidationLibrary.setValidationInlineErrors(context, controls, requiredControlNames, controlNameToMaxLength);
        if (fieldsWithErrors.length === 0) {  // isValid
            return true;
        }
        if (IsAndroid(context)) {  // from UpdateRequiredFailed.js rule
            context.redraw();
        }
        return false;
    }

}

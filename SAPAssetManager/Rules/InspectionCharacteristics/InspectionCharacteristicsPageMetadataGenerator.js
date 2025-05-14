import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import Logger from '../Log/Logger';
import DeviceType from '../Common/DeviceType';
import DocumentsIsVisible from '../Documents/DocumentsIsVisible';
import IsAndroid from '../Common/IsAndroid';
import SectionHeaderHeight from '../Extensions/SectionHeaderHeight';
import libCom from '../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
let count;
let sectionIndex;
let bindings;
let sectionEquipment;
let sectionFunctionalLocation;
let sectionOperation;
let edtHeight;
export default async function InspectionCharacteristicsPageMetadataGenerator(clientAPI) {
    edtHeight = 95;
    count = 0;
    sectionIndex = 0;
    const page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/GenericPage.page');
    let entityset = '';
    let binding = clientAPI.binding;
    if (clientAPI.getPageProxy() && clientAPI.getPageProxy().getActionBinding()) {
        binding = clientAPI.getPageProxy().getActionBinding();
    }

    if (binding['@odata.type'] === '#sap_mobile.InspectionLot') {
        if (binding.InspectionPoints_Nav && binding.InspectionPoints_Nav.length > 0) {
            entityset = binding['@odata.readLink'] + '/InspectionPoints_Nav';
        } else {
            entityset = binding['@odata.readLink'];
        }
    } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        entityset = binding['@odata.readLink'] + '/InspectionPoint_Nav';
    } else if (binding['@odata.type'] === '#sap_mobile.InspectionPoint' || binding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
        entityset = binding['@odata.readLink'];
    }
    page.Controls[0].Sections = [];
    if (entityset) {
        await read(clientAPI, entityset, [], '').then(async function(results) {
            bindings = [];
            sectionEquipment = '';
            sectionFunctionalLocation = '';
            sectionOperation = '';
            if (results && results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    bindings[i] = results.getItem(i);
                    if (bindings[i].Equipment) {
                        sectionEquipment = bindings[i].Equipment;
                    } else if (bindings[i].EquipId) {
                        sectionEquipment = bindings[i].EquipId;
                    } else if (bindings[i].EquipNum) {
                        sectionEquipment = bindings[i].EquipNum;
                    } else if (bindings[i].FunctionalLocation) {
                        sectionFunctionalLocation = bindings[i].FunctionalLocation;
                    } else if (bindings[i].FuncLocId) {
                        sectionFunctionalLocation = bindings[i].FuncLocId;
                    }
                    if (bindings[i].OperationNo) {
                        sectionOperation = `(OrderId eq '${bindings[i].OrderId}' and OperationNo eq '${bindings[i].OperationNo}')`;
                    }
                    sectionIndex = i;
                    await addPageSections(clientAPI, bindings[i], page);
                }
                addActionBar(page);
                addPageOverrides(clientAPI, page);
                addToolbar(page);
            }
            return page;
        });
    } else {
        await addPageSections(clientAPI, binding, page);
        addActionBar(page);
        addPageOverrides(clientAPI, page);
        addToolbar(page);
    }

    return page;
}

export async function addPageSections(clientAPI, binding, page) {
    await addHeaderSection(clientAPI, binding, page);
    await addEDTSection(clientAPI, binding, page);
}

export function read(context, entitySet, properties, queryString) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, properties, queryString).then((results) => {
        if (results && results.length > 0) {
            return results;
        }
        return '';
    }).catch(function() {
        return '';
    });
}

export function addToolbar(page) {
    const toolbar = page.FioriToolbar;
    toolbar.Visible = false;
    toolbar.Items = [
        {
            '_Name': 'BulkUpdateToolbarItem',
            '_Type': 'FioriToolbarItem.Type.Button',
            'Title': '$(L, apply_changes_to_selected)',
            'OnPress': '/SAPAssetManager/Rules/Extensions/EDT/EDTBulkUpdate.js',
        },
    ];
}

export function addActionBar(page) {
    const actionbar = page.ActionBar;
    actionbar.Items = [];
    actionbar.Items.push(
        {
            'Position': 'left',
            'SystemItem': 'Cancel',
            'Caption': '$(L,cancel)',
            'OnPress': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsEDTCheckForChangesBeforeClose.js',
        },
        {
            'Position': 'right',
            'Icon': '$(PLT,\'\',/SAPAssetManager/Images/filter.android.png,\'\',/SAPAssetManager/Images/filter.android.png)',
            'Text': '$(L,filter)',
            'OnPress': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsEDTFilter.js',
        },
        {
            'Position': 'right',
            'SystemItem': '$(PLT,\'Done\',\'\',\'\',\'Done\')',
            'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
            'OnPress': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateDoneEDT.js',
            '_Name': 'SaveButton',
        },
    );
}

export function addPageOverrides(context, page) {
    const pageOverrides = {
        'Caption': context.localizeText('record_results_x', [count]),
        'OnLoaded': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnLoadedEDT.js',
        'OnReturning': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnReturningEDT.js',
        'OnActivityBackPressed': '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/CancelCheckOnBackNavAndroidEDT.js',
    };
    Object.assign(page, pageOverrides);

}

export function addHeaderSection(context, binding, page) {
    let entityset = '';
    let equipment = binding.Equipment;
    let floc = binding.FunctionalLocation;
    let headlineText = '-';
    let bodyText = '-';
    let footnote = binding.InspectionLot;
    let statusText = '-';
    if (equipment) {
        entityset = `MyEquipments('${equipment}')`;
        headlineText = equipment;
    } else if (binding.EquipId) {
        entityset = `MyEquipments('${binding.EquipId}')`;
        headlineText = binding.EquipId;
    } else if (binding.EquipNum) {
        entityset = `MyEquipments('${binding.EquipNum}')`;
        headlineText = binding.EquipNum;
    } else if (floc) {
        entityset = `MyFunctionalLocations('${floc}')`;
        headlineText = floc;
    } else if (binding.FuncLocId) {
        entityset = `MyFunctionalLocations('${binding.FuncLocId}')`;
        headlineText = binding.FuncLocId;
    }


    if (entityset) {
        return read(context, entityset, [], '').then(async function(result) {
            if (result && result.length > 0) {

                if (result.getItem(0)['@odata.type'] === '#sap_mobile.MyEquipment') {
                    headlineText = result.getItem(0).EquipId + ' - ' + result.getItem(0).EquipDesc;
                } else if (result.getItem(0)['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
                    headlineText = result.getItem(0).FuncLocId + ' - ' + result.getItem(0).FuncLocDesc;
                }

                let plant = result.getItem(0).PlanningPlant;
                if (plant) {
                    await read(context, `Plants('${plant}')`, [], '').then(function(plantResult) {
                        if (plantResult.length > 0 && (plant = plantResult.getItem(0))) {
                            if (result.getItem(0).WorkCenter !== '00000000') {
                                bodyText = `${plantResult.getItem(0).PlantDescription} (${plantResult.getItem(0).Plant}), ${result.getItem(0).workcenter}`;
                            }
                            bodyText = `${plantResult.getItem(0).PlantDescription} (${plantResult.getItem(0).Plant})`;
                        } else {
                            if (result.getItem(0).WorkCenter !== '00000000') {
                                bodyText = `(${plant})`;
                            }
                            bodyText = `(${plant})`;
                        }
                    }).catch(function(err) {
                        Logger.error(`Failed to read Online OData Service: ${err}`);
                        bodyText = `(${plant})`;
                    });
                }
            }
            let filter = '$filter=Valuation ne \'\'';
            if (binding['@odata.type'] === '#sap_mobile.InspectionLot') {
                entityset = binding['@odata.readLink'] + '/InspectionChars_Nav';
            } else if (binding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
                entityset = binding['@odata.readLink'] + '/InspectionChar_Nav';
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
                entityset = binding['@odata.readLink'] + '/InspectionChar_Nav';
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                entityset = binding['@odata.readLink'];
            } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                entityset = `InspectionLots('${binding.InspectionLot}')/InspectionChars_Nav`;
            }
            await context.count('/SAPAssetManager/Services/AssetManager.service', entityset, '').then(async function(totalcount) {
                count = count + totalcount;
                await context.count('/SAPAssetManager/Services/AssetManager.service', entityset, filter).then(function(emptycount) {
                    statusText = context.localizeText('x_of_x_complete', [`${emptycount}`, `${totalcount}`]);
                });
            });

            let buttons = getAttachmentButtons(context);
            let link = await getAttachmentLink(context, binding);
            let height = SectionHeaderHeight(context, buttons.length);
            if (link) {
                page.Controls[0].Sections.push(
                    {
                        'Module': 'extension-SectionHeader',
                        'Control': 'SectionHeaderViewExtension',
                        'Class': 'SectionHeaderViewExtension',
                        'Height': height,
                        'ExtensionProperties': {
                            'UserData': {
                                'Index': sectionIndex,
                            },
                            'HeadlineText': headlineText,
                            'BodyText': bodyText,
                            'Footnote': footnote,
                            'StatusText': statusText,
                            'Buttons': buttons,
                            'Link': link,
                        },
                        '_Type': 'Section.Type.Extension',
                        '_Name': 'SectionHeaderExtensionSection',
                    },
                );
            } else {
                page.Controls[0].Sections.push(
                    {
                        'Module': 'extension-SectionHeader',
                        'Control': 'SectionHeaderViewExtension',
                        'Class': 'SectionHeaderViewExtension',
                        'Height': height,
                        'ExtensionProperties': {
                            'UserData': {
                                'Index': sectionIndex,
                            },
                            'HeadlineText': headlineText,
                            'BodyText': bodyText,
                            'Footnote': footnote,
                            'StatusText': statusText,
                            'Buttons': buttons,
                        },
                        '_Type': 'Section.Type.Extension',
                        '_Name': 'SectionHeaderExtensionSection',
                    },
                );
            }

        });
    } else {
        if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
            count = 1;
        }
        return Promise.resolve();
    }
}

export function getAttachmentButtons(context) {
    if (DocumentsIsVisible(context)) {
        return [
            {
                'Value': 'Add Attachment',
                'Action': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/AddAttachmentsNavEDT.js',
                'Style': 'Secondary',
            },
        ];
    }
    return [];
}

export async function getAttachmentLink(context, binding) {
    libCom.setStateVariable(context, 'InspectionCharacteristicsAttachments', '');
    if (DocumentsIsVisible(context)) {
        let attachmentsCount = 0;
        await context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionLotDocuments', [], `$expand=Document&$filter=InspectionLot eq '${binding.InspectionLot}' and Document/FileName ne null and sap.islocal()`).then(attachments => {
            for (let i = 0; i < attachments.length; i++) {
                if (attachments.getItem(i) && attachments.getItem(i).Document && context.isMediaLocal('/SAPAssetManager/Services/AssetManager.service', attachments.getItem(i).Document['@odata.readLink'].split('(')[0], attachments.getItem(i).Document['@odata.readLink'])) {
                    attachmentsCount = attachmentsCount + 1;
                }
            }
        });
        let linkValue = attachmentsCount + ' ' + context.localizeText('attachments');
        return {
            'Value': linkValue,
            'Action': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/AddAttachmentsNavEDT.js',
        };
    }
    return '';
}

export async function addEDTSection(context, binding, page) {
    const numberOfStickyColumns = DeviceType(context) === 'Phone' ? 0 : 1;
    let entityset = '';
    let queryOption = '';
    let height = 500;
    if (IsAndroid(context)) {
        edtHeight = 180;
    } else {
        edtHeight = 130;
    }
    if (binding['@odata.type'] === '#sap_mobile.InspectionLot') {
        entityset = binding['@odata.readLink'] + '/InspectionChars_Nav';
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && Object.prototype.hasOwnProperty.call(binding, 'WOHeader_Nav') && Object.prototype.hasOwnProperty.call(binding.WOHeader_Nav, 'EAMChecklist_Nav') && binding.WOHeader_Nav.EAMChecklist_Nav.length > 0) {
            queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionNode,InspectionChar';
        } else {
            queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionNode,InspectionChar';
        }
    } else if (binding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
        if (IsAndroid(context)) {
            edtHeight = 110;
        } else {
            edtHeight = 85;
        }
        entityset = binding['@odata.readLink'] + '/InspectionChar_Nav';
        queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,EAMChecklist_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav,InspectionMethod_Nav/MethodDoc_Nav,InspectionMethod_Nav/MethodDoc_Nav/Document_Nav,InspectionMethod_Nav/MethodLongText_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionNode,InspectionChar';
    } else if (binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        entityset = binding['@odata.readLink'] + '/InspectionChar_Nav';
        queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionNode,InspectionChar';
    } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        entityset = binding['@odata.readLink'];
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && Object.prototype.hasOwnProperty.call(binding, 'WOHeader_Nav') && Object.prototype.hasOwnProperty.call(binding.WOHeader_Nav, 'EAMChecklist_Nav') && binding.WOHeader_Nav.EAMChecklist_Nav.length > 0) {
            queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionNode,InspectionChar';
        } else {
            queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav,InspectionMethod_Nav/MethodDoc_Nav,InspectionMethod_Nav/MethodDoc_Nav/Document_Nav,InspectionMethod_Nav/MethodLongText_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionNode,InspectionChar';
        }
    } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        entityset = `InspectionLots('${binding.InspectionLot}')/InspectionChars_Nav`;
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && Object.prototype.hasOwnProperty.call(binding, 'WOHeader_Nav') && Object.prototype.hasOwnProperty.call(binding.WOHeader_Nav, 'EAMChecklist_Nav') && binding.WOHeader_Nav.EAMChecklist_Nav.length > 0) {
            queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionNode,InspectionChar';
        } else {
            queryOption = '$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionNode,InspectionChar';
        }
    } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        entityset = `InspectionLots('${binding.InspectionLot}')/InspectionChars_Nav`;
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && Object.prototype.hasOwnProperty.call(binding, 'EAMChecklist_Nav') && binding.EAMChecklist_Nav.length > 0) {
            queryOption = `$filter=EAMChecklist_Nav/OperationNo eq '${binding.OperationNo}' and EAMChecklist_Nav/OrderId eq '${binding.OrderId}'&$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,EAMChecklist_Nav/MyWOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/Equipment_Nav,InspectionLot_Nav/WOHeader_Nav,EAMChecklist_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=EAMChecklist_Nav/OperationNo,EAMChecklist_Nav/Equipment,EAMChecklist_Nav/FunctionalLocation,InspectionNode,InspectionChar`;
        } else {
            queryOption = `$filter=InspectionPoint_Nav/OperationNo eq '${binding.OperationNo}' and InspectionPoint_Nav/OrderId eq '${binding.OrderId}'&$expand=InspCharDependency_Nav,MasterInspCharLongText_Nav,MasterInspChar_Nav,NotifItems_Nav,InspectionPoint_Nav/WOOperation_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/Equip_Nav,InspectionLot_Nav/WOHeader_Nav,InspectionPoint_Nav/FuncLoc_Nav,InspValuation_Nav,InspectionCode_Nav,InspectionMethod_Nav&$orderby=InspectionPoint_Nav/OperationNo,InspectionPoint_Nav/EquipNum,InspectionPoint_Nav/FuncLocIntern,InspectionNode,InspectionChar`;
        }
    }
    await context.count('/SAPAssetManager/Services/AssetManager.service', entityset, queryOption).then(async function(rows) {
        if (rows > 1) {
            height = (rows * edtHeight);
        } else {
            if (IsAndroid(context)) {
                edtHeight = 155;
            } else {
                edtHeight = 135;
            }
        }
    });

    page.Controls[0].Sections.push(
        {
            'Module': 'extension-EditableDataTable',
            'Control': 'EditableDataTableViewExtension',
            'Class': 'EditableDataTableViewExtension',
            'Height': height,
            'ExtensionProperties': {
                'UserData': {
                    'Index': sectionIndex,
                    'FilterData': {
                        'Equipment': sectionEquipment,
                        'FunctionalLocation': sectionFunctionalLocation,
                        'Operation': sectionOperation,
                        'FilterApplied': false,
                    },
                    'CalulateChars': [],
                },
                'OnLoaded': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnExtensionLoadedEDT.js',
                'OnCellGetsFocus': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnCellGetsFocus.js',
                'OnCellLostFocus': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsOnCellLostFocus.js',
                'OnSelectedRowsChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsEDTSelectedRowsChange.js',
                'Configuration': {
                    'IsStickyHeaderRow': true,
                    'NumberOfLeadingStickyColumns': numberOfStickyColumns,
                    'MaxLinesPerRow': 2,
                    'IsSelectionModeEnabled': true,
                },
                'Columns': [
                    {
                        'HeaderName': '$(L, characteristic)',
                        'PreferredWidth': 170,
                    },
                    {
                        'HeaderName': '$(L, target_specification)',
                        'PreferredWidth': 200,
                    },
                    {
                        'HeaderName': '$(L, value)',
                        'PreferredWidth': 200,
                    },
                    {
                        'HeaderName': '$(L, valuation)',
                        'PreferredWidth': 200,
                    },
                    {
                        'HeaderName': '$(L, comment)',
                        'PreferredWidth': 200,
                    },
                    {
                        'HeaderName': '$(L, defect)',
                        'PreferredWidth': 200,
                    },
                    {
                        'HeaderName': '$(L, information)',
                        'PreferredWidth': 200,
                    },
                    {
                        'HeaderName': '$(L, note)',
                        'PreferredWidth': 200,
                    },
                ],
                'Row': {
                    'Items': [
                        {
                            'Type': 'Text',
                            'Name': 'InspectionCharacteristics',
                            'IsMandatory': false,
                            'IsReadOnly': true,
                            'Property': 'InspectionChar',
                            'OnValueChange': '',
                            'Parameters': {
                                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsDescriptionID.js',
                            },
                        },
                        {
                            'Type': 'Text',
                            'Name': 'TargetSpecification',
                            'IsMandatory': false,
                            'IsReadOnly': true,
                            'Property': 'LowerLimit',
                            'OnValueChange': '',
                            'Parameters': {
                                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsTargetSpecification.js',
                            },
                        },
                        '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeAndQualitativeEDTControls.js',
                        {
                            'Type': 'Text',
                            'Name': 'Valuation',
                            'IsMandatory': false,
                            'IsReadOnly': true,
                            'Style': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValuationStyleValueEDT.js',
                            'Property': 'Valuation',
                            'OnValueChange': '',
                            'Parameters': {
                                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsValuationInitialValueEDT.js',
                            },
                        },
                        {
                            'Type': 'Text',
                            'Name': 'Remarks',
                            'IsMandatory': false,
                            'IsReadOnly': false,
                            'OnValueChange': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsCommentEDTOnChange.js',
                            'Property': 'Remarks',
                            'Parameters': {
                                'Value': '{Remarks}',
                            },
                        },
                        {
                            'Type': 'Button',
                            'Name': 'Notification',
                            'IsMandatory': false,
                            'IsReadOnly': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsNotificationEnableEDT.js',
                            'OnValueChange': '',
                            'Property': '',
                            'Parameters': {
                                'Value': 'Notification',
                                'Action': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsNotificationCreateEDTNav.js',
                                'Style': 'Secondary',
                            },
                        },
                        {
                            'Type': 'Button',
                            'Name': 'More',
                            'IsMandatory': false,
                            'IsReadOnly': false,
                            'OnValueChange': '',
                            'Property': '',
                            'Parameters': {
                                'Value': '$(L, more)',
                                'Action': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsDetailsEDTNav.js',
                                'Style': 'Secondary',
                            },
                        },
                        {
                            'Type': 'Text',
                            'Name': 'LongText',
                            'IsMandatory': false,
                            'IsReadOnly': true,
                            'OnValueChange': '',
                            'Property': '{MasterInspCharLongText}',
                            'Parameters': {
                                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/InspectionCharacteristicsLongText.js',
                            },
                        },
                    ],
                },
                'Target': {
                    'EntitySet': entityset,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'QueryOptions': queryOption,
                },
            },
            '_Type': 'Section.Type.Extension',
            '_Name': 'EditableDataTableExtensionSection',
        },
    );
}

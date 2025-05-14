import Logger from '../../../Log/Logger';
import MeasuringPointsEDTTechnicalObjects from './MeasuringPointsEDTTechnicalObjects';
import DeviceType from '../../../Common/DeviceType';
import { GetDiscardSection, GetEDTSection, GetHeaderSection, GetLAMCells, GetLAMColumns, GetMeasuringPointsActionBarItems, GetMeasuringPointsCells, GetMeasuringPointsColumns, GetMeasuringPointsKPI } from './MeasuringPointsEDTPageMetadata';
import EDTHelper from './MeasuringPointsEDTHelper';
import IsAndroid from '../../../Common/IsAndroid';
import SectionHeaderHeight from '../../../Extensions/SectionHeaderHeight';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import EDTSoftInputModeConfig from '../../../Extensions/EDT/EDTSoftInputModeConfig';

export default async function MeasuringPointsEDTPageMetadataGenerator(clientAPI) {
    EDTSoftInputModeConfig(clientAPI);

    let page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/GenericPage.page');

    page.Caption = clientAPI.localizeText('take_all_readings_title');
    page.OnLoaded = '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTPageOnLoaded.js';
    page.OnActivityBackPressed = '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/CancelCheckOnBackNavAndroidEDT.js';

    page.Controls[0].Sections = [];

    let technicalObjects = await getTechnicalObjects(clientAPI);
    initFilters(clientAPI, technicalObjects);

    addActionBar(page);
    await addSections(clientAPI, page, technicalObjects);
    addKPIHeader(page);
    addDiscardButton(clientAPI, page);

    return page;
}

async function getTechnicalObjects(clientAPI) {
    let technicalObjects = await MeasuringPointsEDTTechnicalObjects(clientAPI);
    if (!technicalObjects.OPERATIONS) technicalObjects.OPERATIONS = [];
    if (!technicalObjects.EQUIPMENT) technicalObjects.EQUIPMENT = [];
    if (!technicalObjects.FLOC) technicalObjects.FLOC = [];
    if (!technicalObjects.PRT) technicalObjects.PRT = [];

    technicalObjects.EQUIPMENT = technicalObjects.EQUIPMENT.filter(item => item.MeasuringPoints && item.MeasuringPoints.length);
    technicalObjects.FLOC = technicalObjects.FLOC.filter(item => item.MeasuringPoints && item.MeasuringPoints.length);
    technicalObjects.PRT = technicalObjects.PRT.filter(item => item.PRTPoint);

    let binding = [].concat(technicalObjects.EQUIPMENT.map(item => item.MeasuringPoints), technicalObjects.FLOC.map(item => item.MeasuringPoints), technicalObjects.PRT.map(item => [item.PRTPoint]));
    binding.forEach(points => {
        points.forEach((point => {
            point.MeasurementDocs = point.MeasurementDocs.map(doc => {
                doc.PrevReadingValue = doc.ReadingValue;
                return doc;
            });
        }));
    });

    if (technicalObjects.POINT) {
        technicalObjects.POINT.MeasurementDocs = technicalObjects.POINT.MeasurementDocs.map(doc => {
            doc.PrevReadingValue = doc.ReadingValue;
            return doc;
        });
        binding.push([technicalObjects.POINT]);
    }

    CommonLibrary.setStateVariable(clientAPI, 'EDTSectionBindings', binding);
    CommonLibrary.setStateVariable(clientAPI, 'EDTSectionDocumentId', technicalObjects.DOCUMENT_ID);

    return technicalObjects;
}

function initFilters(clientAPI, technicalObjects) {
    let filters = clientAPI.evaluateTargetPathForAPI('#Page:-Current').getClientData().filters;
    if (!filters) filters = {};

    filters.EQUIPMENT = technicalObjects.EQUIPMENT.map(object => object.EquipId);
    filters.FLOC = technicalObjects.FLOC.map(object => object.FuncLocIdIntern);
    filters.STATUS = [];
    filters.OPERATIONS = technicalObjects.OPERATIONS.map(object => object.OperationNo);
    filters.ORDER = technicalObjects.OPERATIONS[0] ? technicalObjects.OPERATIONS[0].OrderId : '';
    filters.PRT = technicalObjects.PRT;
    filters.active = {};

    clientAPI.evaluateTargetPathForAPI('#Page:-Current').getClientData().filters = filters;
}

function addActionBar(page) {
    page.ActionBar.Items = GetMeasuringPointsActionBarItems();
}

function addKPIHeader(page) {
    page.Controls[0].Sections.unshift(GetMeasuringPointsKPI(page));
}

async function addSections(clientAPI, page, technicalObjects) {
    let config = {
        sectionIndex: 0,
        operations: technicalObjects.OPERATIONS,
    };

    let equipments = technicalObjects.EQUIPMENT;
    for (let equipment of equipments) {
        await addSection(clientAPI, equipment, page, config);
        config.sectionIndex++;
    }

    let floc = technicalObjects.FLOC;
    for (let flocItem of floc) {
        await addSection(clientAPI, flocItem, page, config);
        config.sectionIndex++;
    }

    let prt = technicalObjects.PRT;
    for (let prtItem of prt) {
        await addSection(clientAPI, prtItem, page, config);
        config.sectionIndex++;
    }

    if (technicalObjects.POINT) {
        await addSection(clientAPI, technicalObjects.POINT, page, config);
        config.sectionIndex++;
    }
}

async function addSection(clientAPI, technicalObject, page, config) {
    let formattedTechnicalObject = await formatTechnicalObject(clientAPI, technicalObject);

    await addHeaderSection(clientAPI, formattedTechnicalObject, page, config);
    await addEDTSection(clientAPI, formattedTechnicalObject, page, config);
}

async function formatTechnicalObject(clientAPI, technicalObject) {
    let binding = clientAPI.binding;
    if (!binding && clientAPI.getPageProxy() && clientAPI.getPageProxy().getActionBinding()) {
        binding = clientAPI.getPageProxy().getActionBinding();
    }
    let formattedTechnicalObject = {
        'name': '',
        'type': '',
        'id': '',
        'plant': '',
        'points': technicalObject.MeasuringPoints || [],
        'relatedWO': '',
        'relatedOperation': '',
        'measuringPointsReadLink': '',
    };

    let objectListQuery;

    switch (technicalObject['@odata.type']) {
        case '#sap_mobile.MyEquipment': {
            formattedTechnicalObject.type = clientAPI.localizeText('equipment');
            formattedTechnicalObject.id = technicalObject.EquipId;
            formattedTechnicalObject.name = technicalObject.EquipDesc;
            objectListQuery = `$filter=EquipId eq '${technicalObject.EquipId}'`;
            formattedTechnicalObject.measuringPointsReadLink = decodeURIComponent(technicalObject['@odata.readLink'] + '/MeasuringPoints');
            break;
        }
        case '#sap_mobile.MyFunctionalLocation': {
            formattedTechnicalObject.type = clientAPI.localizeText('functional_location');
            formattedTechnicalObject.id = technicalObject.FuncLocId;
            formattedTechnicalObject.name = technicalObject.FuncLocDesc;
            objectListQuery = `$filter=FuncLocIdIntern eq '${technicalObject.FuncLocIdIntern}'`;
            formattedTechnicalObject.measuringPointsReadLink = decodeURIComponent(technicalObject['@odata.readLink'] + '/MeasuringPoints');
            break;
        }
        case '#sap_mobile.MyWorkOrderTool': {
            formattedTechnicalObject.type = clientAPI.localizeText('prt');
            formattedTechnicalObject.id = technicalObject.ItemCounter;
            formattedTechnicalObject.name = technicalObject.Description;
            formattedTechnicalObject.measuringPointsReadLink = decodeURIComponent(technicalObject['@odata.readLink'] + '/PRTPoint');
            formattedTechnicalObject.points = [technicalObject.PRTPoint];
            objectListQuery = '$filter=true';
            break;
        }
        case '#sap_mobile.MeasuringPoint': {
            formattedTechnicalObject.measuringPointsReadLink = technicalObject['@odata.readLink'];
            formattedTechnicalObject.points = [technicalObject];

            if (technicalObject.Equipment) {
                formattedTechnicalObject.type = clientAPI.localizeText('equipment');
                formattedTechnicalObject.id = technicalObject.Equipment.EquipId;
                formattedTechnicalObject.name = technicalObject.Equipment.EquipDesc;

                technicalObject.MaintPlant = technicalObject.Equipment.MaintPlant;
                objectListQuery = `$filter=EquipId eq '${technicalObject.Equipment.EquipId}'`;
            } else if (technicalObject.FunctionalLocation) {
                formattedTechnicalObject.type = clientAPI.localizeText('functional_location');
                formattedTechnicalObject.id = technicalObject.FunctionalLocation.FuncLocId;
                formattedTechnicalObject.name = technicalObject.FunctionalLocation.FuncLocDesc;

                technicalObject.MaintPlant = technicalObject.FunctionalLocation.MaintPlant;
                objectListQuery = `$filter=FuncLocIdIntern eq '${technicalObject.FunctionalLocation.FuncLocIdIntern}'`;
            } else if (technicalObject.WorkOrderTool) {
                formattedTechnicalObject.type = clientAPI.localizeText('prt');
                formattedTechnicalObject.id = technicalObject.WorkOrderTool.ItemCounter;
                formattedTechnicalObject.name = technicalObject.WorkOrderTool.Description;

                technicalObject.MaintPlant = technicalObject.WorkOrderTool.PRTPlant;
            }
            break;
        }
        default:
            break;
    }

    let plantId = technicalObject.MaintPlant || technicalObject.PRTPlant;
    if (plantId) {
        await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${plantId}')`, ['Plant', 'PlantDescription'], '').then(plantResult => {
            let plantValue;

            if (plantResult.length > 0) {
                let plant = plantResult.getItem(0);

                if (technicalObject.WorkCenter && technicalObject.WorkCenter !== '00000000') {
                    plantValue = `${plant.PlantDescription} (${plant.Plant}), ${technicalObject.WorkCenter}`;
                } else {
                    plantValue = `${plant.PlantDescription} (${plant.Plant})`;
                }
            } else {
                plantValue = `(${plantId})`;
            }

            formattedTechnicalObject.plant = plantValue;
        }).catch(err => {
            Logger.error(`Failed to read Online OData Service: ${err}`);
            formattedTechnicalObject.plant = `(${plantId})`;
        });
    }

    if (objectListQuery) {
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
            formattedTechnicalObject.relatedWO = binding.Description + ' ' + binding.ObjectID;
        } else {
            if (binding && binding.OrderId) {
                objectListQuery += ` and OrderId eq '${binding.OrderId}'`;
            }
            if (binding && binding.OperationNo) {
                objectListQuery += ` and OperationNo eq '${binding.OperationNo}'`;
            }
            objectListQuery += '&$expand=WOHeader_Nav,WOOperation_Nav&$select=OrderId,OperationNo,WOHeader_Nav/OrderDescription,WOOperation_Nav/OperationShortText';

            await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderObjectLists', [], objectListQuery).then(result => {
                if (result.length) {
                    let object = result.getItem(0);

                    if (object.WOHeader_Nav) {
                        formattedTechnicalObject.relatedWO = object.WOHeader_Nav.OrderDescription + ' ' + object.OrderId;
                    }

                    if (object.WOOperation_Nav) {
                        formattedTechnicalObject.relatedOperation = object.WOOperation_Nav.OperationShortText + ' ' + object.OperationNo;
                    }
                } else {
                    if (binding && binding.OrderId) {
                        formattedTechnicalObject.relatedWO = binding.OrderDescription + ' ' + binding.OrderId;
                    }

                    if (binding && binding.OperationNo) {
                        if (binding.WOHeader) {
                            formattedTechnicalObject.relatedWO = binding.WOHeader.OrderDescription + ' ' + binding.OrderId;
                        }
                        formattedTechnicalObject.relatedOperation = binding.OperationShortText + ' ' + binding.OperationNo;
                    }
                }
            });
        }
    }

    return formattedTechnicalObject;
}

async function addHeaderSection(context, technicalObject, page, config) {
    let footnote = '-';
    if (technicalObject.relatedWO && technicalObject.relatedOperation) {
        footnote = technicalObject.relatedWO + ' - ' + technicalObject.relatedOperation;
    } else if (technicalObject.relatedWO) {
        footnote = technicalObject.relatedWO;
    }

    let { allCount, completedCount } = EDTHelper.getSectionCompletionCounts(context.getPageProxy(), technicalObject.points);
    let statusText = EDTHelper.getSectionCompletionStatus(context, allCount, completedCount);

    let bodyText = technicalObject.name;
    if (technicalObject.plant) {
        bodyText += ', ' + technicalObject.plant;
    }

    let properties = {
        headlineText: technicalObject.type + ' ' + technicalObject.id,
        bodyText: bodyText || '-',
        footnote: footnote,
        statusText: statusText,
    };
    let height = SectionHeaderHeight(context, 0);
    page.Controls[0].Sections.push(GetHeaderSection(config, height, properties));
}

async function addEDTSection(clientAPI, technicalObject, page, config) {
    let columns = [].concat(GetMeasuringPointsColumns(clientAPI, technicalObject.points, config), GetLAMColumns(technicalObject.points));
    let items = [].concat(GetMeasuringPointsCells(clientAPI, technicalObject.points, config), GetLAMCells(clientAPI, technicalObject.points));

    let properties = {
        entityset: technicalObject.measuringPointsReadLink,
        queryOptions: '$expand=WorkOrderTool,MeasurementDocs/LAMObjectDatum_Nav,LAMObjectDatum_Nav&$orderby=SortField,MeasurementDocs/ReadingTimestamp desc',
        columns: columns,
        items: items,
    };

    config.numberOfLeadingStickyColumns = DeviceType(clientAPI) === 'Phone' ? 0 : 1;

    let rowHight = 80;
    config.height = 60 + (technicalObject.points.length * rowHight);
    if (IsAndroid(clientAPI)) {
        rowHight = 110;
        config.height = 80 + (technicalObject.points.length * rowHight);
    }

    page.Controls[0].Sections.push(GetEDTSection(config, properties));
}

export function updateSectionStatusText(context, edtSectionIndex, updatedStatus) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let headerSectionIndex = (edtSectionIndex * 2) + 1;
    let headerSection = sections[headerSectionIndex];

    if (headerSection && headerSection.getExtension()) {
        headerSection.getExtension().setStatusText(updatedStatus);
    }
}

export function updateKPI(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let kpi = sections[0];
    kpi.redraw();
}

function addDiscardButton(clientAPI, page) {
    if (clientAPI.getClientData().SingleReading) {
        page.Controls[0].Sections.push(GetDiscardSection());
    }
}

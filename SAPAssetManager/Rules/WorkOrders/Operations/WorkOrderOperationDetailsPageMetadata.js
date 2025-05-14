import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';
import ModifyKeyValueSectionWithCustomFields, { getKeyValueSection } from '../../LCNC/ModifyKeyValueSection';
import Logger from '../../Log/Logger';
import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import { modifyUninstallMeterEDTTable } from '../../WCM/WorkOrderDetails/WorkOrderDetailsPageMetadata';
import WorkOrderOperationDetailsPageToOpen from './Details/WorkOrderOperationDetailsPageToOpen';

export default function WorkOrderOperationDetailsPageMetadata(clientAPI) {
    return addKPIViewInPageHeader(clientAPI).then((page) => {
        return modifyKeyValueSection(clientAPI, page).then(updatedPage => {
            return modifyUninstallMeterEDTTable(clientAPI, updatedPage);
        });
    });
}

function addKPIViewInPageHeader(clientAPI) {
    let page = clientAPI.getPageDefinition(WorkOrderOperationDetailsPageToOpen(clientAPI));

    if (IsMeterComponentEnabled(clientAPI)) {
        return MeterSectionLibrary.newObjectCellSectionVisible(clientAPI, 'KPI', clientAPI.getActionBinding()).then((res) => {
            if (res && !IsClassicLayoutEnabled(clientAPI)) {
                let sections = page.Controls[0].Sections;
                let pageHeader = sections[0].ObjectHeader;
                if (pageHeader && !pageHeader.KPIView) {
                    pageHeader.KPIView = {
                        'Label': '/SAPAssetManager/Rules/WorkOrders/Meter/MetersKPILabelForPoints.js',
                        'LeftMetric': '',
                        'RightMetric': '/SAPAssetManager/Rules/WorkOrders/Meter/MetersKPIValueForPoints.js',
                    };
                }
            }
            return page;
        }).catch(error => {
            Logger.error('addKPIViewInPageHeader', error);
            return Promise.resolve(page);
        });
    }
    return Promise.resolve(page);
}

function modifyKeyValueSection(clientAPI, page) {
    const sectionName = 'WorkOrderOperationDetailsSection';

    // Persona specific fields should be added through modifying page metadata 
    // as there is no way to control visibility of fields in dynamic section
    // https://help.sap.com/doc/3642933ef2e1478fb1578ef2acba4ae9/Latest/en-US/reference/schemadoc/Page/SectionedTable/Control/KeyValueItem.schema.html#visible
    if (PersonaLibrary.isFieldServiceTechnician(clientAPI)) {
        const keyValueSection = getKeyValueSection(page, sectionName);

        keyValueSection.KeyAndValues.push(
            {
                '_Name': 'SchedEarliestStartDate',
                'KeyName': '$(L,scheduled_earliest_start_date)',
                'Value': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/OperationScheduledEarliestStartDate.js',
            },
            {
                '_Name': 'SchedLatestStartDate',
                'KeyName': '$(L,scheduled_latest_start_date)',
                'Value': '/SAPAssetManager/Rules/WorkOrders/Operations/Details/OperationScheduledLatestStartDate.js',
            },
        );
    }

    return ModifyKeyValueSectionWithCustomFields(clientAPI, page, sectionName);
}

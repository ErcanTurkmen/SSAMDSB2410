import Logger from '../../Log/Logger';
import MeasuringPointFDCIsVisible from '../../Measurements/Points/MeasuringPointFDCIsVisible';
import UserSystemStatusesVisible from './UserSystemStatusesVisible';
import WorkOrderDetailsPageToOpen from '../../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';
import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';
import IsAndroid from '../../Common/IsAndroid';
import libPersona from '../../Persona/PersonaLibrary';
import addDefenseFlightDetailsToWorkOrder from '../../Defense/WorkOrderAddDefenseFlightDetails';

export default function WorkOrderDetailsPageMetadata(clientAPI) {
    return addKPIViewInPageHeader(clientAPI).then((page) => {
        return UserSystemStatusesVisible(clientAPI, page).then(updatedPage => {
            return addDefenseFlightDetailsToWorkOrder(clientAPI, updatedPage).then(modifiedPage => {
                return reorderWCMSections(clientAPI, modifiedPage).then((reorderedPage) => {
                    return modifyUninstallMeterEDTTable(clientAPI, reorderedPage);
                });
            });
        });
    });
}

function addKPIViewInPageHeader(clientAPI) {
            let page = clientAPI.getPageDefinition(WorkOrderDetailsPageToOpen(clientAPI));

            return MeasuringPointFDCIsVisible(clientAPI, clientAPI.getActionBinding())
                .then(visible => {
                    if (visible) {
                        let sections = page.Controls[0].Sections;
                        let pageHeader = sections[0].ObjectHeader;

                        if (pageHeader && !pageHeader.KPIView) {
                            pageHeader.KPIView = {
                                'Label': '/SAPAssetManager/Rules/Analytics/KPIPointDesc.js',
                                'LeftMetric': '',
                                'RightMetric': '/SAPAssetManager/Rules/Measurements/Points/MeasuringPointReadingsTakenKPI.js',
                            };
                        }
                        return Promise.resolve(page);
                    } else {
                        return addKPIMeterViewInPageHeader(clientAPI, page);
                    }
                })
                .catch(error => {
                    Logger.error('addKPIViewInPageHeader', error);
                    return Promise.resolve(page);
                });
        }

function addKPIMeterViewInPageHeader(clientAPI, page) {
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
                });
            }
            return page;
        }

export async function modifyUninstallMeterEDTTable(clientAPI, page) {
        const uninstallMeterSection = page.Controls[0].Sections.find(section => section._Name === 'MeterListUninstallSection');

        if (uninstallMeterSection && IsMeterComponentEnabled(clientAPI)) {
            let count = await countOrderIsuLinks(clientAPI);

            if (count === 0) {
                uninstallMeterSection.Height = IsAndroid(clientAPI) ? 45 : -1;
                uninstallMeterSection.Header.Caption = clientAPI.localizeText('meters');
                uninstallMeterSection.ExtensionProperties = {};
                uninstallMeterSection._Type = 'Section.Type.ObjectTable';
                uninstallMeterSection.ObjectCells = [];
            } else {
                if (count > 2) count = 2; // the details page displays a maximum of two items

                if (IsAndroid(clientAPI)) {
                    const rowHight = 80;
                    uninstallMeterSection.Height = 70 + (count * rowHight);
                } else {
                    const rowHight = 95;
                    uninstallMeterSection.Height = 60 + (count * rowHight);
                }
            }

            return page;
        }

        return Promise.resolve(page);
    }

    function countOrderIsuLinks(clientAPI) {
        const binding = MeterSectionLibrary.getWorkOrderBinding(clientAPI, clientAPI.getActionBinding());
        const entitySet = `${binding['@odata.readLink']}/OrderISULinks`;

        return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', entitySet, '$filter=sap.entityexists(Device_Nav)')
            .catch(() => {
                return 0;
            });
    }

    function reorderWCMSections(context, page) {
        // Order of WCM sections should be updated only for ST persona and should be placed before Operations object card collection (OperationsObjectCardCollection)
        if (libPersona.isWCMOperator(context)) {
            const sections = page.Controls[0].Sections;
            const operationsSectionIdx = sections.findIndex(section => section._Name === 'OperationsObjectCardCollection');


            if (operationsSectionIdx > -1) {
                const sectionsShouldBeMoved = [];
                ['WorkPermitsListSection', 'WorkApprovals'].forEach(sectionName => {
                    const sectionIndex = sections.findIndex(sectionItem => sectionItem._Name === sectionName);
                    if (sectionIndex > operationsSectionIdx) {
                        const removedSection = sections.splice(sectionIndex, 1)[0];
                        sectionsShouldBeMoved.push(removedSection);
                    }
                });

                if (sectionsShouldBeMoved.length) {
                    sections.splice(operationsSectionIdx, 0, ...sectionsShouldBeMoved);
                }
            }
        }

        return Promise.resolve(page);
    }


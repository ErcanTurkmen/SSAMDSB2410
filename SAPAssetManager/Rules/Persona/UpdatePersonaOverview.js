import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import IsGISEnabled from '../Maps/IsGISEnabled';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsServiceItemKPIVisible from '../ServiceOrders/IsServiceItemKPIVisible';
import { getModalArray } from './ReloadPersonaOverview';
import libVal from '../Common/Library/ValidationLibrary';

export default function UpdatePersonaOverview(context) {
    return Promise.all(getModalArray(context)).then(() => {
        setTimeout(() => {
            try {
                let pageProxy = context.currentPage.context.clientAPI;
                let pageName = CommonLibrary.getPageName(pageProxy);
                
                switch (pageName) {
                    case 'OverviewPage': {
                        let sectionedTable = pageProxy.getControls()[0];
                        let timeSection = sectionedTable.getSection('TimeCaptureSection');
                        let kpiSection = sectionedTable.getSections()[0];
                        let myWorkSection = sectionedTable.getSection('ObjectCard');

                        kpiSection.redraw(true);
                        timeSection.redraw(true);
                        myWorkSection.redraw(true);
                        reloadMap(context, sectionedTable, 'MapExtensionSection', IsGISEnabled);
                        reloadQABSection(sectionedTable);
    
                        Logger.info('ReloadMTPersonaOverview');
                        break;
                    }
                    case 'OverviewPageClassic': {
                        let sectionedTable = pageProxy.getControls()[0];
                        reloadMap(context, sectionedTable, 'MapExtensionSection', IsGISEnabled);
                        reloadQABSection(sectionedTable);
                        break;
                    }
                    case 'WCMOverviewPage': {
                        let sectionedTable = pageProxy.getControls()[0];
                        reloadMap(context, sectionedTable, 'WCMMapExtensionSection', IsGISEnabled);
                        reloadQABSection(sectionedTable);
                        break;
                    }
                    case 'FieldServiceOverview':
                    case 'FieldServiceOverviewClassic': {
                        let sectionedTable = pageProxy.getControls()[0];
                        let kpiSectionName = getKpiSectionName(context);
                        let kpiSection = sectionedTable.getSection(kpiSectionName);
                        let kpiSectionCS = sectionedTable.getSection('KPIHeaderForCS');
                        if (kpiSection) kpiSection.redraw(true);
                        if (kpiSectionCS) kpiSectionCS.redraw(true);
                        Logger.info('ReloadFSMPersonaOverview');

                        let isS4 = IsS4ServiceIntegrationEnabled(context);
                        let mapSectionName = getMapSectionName(isS4);
                        let sectionVisibiltyFn = IsGISEnabled;
                        reloadMap(context, sectionedTable, mapSectionName, sectionVisibiltyFn);
                        reloadQABSection(sectionedTable);
                        break;
                    }
                    case 'OverviewPageMTStd': {
                        let sectionedTable = pageProxy.getControls()[0];
                        let timeSection = sectionedTable.getSection('TimeCaptureSection');
                        let kpiSection = sectionedTable.getSections()[0];

                        kpiSection.redraw(true);
                        timeSection.redraw(true);
                        reloadQABSection(sectionedTable);
                        Logger.info('Reload OverviewPageMTStd');
                        break;
                    }
                    default:
                        break;
                }
            } catch (error) {
                Logger.error('UpdatePersonaOverview', error);
            }
        }, 500);
        return Promise.resolve();
    }).catch(() => {
        return Promise.resolve();
    });
}

function reloadMap(context, sectionedTable, sectionName, sectionVisibiltyFn) {
    let mapSection = sectionedTable.getSection(sectionName);
    mapSection.setVisible(false).then(() => {
        let isMapVisible = sectionVisibiltyFn(context);

        if (isMapVisible) {
            mapSection.setVisible(true);
            Logger.info('ReloadMap');
        }
    });
}

function reloadQABSection(sectionedTable, sectionName = 'QuickActionBarExtensionSection') {
    const QABSection = sectionedTable.getSection(sectionName);
    if (!libVal.evalIsEmpty(QABSection)) {
        QABSection.redraw(true);
    }
}

function getKpiSectionName(context) {
    return IsServiceItemKPIVisible(context) ? 'KPIHeader' : 'KPIHeaderForWO';
}

function getMapSectionName(isS4) {
    return isS4 ? 'S4MapExtensionSection' : 'MapExtensionSection';
}

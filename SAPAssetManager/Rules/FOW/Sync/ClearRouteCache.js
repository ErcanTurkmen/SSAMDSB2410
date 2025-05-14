import Logger from '../../Log/Logger';
import libPersona from '../../Persona/PersonaLibrary';

export default function ClearRouteCache(context) {
    try {  
        const overviewPageName = libPersona.getPersonaOverviewStateVariablePage(context);
        let pageProxy = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
        let sectionedTable = pageProxy.getControls()[0];
        let mapSection = sectionedTable.getSections()[0];
        let mapViewExtension = mapSection.getExtension();
        mapViewExtension.clearRouteCache();
        return Promise.resolve(); 
    } catch (err) {  
        Logger.error('Sync', err.message);
        return Promise.resolve();
    }
}

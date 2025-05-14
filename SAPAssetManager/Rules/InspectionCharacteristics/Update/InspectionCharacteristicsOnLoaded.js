import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import { FDCFilterable } from '../../FDC/DynamicPageGenerator';
import inspCharLib from './InspectionCharacteristics';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default async function InspectionCharacteristicsOnLoaded(context) {
    context.getClientData().Filterable = new FDCFilterable(context);
    const {
        FromErrorArchive,
        ErrorObject,
        sectionBindings,
    } = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
    for (const sectBinding of sectionBindings) {
        context.getControls()[0].sections[0]._context.binding = sectBinding;
    }
    for (const bindingItem of sectionBindings) {
        if (bindingItem.RequiredChar === 'X') {
            await inspCharLib.enableDependentCharacteristics(context, bindingItem, sectionBindings);
        }
    }
    context.getControls()[0].redraw();
    try {
        if (FromErrorArchive || ErrorObject) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
        }
    } catch (err) {
        Logger.error('ErrorArchieve', err.message);
    }

    libCom.saveInitialValues(context);
}

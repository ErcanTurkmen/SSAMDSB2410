import { Filterable } from '../../../Common/Filterable';

export default async function MeasuringPointsEDTPageOnLoaded(context) {
    let filterable = new Filterable(context);
	context.getClientData().Filterable = filterable;

    let filters = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().filters;
    context.evaluateTargetPathForAPI('#Page:-Current').getClientData().filters = filters;

    StyleDiscardButton(context);
}

function StyleDiscardButton(context) {
    const sectionProxy = context.getPageProxy().getControls()[0].getSection('DiscardSection');
    if (sectionProxy) {
        const button = sectionProxy.getControl('DiscardButton');
        if (button) {
            button.setStyle('ObjectCellStyleRed', 'Value');
            sectionProxy.redraw();
        }
    }
}

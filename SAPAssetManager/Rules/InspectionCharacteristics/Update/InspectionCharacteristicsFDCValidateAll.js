import inspCharLib from './InspectionCharacteristics';

export default async function InspectionCharacteristicsFDCValidateAll(context) {
    let sections = context.getPageProxy().getControls()[0].sections;
    let sectionBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
    if (sections && sections.length > 0) {
        for (let i=0; i < sections.length; i++) {
            let section = sections[i];
            await inspCharLib.validateCharacteristic(context, sectionBindings[i], section, i);
            if (sectionBindings[i].RequiredChar === 'X') {
                await inspCharLib.enableDependentCharacteristics(context, sectionBindings[i], sectionBindings);
            }
        }
    }
}

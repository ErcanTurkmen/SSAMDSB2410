import libCom from '../../Common/Library/CommonLibrary';

export default async function OnlineClassificationCharacteristicsTarget(context) {
    let result = [];

    if (context.binding?.ClassId && context.binding?.ClassType) {
        const filter = `$filter=ClassId eq '${context.binding?.ClassId}' and ClassType eq '${context.binding?.ClassType}'&$expand=ClassCharacteristics`;
        const classDefinition = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'ClassDefinitions', [], filter);
        
        if (libCom.isDefined(classDefinition)) {
            const classCharacteristics = classDefinition.getItem(0)?.ClassCharacteristics;

            if (libCom.isDefined(classCharacteristics)) {
                // backend reuses the ClassId and ClassType provided above to get Characteristics
                const characteristics = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'Characteristics', [], '');
                characteristics.forEach((char) => {
                    const classCharIdx = classCharacteristics.findIndex(classChar => classChar.InternCharNum === char.CharId);
                    if (classCharIdx !== -1) {
                        classCharacteristics[classCharIdx].Characteristic = char;
                    }
                });
            }
            result.push(...classCharacteristics);
        }
    }

    return result;
}

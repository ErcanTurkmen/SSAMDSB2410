/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsQualitativeIsEditable(context) {
    let binding = context.binding;
    return (binding.RequiredChar === 'X' || binding.OptionalChar === 'X');
}

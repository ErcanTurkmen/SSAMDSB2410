/**
* returns if the material is batch managed or not
* @param {IClientAPI} context
*/
export default function BatchIndicator(context) {
     return context.binding.MaterialPlant?.BatchIndicator ? context.localizeText('yes') : context.localizeText('no');  
}

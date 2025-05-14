import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocumentPlant(context) {
    if (context.binding) {
        return context.binding.Plant;
    }
    return CommonLibrary.getDefaultUserParamt('USER_PARAM.WRK');
}

import MobileStatusLibrary from '../../../MobileStatus/MobileStatusLibrary';

export default function ServiceQuotationsMobileStatusFilter(context) {
    return MobileStatusLibrary.getMobileStatusFilterOptions(context, context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/S4ServiceQuotation.global').getValue());
}

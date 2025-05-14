import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function GetServiceQuotationLocalID(context) {
    if (context.binding?.ObjectID) {
        return context.binding.ObjectID;
    }

    return CommonLibrary.getStateVariable(context, 'LocalId');
}

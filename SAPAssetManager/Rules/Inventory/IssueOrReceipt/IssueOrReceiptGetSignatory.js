import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptGetSignatory(context) {
    if (CommonLibrary.getStateVariable(context, 'SGoodsRecipient')) {
        return CommonLibrary.getStateVariable(context, 'SGoodsRecipient');
    } else if (context.binding?.GoodsRecipient) {
        return context.binding.GoodsRecipient;
    } else {
        return CommonLibrary.getSapUserName(context);
    }
}

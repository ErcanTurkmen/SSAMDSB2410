import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ExpenseCreateUpdatePageCaption(context) {
    return context.localizeText(CommonLibrary.IsOnCreate(context) ? 'add_expense' : 'edit_expense'); 
}

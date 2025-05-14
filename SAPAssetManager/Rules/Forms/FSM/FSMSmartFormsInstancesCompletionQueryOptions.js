import SmartFormsCompletionLibrary from '../SmartFormsCompletionLibrary';

export default function FSMSmartFormsInstancesCompletionQueryOptions(context) {
    let options = '$expand=FSMFormTemplate_Nav&$orderby=Mandatory desc';
    let filters = SmartFormsCompletionLibrary.getSmartformsFilterQueryOption(context);

    return options + '&' + filters;
}

import CategoryValueChangedCommon from '../../../Common/Controls/Handlers/CategoryValueChanged';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function CategoryValueChanged(context) {
    ResetValidationOnInput(context);
    CategoryValueChangedCommon(context, 'FuncLocCategory');
}

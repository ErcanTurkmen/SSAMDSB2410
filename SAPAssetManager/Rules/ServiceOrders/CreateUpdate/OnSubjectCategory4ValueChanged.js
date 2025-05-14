import CommonLibrary from '../../Common/Library/CommonLibrary';
import CategoryValueChanged from '../../ServiceItems/CreateUpdate/CategoryValueChanged';

export default function OnSubjectCategory4ValueChanged(control) {
    let category3Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory3LstPkr');
    let category2Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory2LstPkr');
    let category1Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory1LstPkr');

    let childControls = [];
    let parentControls = [
        {control: category3Control, level: '3'},
        {control: category2Control, level: '2'},
        {control: category1Control, level: '1'},
    ];
    CategoryValueChanged(control, childControls, parentControls, 'SubjectCategory');
}

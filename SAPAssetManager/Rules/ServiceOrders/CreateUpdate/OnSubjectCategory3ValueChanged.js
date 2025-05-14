import CommonLibrary from '../../Common/Library/CommonLibrary';
import CategoryValueChanged from '../../ServiceItems/CreateUpdate/CategoryValueChanged';

export default function OnSubjectCategory3ValueChanged(control) {
    let category4Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory4LstPkr');
    let category2Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory2LstPkr');
    let category1Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory1LstPkr');

    let childControls = [{control: category4Control, level: '4', dependent: true}];
    let parentControls = [
        {control: category2Control, level: '2'},
        {control: category1Control, level: '1'},
    ];
    CategoryValueChanged(control, childControls, parentControls, 'SubjectCategory');
}

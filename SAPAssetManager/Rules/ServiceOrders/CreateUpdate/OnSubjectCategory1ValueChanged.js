import CommonLibrary from '../../Common/Library/CommonLibrary';
import CategoryValueChanged from '../../ServiceItems/CreateUpdate/CategoryValueChanged';

export default function OnSubjectCategory1ValueChanged(control) {
    let category2Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory2LstPkr');
    let category3Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory3LstPkr');
    let category4Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'SubjectCategory4LstPkr');

    let childControls = [
        {control: category2Control, level: '2', dependent: true}, 
        {control: category3Control, level: '3', dependent: false}, 
        {control: category4Control, level: '4', dependent: false},
    ];
    let parentControls = [];
    CategoryValueChanged(control, childControls, parentControls, 'SubjectCategory');
}

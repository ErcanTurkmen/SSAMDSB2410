import CommonLibrary from '../../Common/Library/CommonLibrary';
import CategoryValueChanged from '../../ServiceItems/CreateUpdate/CategoryValueChanged';

export default function OnReasonCategory2ValueChanged(control) {
    let category1Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'ReasonCategory1LstPkr');
    let category3Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'ReasonCategory3LstPkr');
    let category4Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'ReasonCategory4LstPkr');

    let childControls = [
        {control: category3Control, level: '3', dependent: true}, 
        {control: category4Control, level: '4', dependent: false},
    ];
    let parentControls = [{control: category1Control, level: '1'}];
    CategoryValueChanged(control, childControls, parentControls, 'ReasonCategory');
}

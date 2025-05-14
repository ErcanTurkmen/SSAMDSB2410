import CommonLibrary from '../../Common/Library/CommonLibrary';
import CategoryValueChanged from '../../ServiceItems/CreateUpdate/CategoryValueChanged';

export default function OnReasonCategory4ValueChanged(control) {
    let category3Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'ReasonCategory3LstPkr');
    let category2Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'ReasonCategory2LstPkr');
    let category1Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'ReasonCategory1LstPkr');
    
    let childControls = [];
    let parentControls = [
        {control: category3Control, level: '3'},
        {control: category2Control, level: '2'},
        {control: category1Control, level: '1'},
    ];
    CategoryValueChanged(control, childControls, parentControls, 'ReasonCategory');
}

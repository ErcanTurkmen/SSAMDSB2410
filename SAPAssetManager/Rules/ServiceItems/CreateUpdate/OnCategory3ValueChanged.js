import CommonLibrary from '../../Common/Library/CommonLibrary';
import CategoryValueChanged from './CategoryValueChanged';

export default function OnCategory3ValueChanged(control) {
    let category2Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'Category2LstPkr');
    let category1Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'Category1LstPkr');

    let childControls = [];
    let parentControls = [
        {control: category2Control, level: '2'},
        {control: category1Control, level: '1'},
    ];
    CategoryValueChanged(control, childControls, parentControls);
}

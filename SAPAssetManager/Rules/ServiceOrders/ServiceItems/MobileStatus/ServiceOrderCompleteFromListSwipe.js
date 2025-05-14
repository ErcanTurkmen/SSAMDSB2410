import CommonLibrary from '../../../Common/Library/CommonLibrary';
import NavOnCompleteServiceOrderPage from '../../Status/NavOnCompleteServiceOrderPage';

export default function ServiceOrderCompleteFromListSwipe(context, binding) {
    let pageName = CommonLibrary.getPageName(context);
    CommonLibrary.setStateVariable(context, 'contextMenuSwipePage', pageName);
    
    CommonLibrary.setBindingObject(context);

    return NavOnCompleteServiceOrderPage(context, binding);
}

import pageToolbar from './DetailsPageToolbarClass';
import common from '../Library/CommonLibrary';

export default function DetailsPageToolbarVisibility(context) {
    return common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
}

import pageToolbar from './DetailsPageToolbarClass';

export default function DetailsPageToolbarItems(context) {
    return pageToolbar.getInstance().getToolbarItems(context);
}

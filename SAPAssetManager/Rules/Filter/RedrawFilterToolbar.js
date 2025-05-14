import { redrawToolbar } from '../Common/DetailsPageToolbar/ToolbarRefresh';

export default function RedrawFilterToolbar(context) {
    redrawToolbar(context.getPageProxy());
}

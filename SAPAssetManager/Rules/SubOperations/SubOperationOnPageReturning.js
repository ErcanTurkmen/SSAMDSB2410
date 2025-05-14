import ToolbarRefresh from '../Common/DetailsPageToolbar/ToolbarRefresh';
import ProgressTrackerOnDataChanged from '../TimelineControl/ProgressTrackerOnDataChanged';

export default function SubOperationOnPageReturning(context) {
    return ToolbarRefresh(context).then(() => {
        return ProgressTrackerOnDataChanged(context);
    });
}

import ApprovalsReadLink from './ApprovalsReadLink';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ApprovalsQueryOptionsIssued, ApprovalsQueryOptionsPending } from './ApprovalsQueryOptions';

export default function ApprovalsObjectTableVisible(context) {
    let queryOptionsMethod;

    switch (context.getName()) {
        case 'PendingApprovalsListSection':
            queryOptionsMethod = ApprovalsQueryOptionsPending;
            break;
        case 'ReceivedApprovalsListSection':
            queryOptionsMethod = ApprovalsQueryOptionsIssued;
            break;
    }

    return CommonLibrary.getEntitySetCount(context, ApprovalsReadLink(context), queryOptionsMethod()).then(count => {
        return !!count;
    });
}

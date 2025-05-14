import ApprovalsReadLink from './ApprovalsReadLink';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ApprovalsQueryOptionsIssued } from './ApprovalsQueryOptions';

export default function ApprovalsPageCaption(context) {
    const promises = [
        CommonLibrary.getEntitySetCount(context, ApprovalsReadLink(context), ApprovalsQueryOptionsIssued()),
        CommonLibrary.getEntitySetCount(context, ApprovalsReadLink(context), ''),
    ];

    return Promise.all(promises).then(([approved, pending]) => {
        return context.localizeText('approvals_x_x', [approved, pending]);
    });
}

import allowIssue from './AllowIssueForSTO';

/**
* Show/hide toolbar 'Receive All' and 'Issue All' buttons on STO page
*/
export default function STOIssueOrReceiveAllVisible(context) {
    const controlName = context.getName();
    const issueAllowed = allowIssue(context);

    if (controlName === 'IssuePartTbI') {
        return issueAllowed;
    } else if (controlName === 'ReceivePartTbI') {
        return !issueAllowed;
    }
}

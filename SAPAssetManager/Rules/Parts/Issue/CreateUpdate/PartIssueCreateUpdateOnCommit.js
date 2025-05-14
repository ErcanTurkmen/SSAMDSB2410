import PartIssueCreateUpdateValidation from './PartIssueCreateUpdateValidation';

export default function PartIssueCreateUpdateOnCommit(context) {
    return PartIssueCreateUpdateValidation(context).then(result => {
        if (!result) {
            return false;
        }

        return context.executeAction('/SAPAssetManager/Actions/Parts/PartIssueCreateHeader.action');
    });
}

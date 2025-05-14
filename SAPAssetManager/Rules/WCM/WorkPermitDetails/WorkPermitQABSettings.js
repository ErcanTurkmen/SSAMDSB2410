import QABSettings from '../../QAB/QABSettings';

export default class WorkPermitQABSettings extends QABSettings {
    async generateChips() {
        const chips = [
            this._createAddNotificationChipWCMDetailsPage(),
            this._createChip({
                'Label': this._context.localizeText('issue_approvals'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABIssueApprovals.png,/SAPAssetManager/Images/QABIssueApprovals.android.png)',
                'Action': '/SAPAssetManager/Actions/WCM/Approvals/ApprovalsListViewNav.action',
                '_Name': 'ISSUE_APPROVALS',
            }),
            this._createAddWCMNoteChip(),
            await this._createDownloadDocumentsChip(),
        ];

        return super.generateChips(chips);
    } 
}

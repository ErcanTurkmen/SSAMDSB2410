import libPersona from '../../Persona/PersonaLibrary';

export default function ApprovalsDetailImage(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? undefined : '$(PLT, /SAPAssetManager/Images/DetailImages/IssueApprovals.png, /SAPAssetManager/Images/DetailImages/IssueApprovals.android.png)';
}

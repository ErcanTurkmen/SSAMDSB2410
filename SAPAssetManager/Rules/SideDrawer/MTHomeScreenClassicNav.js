import IsWCMSafetyCertificateEnabled from '../UserFeatures/IsWCMSafetyCertificateEnabled';
import IsWCMWorkPermitEnabled from '../UserFeatures/IsWCMWorkPermitEnabled';

export default function MTHomeScreenClassicNav(context) {
    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/OverviewClassic.page');

    appendWCMBusinessObjects(context, page);

    return context.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericNav.action',
        Properties: {
            PageMetadata: page,
            ClearHistory: true,
            ModalPage: false,
        },
        Type: 'Action.Type.Navigation',
    });
}

export function appendWCMBusinessObjects(context, page) {
    const enabledWCMBusinessObjects = [];
    if (IsWCMWorkPermitEnabled(context)) {
        enabledWCMBusinessObjects.push('WorkPermit');
    }
    if (IsWCMSafetyCertificateEnabled(context)) {
        enabledWCMBusinessObjects.push('LOTOCertificate', 'OperationalItem');
    }
    if (0 < enabledWCMBusinessObjects.length) {
        const wcmOverview = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/WCMOverview.page');
        const wcmBOs = wcmOverview.Controls.find(c => c._Type === 'Control.Type.SectionedTable').Sections.find(s => s._Name === 'WCMMapExtensionSection').ExtensionProperties.BusinessObjects.filter(bo => enabledWCMBusinessObjects.includes(bo.Type));
        page.Controls.find(c => c._Type === 'Control.Type.SectionedTable').Sections.find(s => s._Name === 'MapExtensionSection').ExtensionProperties.BusinessObjects.push(...wcmBOs);
    }
}

import IsWCMSafetyCertificateEnabled from '../UserFeatures/IsWCMSafetyCertificateEnabled';
import IsWCMWorkPermitEnabled from '../UserFeatures/IsWCMWorkPermitEnabled';
import BeforeMapNav from './BeforeMapNav';

export default function BeforeMTOverviewMapNav(context) {
    BeforeMapNav(context, ConstructMtMapPageNav(context, '/SAPAssetManager/Pages/Extensions/Map.page'));
}

export function ConstructMtMapPageNav(context, pagePath) {
    const page = context.getPageProxy().getPageDefinition(pagePath);
    appendWCMBusinessObjectsToMapPage(context, page);

    return {
        Name: '/SAPAssetManager/Actions/Common/GenericNav.action',
        Properties: {
            PageMetadata: page,
            ModalPage: false,
        },
        Type: 'Action.Type.Navigation',
    };
}

function appendWCMBusinessObjectsToMapPage(context, page) {  // inplace
    const enabledWCMBusinessObjects = [];
    if (IsWCMWorkPermitEnabled(context)) {
        enabledWCMBusinessObjects.push('WorkPermit');
    }
    if (IsWCMSafetyCertificateEnabled(context)) {
        enabledWCMBusinessObjects.push('LOTOCertificate', 'OperationalItem');
    }
    if (0 < enabledWCMBusinessObjects.length) {
        const wcmMap = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/Extensions/WCMMap.page');
        const wcmBOs = wcmMap.Controls.find(c => c._Name === 'MapExtensionControl').ExtensionProperties.BusinessObjects.filter(bo => enabledWCMBusinessObjects.includes(bo.Type));
        page.Controls.find(c => c._Name === 'MapExtensionControl').ExtensionProperties.BusinessObjects.unshift(...wcmBOs);
    }
}

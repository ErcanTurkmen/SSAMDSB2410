import CommonLibrary from '../../Common/Library/CommonLibrary';
import { DQBAndFilterSafe } from '../../WCM/Common/DataQueryBuilderUtils';
import LOTOCertificatesOverviewPageQueryOption from '../../WCM/SafetyCertificates/LOTOCertificatesOverviewPageQueryOption';

export default function CertificateBOQueryOptions(context) {
    const toExpand = ['MyEquipments/EquipGeometries/Geometry', 'MyFunctionalLocations/FuncLocGeometries/Geometry'];
    const filterTerm = 'MyFunctionalLocations/FuncLocGeometries/any(fg: sap.entityexists(fg/Geometry)) or MyEquipments/EquipGeometries/any(eg:sap.entityexists(eg/Geometry))';

    const dqb = CommonLibrary.getPageName(context) === 'WCMOverviewPage' ? context.dataQueryBuilder(LOTOCertificatesOverviewPageQueryOption()) : context.dataQueryBuilder();

    dqb.expand(toExpand.join(','));
    DQBAndFilterSafe(dqb, filterTerm);
    return dqb.build();
}

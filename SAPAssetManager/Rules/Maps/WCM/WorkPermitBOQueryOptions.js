import { DQBAndFilterSafe } from '../../WCM/Common/DataQueryBuilderUtils';
import WorkPermitsListViewQueryOption from '../../WCM/WorkPermits/WorkPermitsListViewQueryOption';

export default function WorkPermitBOQueryOptions(context) {
    const toExpand = ['MyEquipments/EquipGeometries/Geometry', 'MyFunctionalLocations/FuncLocGeometries/Geometry'];
    const filterTerm = '(MyFunctionalLocations/FuncLocGeometries/any(fg:sap.entityexists(fg/Geometry)) or MyEquipments/EquipGeometries/any(eg:sap.entityexists(eg/Geometry)))';

    const overviewDQB = WorkPermitsListViewQueryOption(context);
    overviewDQB.expand(toExpand.join(','));
    DQBAndFilterSafe(overviewDQB, filterTerm);
    return overviewDQB.build();
}

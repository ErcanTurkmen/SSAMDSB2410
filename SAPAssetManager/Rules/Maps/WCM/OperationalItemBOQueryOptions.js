import { DQBAndFilterSafe } from '../../WCM/Common/DataQueryBuilderUtils';
import OperationalItemsListViewQueryOptions from '../../WCM/OperationalItems/ListView/OperationalItemsListViewQueryOptions';

export default function OperationalItemBOQueryOptions(context) {
    const toExpand = ['WCMDocumentHeaders/WCMDocumentUsages', 'WCMDocumentHeaders', 'PMMobileStatus', 'MyEquipments/EquipGeometries/Geometry', 'MyFunctionalLocations/FuncLocGeometries/Geometry'];
    const filterTerm = '(MyFunctionalLocations/FuncLocGeometries/any(fg:sap.entityexists(fg/Geometry)) or MyEquipments/EquipGeometries/any(eg:sap.entityexists(eg/Geometry)))';

    const dqb = OperationalItemsListViewQueryOptions(context);
    dqb.expand(toExpand.join(','));
    DQBAndFilterSafe(dqb, filterTerm);

    return dqb.build();
}

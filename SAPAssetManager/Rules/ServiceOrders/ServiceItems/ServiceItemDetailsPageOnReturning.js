import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import IsIOS from '../../Common/IsIOS';
import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import SubServiceItemQueryOptions from './SubItem/SubServiceItemQueryOptions';

export default function ServiceItemDetailsPageOnReturning(context) {
    resetSubItemsEdtTable(context);
    return ToolbarRefresh(context);
}

export async function resetSubItemsEdtTable(context) {
    if (PersonalizationPreferences.isServiceItemTableView(context)) {
        const sectionedTable = context.getControl('SectionedTable');
        const subItemsEDTSection = sectionedTable.getSection('ServiceSubItemsTableSection');
        const subItemsObjectTableSection = sectionedTable.getSection('ServiceSubItems');

        const itemsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', SubServiceItemQueryOptions(context, false, false));

        if (itemsCount === 0) {
            subItemsEDTSection.setVisible(false);
            subItemsObjectTableSection.setVisible(true);
        } else {
            subItemsObjectTableSection.setVisible(false);
            subItemsEDTSection.setVisible(true).then(() => {
                const edtExtension = subItemsEDTSection?.getExtension();
                if (edtExtension && IsIOS(context)) {
                    edtExtension.onCreate();
                }
            });
        }
    }
}

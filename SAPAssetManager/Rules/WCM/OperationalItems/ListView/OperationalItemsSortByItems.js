import libVal from '../../../Common/Library/ValidationLibrary';
import { OpItemsSubPageNames } from './ConstructOperationalItemsListViewTabs';

export default function OperationalItemsSortByItems(context) {
    const selectedTab = context.binding && context.binding.selectedTab;
    const subpageNames = OpItemsSubPageNames(context);
    const sortByItems = [
        {
            'ReturnValue': 'WCMDocumentHeaders/Priority',
            'DisplayValue': '$(L,related_safety_certificate_priority)',
        },
        {
            'ReturnValue': 'TechObject',
            'DisplayValue': '$(L,wcm_technical_object_id)',
        },
        {
            'ReturnValue': 'ShortText',
            'DisplayValue': '$(L,description)',
        },
        {
            'ReturnValue': 'WCMDocumentHeaders/WCMDocument',
            'DisplayValue': '$(L,related_safety_certificate_label)',
        },
        {
            'ReturnValue': 'SwitchingLoc',
            'DisplayValue': '$(L,switching_location)',
        },
        {
            'ReturnValue': 'TagSequence',
            'DisplayValue': '$(L,tag_sequence)',
            'hiddenForTabs': subpageNames.untagging,
        },
        {
            'ReturnValue': 'UntSequence',
            'DisplayValue': '$(L,untag_sequence)',
            'hiddenForTabs': subpageNames.tagging,
        },
        {
            'ReturnValue': 'Location',
            'DisplayValue': '$(L,physical_location)',
        },
    ];

    return sortByItems.reduce((acc, item) => {
        // Hide sort by options that are not applicable to the selected tab
        if (libVal.evalIsEmpty(selectedTab) || libVal.evalIsEmpty(item.hiddenForTabs) || !item.hiddenForTabs.includes(selectedTab)) {
            delete item.hiddenForTabs;
            acc.push(item);
        }

        return acc;
    }, []);
}

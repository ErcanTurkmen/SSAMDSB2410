import CommonLibrary from '../../../Common/Library/CommonLibrary';

const WCMPrintCategory = Object.freeze({
    HeaderData: 0,
    TaggingList: 1,
    UntaggingList: 3,
    Tag: 4,
    TestTag: 5,
    WorkPermit: 6,
});

export default function OperationalItemsTagFormatFilter(context) {
    const filterData = {
        name: 'PrintFormatTag',
        values: [],
    };

    const planningPlant = CommonLibrary.getUserDefaultPlanningPlant();

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMPrintFormatTags', [], `$filter=PlanningPlant eq '${planningPlant}' and PrintCategory eq '${WCMPrintCategory.Tag}'`).then((data) => {
        data.forEach((item) => {
            filterData.values.push({ ReturnValue: item.PrintFormat, DisplayValue: item.ShortText });
        });

        return filterData;
    }, () => {
        return filterData;
    });
}

export const VoyageStatus = Object.freeze({
    InTransit: '01',
    Arrived: '02',
    Completed: '03',
});

export const ContainerStatus = Object.freeze({
    Dispatched: '10',
    PartiallyReceived: '20',
    Received: '30',
    Unloaded: '40',
    Arrived: '50',
});

export const ContainerItemStatus = Object.freeze({
    Dispatched: '10',
    Arrived: '20',
    InProcess: '30',
    ReceiptInProcess: '35',
    Received: '40',
    Deleted: '50',
    Unloaded: '60',
    NotFound: '70',
    ReceivedForTransfer: '80',
});

export const FLDefiningRequestsLite = Object.freeze([
    'FldLogsVoyages',
    'FldLogsContainers',
    'FldLogsContainerItems',
    'FldLogsPackages',
    'FldLogsPackageItems',
    'FldLogsHuDelItems',
]);

export const FLDocumentTypeValues = Object.freeze({
    Voyage: 'VOY',
});

export function appendVoyageNumberForContainerFilter(currentFilter, context) {
    if (context.binding?.VoyageNumber) {
        let voyageNumberFilter = ` and (VoyageNumber eq '${context.binding.VoyageNumber}')`;
        return currentFilter + voyageNumberFilter;
    }
    return currentFilter;
}

export function appendVoyageNumberForPackagesFilter(currentFilter, context) {
    if (context.binding?.VoyageNumber) {
        let voyageNumberFilter = `(VoyageNumber eq '${context.binding.VoyageNumber}')`;
        // Adding condition to exclude packages with ParentCtnId
        let excludeParentCtnIdFilter = '(ParentCtnID eq null or ParentCtnID eq \'\')';
        return `${currentFilter} and (${voyageNumberFilter} and ${excludeParentCtnIdFilter})`;
    }
    return currentFilter;
}

export function appendContainerIDFilter(currentFilter, context) {
    if (context.binding?.ContainerID) {
        let containerIDFilter = ` and (ContainerID eq '${context.binding.ContainerID}')`;
        return currentFilter + containerIDFilter;
    }
    return currentFilter;
}

export function appendParentContainerIDFilter(currentFilter, context) {
    if (context.binding?.ContainerID) {
        let containerIDFilter = ` and (ParentCtnID eq '${context.binding.ContainerID}')`;
        return currentFilter + containerIDFilter;
    }
    return currentFilter;
}

export default class {
    /**
     * Opens document details page for the FL Persona
     */
    static openDocumentDetailsPage(context, entitySet, queryOptions, objectType) {
        let query = queryOptions;
        if (!query.includes('$expand=')) {
            const toExpand = [
                'FldLogsVoyageStatus_Nav', 
                'FldLogsContainer_Nav', 
                'FldLogsPackage_Nav', 
                'FldLogsVoyageType_Nav',
            ];
            query += `&$expand=${toExpand.join(',')}`;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(data => {
            if (data.length === 1) {
                if (objectType === FLDocumentTypeValues.Voyage) {
                    const page = context.evaluateTargetPathForAPI('#Page:FLOverviewPage');
                    page.setActionBinding(data.getItem(0));
                    return page.executeAction('/SAPAssetManager/Actions/FL/Voyages/VoyageDetailsPageNav.action');
                } 
            }
            return false;
        });
    }
}

export function getPlantNameFL(clientAPI, plantId) {  
        const queryOptions = "$filter=Plant eq '" + plantId + "'"; 
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPlants', [], queryOptions).then((result) => {
 
            if (result?.length > 0) { 
                return result.getItem(0).Plant + ' - ' + result.getItem(0).PlantName; 
            } 
            return plantId; 
        }); 
    }

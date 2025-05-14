import GetPlantName from './GetPlantName';

export default function StorageLocationQuery(context) {
    return GetPlantName(context).then((plant) => {
        if (plant) {
            return `$filter=Plant eq '${plant}' &$orderby=StorageLocation`;
        }
        return '';
    });
}


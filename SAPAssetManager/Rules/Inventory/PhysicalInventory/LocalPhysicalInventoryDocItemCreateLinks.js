
export default function PhysicalInventoryDocItemCreateLinks(context) {

    const links = [];
    const plant = context.binding?.Plant;
    const material = context.binding?.Material;
    const sloc = context.binding?.StorLocation;

    links.push({
        'Property': 'MaterialPlant_Nav',
        'Target':
        {
            'EntitySet': 'MaterialPlants',
            'QueryOptions': `$filter=Plant eq '${plant}' and MaterialNum eq '${material}'`,
        },
    });

    links.push({
        'Property': 'MaterialSLoc_Nav',
        'Target':
        {
            'EntitySet': 'MaterialSLocs',
            'QueryOptions': `$filter=Plant eq '${plant}' and MaterialNum eq '${material}' and StorageLocation eq '${sloc}'`,
        },
    });

    links.push({
        'Property': 'Material_Nav',
        'Target':
        {
            'EntitySet': 'Materials',
            'QueryOptions': `$filter=MaterialNum eq '${material}'`,
        },
    });

    return links;
}

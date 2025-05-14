export default function MeasuringPointFDCFilterEquipFlocQueryOptions(context) {
    const binding = context.getPageProxy().binding;
    const dataType = binding['@odata.type'];

    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()) {
        if (context.getName() === 'Equipment') {
            // Get header-level equipment as Promise<Object>
            let work_order_equipment = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Equipment`, [], '').then(result => {
                if (result.length > 0)
                    return { 'DisplayValue': `${result.getItem(0).EquipId} - ${result.getItem(0).EquipDesc}`, 'ReturnValue': result.getItem(0).EquipId };
                else
                    return null;
            });
            // Get list of operation-level equipment as Promise<Array<Object>>
            let work_order_op_equipments = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Operations`, [], '').then(result => {
                return Promise.all(result._array.map(async operation => {
                    return await context.read('/SAPAssetManager/Services/AssetManager.service', `${operation['@odata.readLink']}/EquipmentOperation`, [], '').then(result2 => result2._array);
                })).then(array => array.flat(1).map(e => {
                    return { 'DisplayValue': `${e.EquipId} - ${e.EquipDesc}`, 'ReturnValue': e.EquipId };
                }));
            });

            return Promise.all([work_order_equipment, work_order_op_equipments]).then(equipments => {
                if (equipments[0])
                    equipments[1].push(equipments[0]);

                context.setVisible(equipments[1].length > 0);

                return equipments[1];
            });
        } else if (context.getName() === 'FuncLoc') {
            // Get list of header-level FLOCs as Promise<Object>
            let work_order_floc = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/FunctionalLocation`, [], '').then(result => {
                if (result.length > 0)
                    return { 'DisplayValue': `${result.getItem(0).FuncLocId} - ${result.getItem(0).FuncLocDesc}`, 'ReturnValue': result.getItem(0).FuncLocId };
                else
                    return null;
            });
            // Get list of operation-level FLOCs as Promise<Array<Object>>
            let work_order_op_flocs = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Operations`, [], '').then(result => {
                return Promise.all(result._array.map(async operation => {
                    return await context.read('/SAPAssetManager/Services/AssetManager.service', `${operation['@odata.readLink']}/FunctionalLocationOperation`, [], '').then(result2 => result2._array);
                })).then(array => array.flat(1).map(e => {
                    return { 'DisplayValue': `${e.FuncLocId} - ${e.FuncLocDesc}`, 'ReturnValue': e.FuncLocId };
                }));
            });

            return Promise.all([work_order_floc, work_order_op_flocs]).then(flocs => {
                if (flocs[0])
                    flocs[1].push(flocs[0]);

                context.setVisible(flocs[1].length > 0);

                return flocs[1];
            });
        } else {
            return [];
        }
    } else if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()) {
        let orderLink = binding['@odata.readLink'];
        let options = [];

        if (context.getName() === 'Equipment') {
            return context.read('/SAPAssetManager/Services/AssetManager.service', orderLink, [], '$expand=RefObjects_Nav/Equipment_Nav/MeasuringPoints,ServiceItems_Nav/RefObjects_Nav/Equipment_Nav/MeasuringPoints').then(result => {
                let order = result.getItem(0);

                for (let refObject of order.RefObjects_Nav) {
                    if (refObject.Equipment_Nav && refObject.Equipment_Nav.MeasuringPoints && refObject.Equipment_Nav.MeasuringPoints.length) {
                        options.push({
                            'DisplayValue': `${refObject.Equipment_Nav.EquipId} - ${refObject.Equipment_Nav.EquipDesc}`,
                            'ReturnValue': refObject.Equipment_Nav.EquipId,
                        });
                    }
                }

                for (let item of order.ServiceItems_Nav) {
                    for (let refObject of item.RefObjects_Nav) {
                        if (refObject.Equipment_Nav && refObject.Equipment_Nav.MeasuringPoints && refObject.Equipment_Nav.MeasuringPoints.length) {
                            options.push({
                                'DisplayValue': `${refObject.Equipment_Nav.EquipId} - ${refObject.Equipment_Nav.EquipDesc}`,
                                'ReturnValue': refObject.Equipment_Nav.EquipId,
                            });
                        }
                    }
                }

                return options;
            });
        } else if (context.getName() === 'FuncLoc') {
            return context.read('/SAPAssetManager/Services/AssetManager.service', orderLink, [], '$expand=RefObjects_Nav/FuncLoc_Nav/MeasuringPoints,ServiceItems_Nav/RefObjects_Nav/FuncLoc_Nav/MeasuringPoints').then(result => {
                let order = result.getItem(0);

                for (let refObject of order.RefObjects_Nav) {
                    if (refObject.FuncLoc_Nav && refObject.FuncLoc_Nav.MeasuringPoints && refObject.FuncLoc_Nav.MeasuringPoints.length) {
                        options.push({
                            'DisplayValue': `${refObject.FuncLoc_Nav.FuncLocId} - ${refObject.FuncLoc_Nav.FuncLocDesc}`,
                            'ReturnValue': refObject.FuncLoc_Nav.FuncLocId,
                        });
                    }
                }

                for (let item of order.ServiceItems_Nav) {
                    for (let refObject of item.RefObjects_Nav) {
                        if (refObject.FuncLoc_Nav && refObject.Equipment_Nav.MeasuringPoints && refObject.FuncLoc_Nav.MeasuringPoints.length) {
                            options.push({
                                'DisplayValue': `${refObject.FuncLoc_Nav.FuncLocId} - ${refObject.FuncLoc_Nav.FuncLocDesc}`,
                                'ReturnValue': refObject.FuncLoc_Nav.FuncLocId,
                            });
                        }
                    }
                }

                return options;
            });
        } else {
            return [];
        }
    } else if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue()) {
        if (context.getName() === 'Equipment') {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Equipment`, [], '').then(result => {
                const options = [];
        
                if (result.length > 0) {
                    options.push({ 'DisplayValue': `${result.getItem(0).EquipId} - ${result.getItem(0).EquipDesc}`, 'ReturnValue': result.getItem(0).EquipId });
                }
                context.setVisible(!!options.length);

                return options;
            });
        } else if (context.getName() === 'FuncLoc') {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/FunctionalLocation`, [], '').then(result => {
                const options = [];

                if (result.length > 0) {
                    options.push({ 'DisplayValue': `${result.getItem(0).FuncLocId} - ${result.getItem(0).FuncLocDesc}`, 'ReturnValue': result.getItem(0).FuncLocId });
                }
                context.setVisible(!!options.length);

                return options;
            });
        } else {
            return [];
        }
    } else {
        return [];
    }
}

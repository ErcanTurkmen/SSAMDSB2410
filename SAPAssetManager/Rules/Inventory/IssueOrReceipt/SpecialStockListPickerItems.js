import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import { SpecialStock } from '../Common/Library/InventoryLibrary';

/**
 * @param {IListPickerFormCellProxy} context
 * @param {string} selectedMovementType
 * @typedef {{ DisplayValue: string, ReturnValue: string }} ListPickerElement
 * @returns {Promise<ListPickerElement[]>}
*/
export default function SpecialStockListPickerItems(context, selectedMovementType = '') {
    if (ValidationLibrary.evalIsEmpty(selectedMovementType)) {
        return Promise.resolve([]);
    }
    const supportedSpecialStocks = [
        SpecialStock.OrdersOnHand,
        SpecialStock.ConsignmentVendor,
        SpecialStock.ProjectStock,
        SpecialStock.PipelineStock,
    ];
    const specialStockFilterTerm = supportedSpecialStocks.map(i => `SpecialStock eq '${i}'`).join(' or ');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MovementTypeSpecialStocks', [], `$filter=MovementType eq '${selectedMovementType}' and (${specialStockFilterTerm})`)
        .then((/**@type {ObservableArray<MovementTypeSpecialStock>} */ specialStocks) => ValidationLibrary.evalIsEmpty(specialStocks) ? [] : [...new Set(specialStocks.map(item => item.SpecialStock))])
        .then((/**@type {string[]} */ uniqueSpecialStocks) => SpecialStocksToListpickerItems(context, uniqueSpecialStocks));
}

/**
 *  @param {IClientAPI} context
 * @param {string[]} specialStocks
 * @returns {Promise<{ReturnValue: string, DisplayValue: string}[]>} */
export function SpecialStocksToListpickerItems(context, specialStocks) {
    if (ValidationLibrary.evalIsEmpty(specialStocks)) {
        return [];
    }
    const specialStockFilterTerm = specialStocks.map(i => `SpecialStock eq '${i}'`).join(' or ');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'SpecialStockTexts', [], `$filter=${specialStockFilterTerm}`)
        .then((/**@type {ObservableArray<SpecialStockText>} */ texts) => {
            const textMap = new Map(texts.map((i) => [i.SpecialStock, i.Description]));
            return specialStocks.map(s => ({
                ReturnValue: s,
                DisplayValue: `${s} - ${textMap.get(s) || ''}`,
            }));
        });
}

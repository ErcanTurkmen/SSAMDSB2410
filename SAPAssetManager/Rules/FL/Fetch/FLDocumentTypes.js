import { FLDocumentTypeValues } from '../Common/FLLibrary';
/**
 * 
 * @param {*} context 
 * @returns List of Documents supported for fetching
 */
export default function FLDocumentTypes(context) {
    return [
        {DisplayValue: context.localizeText('fld_voyages'), ReturnValue: FLDocumentTypeValues.Voyage},
    ];
}

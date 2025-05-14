import isDefenseEnabled from '../../Defense/isDefenseEnabled';

export default function MaterialLstPkrDescription(context) {
    if (isDefenseEnabled(context)) {
        const binding = context.binding;
        const material = binding?.Material;

        let mpn = binding?.ManufacturerPartNum || material?.ManufacturerPartNum  || '-';
        let lmpn = binding?.LongManufacturerPartNum || material?.LongManufacturerPartNum || '-';
        let nato = binding?.NATOStockNum || material?.NATOStockNum || '-';
        return 'MPN: ' + mpn + '\n' + 'LMPN: ' + lmpn + '\n' + 'NATO: ' + nato;
    } else {
        return '';
    }
}

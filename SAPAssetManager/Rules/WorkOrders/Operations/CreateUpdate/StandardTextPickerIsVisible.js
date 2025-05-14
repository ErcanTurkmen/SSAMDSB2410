import StandardTextKeyPickerItems from './StandardTextKeyPickerItems';

export default function StandardTextPickerIsVisible(context) {
    return StandardTextKeyPickerItems(context)
        .then(pickerItems => !!pickerItems.length);
}

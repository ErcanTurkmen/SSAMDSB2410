import { getMaterialListPickerConfig } from './MaterialListPickerEntitySet';

export default function MaterialListPickerQueryOptions(context) {
    return getMaterialListPickerConfig(context.binding || undefined).queryOptions;
}

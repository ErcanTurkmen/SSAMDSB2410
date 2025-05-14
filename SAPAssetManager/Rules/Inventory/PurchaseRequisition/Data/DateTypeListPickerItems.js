
export default function DateTypeListPickerItems(context) {
    return [
        {
            'ReturnValue': 'D',
            'DisplayValue': context.localizeText('day_format'),
        },
        {
            'ReturnValue': 'T',
            'DisplayValue': context.localizeText('day_format'),
        },
        {
            'ReturnValue': 'W',
            'DisplayValue': context.localizeText('week_format'),
        },
        {
            'ReturnValue': 'M',
            'DisplayValue': context.localizeText('month_format'),
        },
    ];
}

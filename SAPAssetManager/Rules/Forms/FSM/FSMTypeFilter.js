export default function FSMTypeFilter(context) {
    return { name: 'Mandatory',
            values: [{ReturnValue: 'true', DisplayValue: context.localizeText('mandatory')},
            {ReturnValue: 'false', DisplayValue: context.localizeText('optional')},
            ]};
}

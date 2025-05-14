export default function FSMStatusFilter(context) {
    return { name: 'Closed',
            values: [{ReturnValue: 'true', DisplayValue: context.localizeText('complete')},
            {ReturnValue: 'false', DisplayValue: context.localizeText('open')},
            ]};
}

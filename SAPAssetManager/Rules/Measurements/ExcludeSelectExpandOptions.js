export default function ExcludeSelectExpandOptions(query) {
    if (typeof query === 'string') {
        const optionsArray = query.split('&').filter(opt => !opt.includes('$expand') && !opt.includes('$select'));
        return optionsArray.length > 0 ? optionsArray.join('&') : '';
    }
    return query.filterOption.build();
}

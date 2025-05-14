/**
 * Return statuses filter
 * @returns 
 */
export default function FilterQueryOptions() {
    const status = ['OSNO', 'NOCO', 'NOPR', 'NOPO', 'OSTS', 'ORAS', 'APOK', 'APRQ'];
    const queryString = status.map(opt => `Status eq '${opt}'`).join(' or ');
    return `$filter=(${queryString})`;
}

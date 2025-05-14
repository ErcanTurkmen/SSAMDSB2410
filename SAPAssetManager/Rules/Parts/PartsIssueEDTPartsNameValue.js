
export default function PartsIssueEDTPartsNameValue(context) {
    return `${context?.binding?.ComponentDesc} (${context?.binding?.MaterialNum})`;
}


export default function MeterEDTPremiseQuery(context) {
    return `$filter=Premise eq '${context.binding.Premise}'`;
}

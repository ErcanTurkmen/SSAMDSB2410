export default function MeasuringPointValcodeIsVisible(context) {
    let binding = context.binding;

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        binding = binding.PRTPoint;
    }
    if (!binding.Point) {
        binding = binding.MeasuringPoint;
    }
    return !!binding.CodeGroup; //Valuation Code field should only be shown if a code group exists
}

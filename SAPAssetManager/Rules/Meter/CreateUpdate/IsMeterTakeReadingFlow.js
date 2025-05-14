
export default function IsMeterTakeReadingFlow(context) {
    return context.binding?.['@odata.type'] === '#sap_mobile.MeterReading';
}

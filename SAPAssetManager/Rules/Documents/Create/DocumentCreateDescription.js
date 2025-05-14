
export default function DocumentCreateDescription(context, encode = false) {
    if (context.getPageProxy().getControls().some(controls => controls.getName() === 'PDFExtensionControl')) {
        return 'Service Report';
    } else { 
        let description;
        try {
            description = context.getPageProxy().evaluateTargetPath('#Control:AttachmentDescription/#Value');
        } catch (err) {
            description = '-';
        }
        if (!description) {
            description = '-';
        }
        return encode ? encodeURIComponent(description) : description;
    }
}

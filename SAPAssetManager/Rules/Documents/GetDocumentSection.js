export default function GetDocumentSection(sections) {
    let documentSection;
    sections.forEach(function(key) {
        const name = key.getName();
        if (name === 'DocumentSection' || name === 'AttachmentSection') {
            documentSection = key;
        }
    });
    return documentSection;
}

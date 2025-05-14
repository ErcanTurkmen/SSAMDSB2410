export default function DocumentEditorAttachmentFileName(attachment) {
    let contentType = attachment.contentType.split('/');
    let mimeType = contentType[1];
    let fullFileName = attachment.urlStringWithFileName;
    if (!fullFileName) {
        fullFileName = attachment.urlString;
    }
    let fileName = fullFileName.split('/').pop();
    if (fileName.indexOf('.') < 0) {
        fileName = fileName + '.' + mimeType;
    }
    return fileName;
}

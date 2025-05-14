import fileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorSaveAsFileName(context) {
    const fileName = fileInfo(context).FileName;
    if (fileName) {
        const extension = fileName.split('.').pop();
        return fileName.substring(0, fileName.lastIndexOf(extension) - 1) + '_' +
            context.localizeText('copy');
    }
    return '';
}

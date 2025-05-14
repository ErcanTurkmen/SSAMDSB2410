import { ImageSource } from '@nativescript/core';
import getFileInfo from './DocumentEditorGetFileInfo';
import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorResizeNav(context) {
    const fileInfo = getFileInfo(context);
    const imgSrc = ImageSource.fromFileSync(fileInfo.Directory + fileInfo.FileName);
    libCom.setStateVariable(context, 'DocumentEditorOriginalImageSource', imgSrc);
    libCom.setStateVariable(context, 'DocumentEditorEstimatedImageSource', undefined);
    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorResizeNav.action');
}

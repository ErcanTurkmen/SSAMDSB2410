import { ImageSource } from '@nativescript/core';
import NativeScriptObject from '../Common/Library/NativeScriptObject';
import Logger from '../Log/Logger';
import getFileInfo from './DocumentEditorGetFileInfo';
import libCom from '../Common/Library/CommonLibrary';

/**
* Resize the image if max file size is set
* @param {IClientAPI} context
*/
export default function DocumentAutoResizeImage(context) {
    const fileInfo = getFileInfo(context);
    const fileExt = fileInfo.FileName.split('.').pop().toLowerCase();
    let fileSystemModule = NativeScriptObject.getNativeScriptObject(context).fileSystemModule;
    const filePath = fileSystemModule.path.join(fileInfo.Directory, fileInfo.FileName);
    let documentFileObject = fileSystemModule.File.fromPath(filePath);
    let fileSize = documentFileObject.size;

    let maxSize = libCom.getAppParam(context, 'IMAGE_EDITOR', 'MAX_IMAGE_SIZE');
    Logger.debug('IMAGE_EDITOR', 'Original fileSize - ' + fileSize + ' maxSize - ' + maxSize);

    // Binary method
    if (fileSize <= maxSize) {
        return Promise.resolve(true);
    }
    return new Promise(resolve => {
        const imgSrc = ImageSource.fromFileSync(fileInfo.Directory + fileInfo.FileName);
        const tempFilePath = fileInfo.Directory + fileInfo.FileName + '.tmp';
        let scaleStart = 0, scaleEnd = 100;
        let newImg, tempFile;
        // reduce the file size until its smaller than maxSize, break out in case of any errors
        while (scaleStart < scaleEnd) {
            const scaleMid = Math.trunc((scaleStart + (scaleEnd - scaleStart) / 2));
            newImg = imgSrc.resize(Math.max(imgSrc.width, imgSrc.height) * (scaleMid / 100), true);
            if (newImg && newImg.saveToFile(tempFilePath, fileExt)) {
                // create a temp file object so we can read its size.
                tempFile = fileSystemModule.File.fromPath(tempFilePath);
                Logger.debug('IMAGE_EDITOR', 'tempFile fileSize - ' + tempFile.size);
                if (tempFile.size > maxSize) {
                    scaleEnd = scaleMid;
                } else {
                    scaleStart = scaleMid + 1;
                }
            } else {
                Logger.error('IMAGE_EDITOR', 'newImg undefined');
                newImg = undefined;
                break;
            }
        }
        finalizeImage(newImg, imgSrc, tempFile, scaleStart, filePath, fileExt, fileSystemModule);
        resolve(true);
    });
}

function finalizeImage(newImg, imgSrc, tempFile, scaleStart, filePath, fileExt, fileSystemModule) {
    if (newImg) {
        newImg = imgSrc.resize(Math.max(imgSrc.width, imgSrc.height) * ((scaleStart - 1) / 100), true);
        if (newImg) {
            newImg.saveToFile(filePath, fileExt);
        }
    }
    if (tempFile) {
        tempFile.remove();
    }
    Logger.debug('IMAGE_EDITOR', 'final fileSize - ' + fileSystemModule.File.fromPath(filePath).size);
}

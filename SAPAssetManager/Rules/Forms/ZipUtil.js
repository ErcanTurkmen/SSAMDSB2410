/* eslint-disable no-undef */
import IsAndroid from '../Common/IsAndroid';
import IsWindows from '../Common/IsWindows';
import IsIOS from '../Common/IsIOS';

/* eslint-disable consistent-return */
const zip = (context, source, destination) => {

    if (IsAndroid(context)) {
        const zipFile = new net.lingala.zip4j.ZipFile(new java.io.File(destination));
        const parameters = new net.lingala.zip4j.model.ZipParameters();
        parameters.setCompressionMethod(
            net.lingala.zip4j.model.enums.CompressionMethod.DEFLATE,
        );
        parameters.setCompressionLevel(
            net.lingala.zip4j.model.enums.CompressionLevel.NORMAL,
        );
        parameters.setIncludeRootFolder(false);
        zipFile.addFolder(new java.io.File(source), parameters);
        /* eslint-disable consistent-return */
        return true;
    } 
    if (IsIOS(context)) {
      return SSZipArchive.createZipFileAtPathWithContentsOfDirectory(destination, source);
    }
    if (IsWindows(context)) {
      const options = {
        includeRootFolder: false,
        overwriteFiles: false,
      };
    return context.mdkWindows.zipModule.zip(
        source,
        destination,
        options,
      );
    }
};

const unzip = (context, source, destination) => {
    
    if (IsAndroid(context)) {
        const zipFile = new net.lingala.zip4j.ZipFile(source);
        if (zipFile.isValidZipFile()) zipFile.extractAll(destination);
        /* eslint-disable consistent-return */
        return true;
    } 
    if (IsIOS(context)) {
      return SSZipArchive.unzipFileAtPathToDestination(source, destination);
    }
    if (IsWindows(context)) {
      const options = {
        deleteSourceFile: true,
        overwriteFiles: true,
      };
    
      return context.mdkWindows.zipModule.unzip(
        source,
        destination,
        options,
      );
    }
};

export { zip, unzip };

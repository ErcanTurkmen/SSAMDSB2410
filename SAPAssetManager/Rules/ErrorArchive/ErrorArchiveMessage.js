import libVal from '../Common/Library/ValidationLibrary';
import libErr from './ErrorArchiveLibrary';

export default function ErrorArchiveMessage(context) {
    const binding = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], '$filter=RequestID eq ' + binding.RequestID).then(function(data) {
      if (!libVal.evalIsEmpty(data)) {
          try {
            const message = JSON.parse(JSON.stringify(data.getItem(0).Message).replace(/\\/g,'').slice(1, -1));
            return libErr.parseErrorTitle(message.error.message.value, message.error.message.value);
          } catch (e) {
            return libErr.parseErrorTitle(data.getItem(0).Message, data.getItem(0).Message);
          }
      }  
      return '-';
  });
}


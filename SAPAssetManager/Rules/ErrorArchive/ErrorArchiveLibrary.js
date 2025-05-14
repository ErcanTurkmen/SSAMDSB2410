import libVal from '../Common/Library/ValidationLibrary';

export default class ErrorArchiveLibrary {
    static parseErrorTitle(msg, defaultTitle) {
        if (!libVal.evalIsEmpty(msg)) {
            const messages = msg.split('=');
            if (messages && messages.length > 4) {
                // from tests we see the 4th split contains the main error.
                // Also remove the last word if there are more than 5 parts in the split. This is because the last word before =
                // is the key for the next value.
                if (messages.length > 5) {
                    const lastIndex = messages[4].trim().lastIndexOf(' ');
                    return messages[4].substring(0, lastIndex);
                } else {
                    return messages[4];
                }
            }
        }
        return defaultTitle;
    }
}

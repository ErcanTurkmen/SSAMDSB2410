import FormInstanceCount from './FormInstanceCount';
/**
 * 
 * @param {IClientAPI} context 
 * @returns {boolean}
 */
export default function FooterIsVisible(clientAPI) {
    const instanceCount = FormInstanceCount(clientAPI);

    return instanceCount.then((count) => {
        return count > 2;
    });
}

import getDocsData from './DocumentOnCreateGetStateVars';

export default function OnCreateGetDocDescription(pageProxy, encode = false) {
    const { DocDescription } = getDocsData(pageProxy);
    return encode ? encodeURIComponent(DocDescription) : DocDescription;
}

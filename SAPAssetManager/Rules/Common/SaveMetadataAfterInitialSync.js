import IsMetadataParsingFeatureEnabled from '../LCNC/IsMetadataParsingFeatureEnabled';
import { SaveMetadata } from '../LCNC/FetchMetadata';

export default function SaveMetadataAfterInitialSync(clientAPI) {
    if (IsMetadataParsingFeatureEnabled(clientAPI)) {
        SaveMetadata(clientAPI);
    }

    return Promise.resolve();
}

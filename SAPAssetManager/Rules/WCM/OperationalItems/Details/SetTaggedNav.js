import SetTaggedWithIsTaggableNav from './SetTaggedWithIsTaggableNav';

export default function SetTaggedNav(context) {
    return SetTaggedWithIsTaggableNav(context).then(() => {  // submitted
        return context.getPageProxy().executeCustomEvent('RedrawOperationalItemDetailsPage', true);
    }).catch(() => {  // canceled
        return Promise.resolve();
    });
}

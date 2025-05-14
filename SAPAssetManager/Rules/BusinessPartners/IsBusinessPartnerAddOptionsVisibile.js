import IsBusinessPartnerAddNoteVisibile from './IsBusinessPartnerAddNoteVisibile';
import IsBusinessPartnerAddOrderOrRequestVisibile from './IsBusinessPartnerAddOrderOrRequestVisibile';

export default function IsBusinessPartnerAddOptionsVisibile(context) {
    return Promise.all([
        IsBusinessPartnerAddOrderOrRequestVisibile(context), 
        IsBusinessPartnerAddNoteVisibile(context),
    ]).then(results => results.some(visible => visible));
}

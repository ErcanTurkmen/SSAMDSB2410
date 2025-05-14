import WorkPermitsCount from '../WorkPermits/WorkPermitsCount';
import OperationItemsCount from '../OperationalItems/OperationalItemsCount';
import LOTOCertificatesCount from '../SafetyCertificates/LOTOCertificatesCount';


export default function SeeAllIsVisible(context) {
    switch (context.getName()) {
        case 'OperationalItemsSection':
            return OperationItemsCount(context).then(count => {
                return 4 < count;  // global design requirement: hide the footer if there are only 4 or less elements
            });
        case 'CertificatesSection':
            return LOTOCertificatesCount(context).then(count => {
                return 4 < count;
            });
        case 'WorkPermitsSection':
            return WorkPermitsCount(context).then(count => {
                return 4 < count;
            });
        default:
            return true;
    }
}


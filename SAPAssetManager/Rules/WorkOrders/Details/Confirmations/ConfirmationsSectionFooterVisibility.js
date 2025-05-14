import ConfirmationsSectionCount from './ConfirmationsSectionCount';

export default async function ConfirmationsSectionFooterVisibility(context) {
    const confirmationsCount = await ConfirmationsSectionCount(context);
    return confirmationsCount > 2;
}

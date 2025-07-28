
export default function ZConfirmationFailure(context) {
    let result = context.getActionResult('confirmationissue').error;
    return Promise.resolve(true);
}

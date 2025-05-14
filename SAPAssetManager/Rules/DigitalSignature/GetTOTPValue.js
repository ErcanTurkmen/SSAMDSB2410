
export default function TOTPValue(context) {
    const totp = context.evaluateTargetPath('#Control:passcode/#Value');
    return Number(totp);
}

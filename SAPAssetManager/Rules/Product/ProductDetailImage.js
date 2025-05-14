import libPersona from '../Persona/PersonaLibrary';

export default function ProductDetailImage(context) {

    if (!libPersona.isClassicHomeScreenEnabled(context)) {
        return '$(PLT, /SAPAssetManager/Images/DetailImages/Product.png, /SAPAssetManager/Images/DetailImages/Product.android.png)';
    }

    return undefined;
}

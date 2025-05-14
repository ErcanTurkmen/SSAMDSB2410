import ApplicationSettings from '../Common/Library/ApplicationSettings';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import validationLibrary from '../Common/Library/ValidationLibrary';
import { MapAuthenticator } from 'extension-MapAuthenticator';
import IsIOS from '../Common/IsIOS';
import ODataLibrary from '../OData/ODataLibrary';

export default class EsriLibrary {

    static callESRIAuthenticate(clientAPI, action, isUserSwitch=false, applicationOnSync=false) {
        let portalURI = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/PortalURI.global').getValue(), '');
        let tokenExpirationInterval = ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/TokenExpirationInterval.global').getValue(), '');
        if (!this.isValidURL(portalURI)) {
            return EsriLibrary.showErrorMessage(clientAPI, clientAPI.localizeText('invalid_url', [portalURI])).then(() => {
                return this.runActions(clientAPI, action, 0);
            });
        }
        if (validationLibrary.evalIsEmpty(tokenExpirationInterval)) {
            tokenExpirationInterval = 10080;
        }
        let mapAuthenticatorInstance = MapAuthenticator.getInstance();
        if (!mapAuthenticatorInstance.isAuthRunning()) {
            if (IsIOS(clientAPI) ) {
                mapAuthenticatorInstance.create(null, 'Esri');
            }
            mapAuthenticatorInstance.runAuth(clientAPI,
                {
                    ClientID: ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/ClientID.global').getValue(), ''),
                    RedirectURL: ApplicationSettings.getString(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/RedirectURI.global').getValue(), ''),
                    PortalURI: portalURI,
                    RefreshTokenExpirationInterval: parseInt(tokenExpirationInterval),
                },
                async (context, isSuccess, errorMessage, jsonPayload) => {
                    if (isSuccess && !validationLibrary.evalIsEmpty(jsonPayload)) {
                        ApplicationSettings.setBoolean(context, 'IsEsriLoginCompleted', true);
                        ApplicationSettings.setBoolean(clientAPI, 'IsEsriLoginError', false);
                        const expirationDate = JSON.parse(jsonPayload).ExpirationDate.toString();
    
                        if (expirationDate !== ApplicationSettings.getString(context, 'EsriTokenExpirationTime', '')) {
                            ApplicationSettings.setString(context, 'EsriTokenExpirationTime', expirationDate);
                            if (isUserSwitch || applicationOnSync) {
                                context.showActivityIndicator(context.localizeText('update_esri_access_token_in_backend'));
                                await ODataLibrary.initializeOnlineService(context);
                                await context.executeAction({
                                    'Name': '/SAPAssetManager/Actions/ESRI/UpdateBackendWithESRIAccessToken.action', 'Properties': {
                                        'Target': {
                                            'Service': '/SAPAssetManager/Services/OnlineAssetManager.service',
                                            'Path': "/OauthTokens(ParameterGroup='NONE',ParameterName='ACCESS_TOKEN',RFCDestination='NONE')",
                                            'RequestProperties': {
                                                'Method': 'PATCH',
                                                'Body': {
                                                    'AccessToken': JSON.parse(jsonPayload).AccessToken,
                                                    'RefreshToken': JSON.parse(jsonPayload).RefreshToken,
                                                },
                                                'Headers': {
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                            },
                                        },
                                    },
                                });
                            }
                            if (applicationOnSync && !CommonLibrary.isInitialSync(context)) {
                                await context.executeAction('/SAPAssetManager/Actions/ESRI/UpdateBackendWithSyncRequests.action');
                            }
                            context.dismissActivityIndicator();
                        }
                    } else if (!validationLibrary.evalIsEmpty(errorMessage)) {
                        ApplicationSettings.setBoolean(context, 'IsEsriLoginError', true);
                    }
                    return this.runActions(clientAPI, action, 0, isUserSwitch);
                }).catch(function(err) {
                    Logger.error(`ESRIUserLogin - Post process failed : ${err}`);
                    return Promise.resolve(false);
                });
        }
        return Promise.resolve(true); 
    }

    static isESRILoginCompleted(clientAPI) {
        return ApplicationSettings.getBoolean(clientAPI, 'IsEsriLoginCompleted', false);
    }

    static isESRILoginHasError(clientAPI) {
        return ApplicationSettings.getBoolean(clientAPI, 'IsEsriLoginError', false);
    }

    static async showErrorMessage(clientAPI, error) {
        await clientAPI.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
            'Properties': {
                'Title': clientAPI.localizeText('error'),
                'Message': error,
                'OKCaption': clientAPI.localizeText('ok'),
            },
        });
    }

    static isValidURL(url) {
        let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[\\/:;&a-z\\d%_.~+=-]*)?$','i'); // query string
        return !!pattern.test(url);
    }

    static ClearESRIAccessFlags(clientAPI) {
        MapAuthenticator.getInstance().destroy();
        ApplicationSettings.remove(clientAPI, 'IsEsriLoginCompleted');
        ApplicationSettings.remove(clientAPI, 'IsEsriLoginError');
        ApplicationSettings.remove(clientAPI, 'EsriTokenExpirationTime');
    }

    static runActions(clientAPI, action, index, isUserSwitch) {
        if (action instanceof Array) {
            return clientAPI.executeAction(action[index]).then(() => {
                if (index === action.length - 1) {
                    return true;
                }
                index = index + 1;
                return this.runActions(clientAPI, action, index);
            }).catch(function() {
                return false;
            });
        }
        if (isUserSwitch) {
            clientAPI.showActivityIndicator(clientAPI.localizeText('download_progress'));
            return clientAPI.executeAction(action).finally(() => {
                clientAPI.dismissActivityIndicator();
            });
        }
        return clientAPI.executeAction(action);
    }
}

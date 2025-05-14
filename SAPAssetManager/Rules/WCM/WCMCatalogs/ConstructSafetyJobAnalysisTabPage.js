import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ConstructSafetyJobAnalysisTabPage(context) {
    const wcmCatalogProfileName = CommonLibrary.getWCMCatalogProfileName(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogProfiles', [], `$filter=CatalogProfile eq '${wcmCatalogProfileName}'&$top=2`).then(profiles => {
        return profiles.map(profile => {
            return {
                '_Name': `${profile.Catalog}_tab`,
                'Caption': profile.Description,
                'PageMetadata': CreateCatalogPage(profile.Description, profile.CodeGroup, `${profile.Catalog}_page`),
                '_Type': 'Control.Type.TabItem',
            };
        });
    });
}

function CreateCatalogPage(caption, codeGroup, pageName) {
    return {
        'Caption': caption,
        'Controls': [
            {
                'Sections': [
                    {
                        'EmptySection': {
                            'Caption': '$(L, no_items_in_catalog)',
                        },
                        'ObjectCell': {
                            'AccessoryType': 'detailButton',
                            'DetailImageIsCircular': false,
                            'OnAccessoryButtonPress': '/SAPAssetManager/Actions/WCM/WCMCatalogs/CatalogDetailsNav.action',
                            'PreserveIconStackSpacing': false,
                            'Title': '{PMCatalogCode/CodeDescription}',
                        },
                        'Search': {
                            'Enabled': true,
                            'MinimumCharacterThreshold': 3,
                            'Placeholder': '$(L,search)',
                        },
                        'Target': {
                            'EntitySet': '{{#Property:@odata.readLink}}/WCMCatalogs',
                            'QueryOptions': `$filter=CodeGroup eq '${codeGroup}'&$expand=PMCatalogCode`,
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                        '_Name': 'SectionObjectTable',
                        '_Type': 'Section.Type.ObjectTable',
                    },
                ],
                '_Name': 'SectionedTable',
                '_Type': 'Control.Type.SectionedTable',
            },
        ],
        '_Name': pageName,
        '_Type': 'Page',
    };
}

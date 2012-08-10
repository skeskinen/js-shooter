var profile = {
    defaultConfig: {
        async: 1,
        tlmSiblingOfDojo: 1
    }
    releaseDir:'../../public/build',
    action:'release',

    layers: {
        "dojo/dojo": {
            include: [ "dojo/dojo", "shooter/main" ],
            customBase: true,
            boot: true
        }
    },


    mini: true,
    optimize: 'closure',
    layerOptimize: 'closure',
    stripConsole: 'all',
    cssOptimize:'comments',



    resourceTags: {
        amd: function (filename, mid) {
            return /\.js$/.test(filename);
        }
    }
};

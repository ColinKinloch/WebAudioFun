/*global require*/
/*jslint bitwise: true */
'use strict';

var threeShim = {
  exports: 'THREE',
  deps: ['THREE']
};

requirejs.config({
  baseUrl: 'scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery',
    'bootstrap': '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
    'text': '../bower_components/requirejs-text/text',
    'stats': '../bower_components/stats.js/build/stats.min',
    'THREE': '../lib/three.js/build/three',
    'THREEex': '../lib/three.js/examples/js/',
    'dat-GUI': '../bower_components/dat-gui/build/dat.gui',
    'glTF': '../bower_components/glTF/loaders/',
    'CANNON': '../bower_components/cannon.js/build/cannon'
  },
  shim: {
    bootstrap: ['jquery'],
    stats: {
      exports: 'Stats'
    },
    THREE: {
      exports: 'THREE'
    },
    'THREEex/renderers/WebGLDeferredRenderer':
    {
      exports: 'THREE',
      deps: ['THREE',
        'THREEex/ShaderDeferred',
        'THREEex/postprocessing/RenderPass',
        'THREEex/postprocessing/EffectComposer',
        'THREEex/shaders/FXAAShader',
        'THREEex/postprocessing/MaskPass']
    },
    'THREEex/ShaderDeferred':threeShim,
    'THREEex/postprocessing/RenderPass':threeShim,
    'THREEex/postprocessing/EffectComposer':
    {
      exports: 'THREE',
      deps: ['THREE',
        'THREEex/shaders/CopyShader',
        'THREEex/postprocessing/ShaderPass']
    },
    'THREEex/shaders/CopyShader':threeShim,
    'THREEex/postprocessing/ShaderPass':threeShim,
    'THREEex/shaders/FXAAShader':threeShim,
    'THREEex/postprocessing/MaskPass':threeShim,
    CANNON: {
      exports: 'CANNON'
    },
    'dat-GUI': {
      exports: 'dat'
    },
    'glTF/threejs/glTFLoaderUtils': {
      exports: 'THREE.glTFLoaderUtils'
    },
    'glTF/threejs/glTFAnimation': {
      exports: 'THREE'
    },
    'glTF/threejs/glTFLoader': {
      exports: 'THREE.glTFLoader',
      deps: [
        'THREE',
        'glTF/glTF-parser',
        'glTF/threejs/glTFLoaderUtils',
        'glTF/threejs/glTFAnimation'
      ]
    }
  }
});

requirejs(['main']);

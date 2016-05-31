// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  DocumentRegistry, ImageWidgetFactory
} from 'jupyter-js-ui/lib/docmanager';

import {
  Application
} from 'phosphide/lib/core/application';


/**
 * The list of file extensions for images.
 */
const EXTENSIONS = ['.png', '.gif', '.jpeg', '.jpg', '.svg', '.bmp', '.ico',
  '.xbm', '.tiff', '.tif'];


/**
 * The image file handler extension.
 */
export
const imageHandlerExtension = {
  id: 'jupyter.extensions.imageHandler',
  requires: [DocumentRegistry],
  activate: (app: Application, registry: DocumentRegistry) => {
    registry.registerWidgetFactory(new ImageWidgetFactory(),
    {
      fileExtensions: EXTENSIONS,
      displayName: 'Image',
      modelName: 'base64',
      defaultFor: EXTENSIONS,
      preferKernel: false,
      canStartKernel: false
    });
  }
};

// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  DocumentRegistry, EditorWidgetFactory
} from 'jupyter-js-ui/lib/docmanager';

import {
  Application
} from 'phosphide/lib/core/application';


/**
 * The editor handler extension.
 */
export
const editorHandlerExtension = {
  id: 'jupyter.extensions.editorHandler',
  requires: [DocumentRegistry],
  activate: (app: Application, registry: DocumentRegistry) => {
    registry.registerWidgetFactory(new EditorWidgetFactory(),
    {
      fileExtensions: ['.*'],
      displayName: 'Editor',
      modelName: 'text',
      defaultFor: ['.*'],
      preferKernel: false,
      canStartKernel: false
    });
  }
};

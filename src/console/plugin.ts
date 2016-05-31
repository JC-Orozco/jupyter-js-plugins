// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  ConsolePanel
} from 'jupyter-js-notebook/lib/console';

import {
  RenderMime
} from 'jupyter-js-ui/lib/rendermime';

import {
  Application
} from 'phosphide/lib/core/application';

import {
  Widget
} from 'phosphor-widget';

import {
  JupyterServices
} from '../services/plugin';


/**
 * The console extension.
 */
export
const consoleExtension = {
  id: 'jupyter.extensions.console',
  requires: [JupyterServices, RenderMime],
  activate: activateConsole
};


/**
 * Activate the console extension.
 */
function activateConsole(app: Application, services: JupyterServices, rendermime: RenderMime<Widget>): Promise<void> {

  let manager = services.notebookSessionManager;

  // Add the ability to create new consoles for each kernel.
  let specs = services.kernelspecs;
  let displayNameMap: { [key: string]: string } = Object.create(null);
  for (let kernelName in specs.kernelspecs) {
    let displayName = specs.kernelspecs[kernelName].spec.display_name;
    displayNameMap[displayName] = kernelName;
  }
  let displayNames = Object.keys(displayNameMap).sort((a, b) => {
    return a.localeCompare(b);
  });
  let count = 0;
  for (let displayName of displayNames) {
    let id = `console:create-${displayNameMap[displayName]}`;
    app.commands.add([{
      id,
      handler: () => {
        manager.startNew({
          notebookPath: `Console-${count++}`,
          kernelName: `${displayNameMap[displayName]}`
        }).then(session => {
          let console = new ConsolePanel(session, rendermime.clone());
          app.shell.addToMainArea(console);
          console.disposed.connect(() => {
            let index = Private.widgets.indexOf(console);
            Private.widgets.splice(index, 1);
            if (Private.activeWidget === console) {
              Private.activeWidget = null;
            }
          });
        });
      }
    }]);
    app.palette.add([{
      command: id,
      category: 'Console',
      text: `New ${displayName}`
    }]);
  }

  // Temporary console focus follower.
  document.body.addEventListener('focus', event => {
    for (let widget of Private.widgets) {
      let target = event.target as HTMLElement;
      if (widget.isAttached && widget.isVisible) {
        if (widget.node.contains(target)) {
          Private.activeWidget = widget;
          return;
        }
      }
    }
  }, true);

  app.commands.add([
  {
    id: 'console:clear',
    handler: () => {
      if (Private.activeWidget) {
        Private.activeWidget.content.clear();
      }
    }
  },
  {
    id: 'console:execute',
    handler: () => {
      if (Private.activeWidget) {
        Private.activeWidget.content.execute();
      }
    }
  }
  ]);
  app.palette.add([
  {
    command: 'console:clear',
    category: 'Console',
    text: 'Clear'
  },
  {
    command: 'console:execute',
    category: 'Console',
    text: 'Execute'
  }]);

  return Promise.resolve(void 0);
}


/**
 * A namespace for private data.
 */
namespace Private {
  export
  var widgets: ConsolePanel[] = [];

  export
  var activeWidget: ConsolePanel = null;
}

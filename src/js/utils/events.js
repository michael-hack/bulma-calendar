export default class EventEmitter {
  constructor(listeners = []) {
    this._listeners = new Map(listeners);
    this._middlewares = new Map();
  }

  listenerCount(eventName) {
    if (!this._listeners.has(eventName)) {
      return 0;
    }

    const eventListeners = this._listeners.get(eventName);
    return eventListeners.length;
  }

  removeListeners(eventName = null, middleware = false) {
    if (eventName !== null) {
      if (Array.isArray(eventName)) {
        name.forEach(e => this.removeListeners(e, middleware));
      } else {
        this._listeners.delete(eventName);

        if (middleware) {
          this.removeMiddleware(eventName);
        }
      }
    } else {
      this._listeners = new Map();
    }
  }

  middleware(eventName, fn) {
    if (Array.isArray(eventName)) {
      name.forEach(e => this.middleware(e, fn));
    } else {
      if (!Array.isArray(this._middlewares.get(eventName))) {
        this._middlewares.set(eventName, []);
      }

      (this._middlewares.get(eventName)).push(fn);
    }
  }

  removeMiddleware(eventName = null) {
    if (eventName !== null) {
      if (Array.isArray(eventName)) {
        name.forEach(e => this.removeMiddleware(e));
      } else {
        this._middlewares.delete(eventName);
      }
    } else {
      this._middlewares = new Map();
    }
  }

  on(name, callback, once = false) {
    if (Array.isArray(name)) {
      name.forEach(e => this.on(e, callback));
    } else {
      name = name.toString();
      const split = name.split(/,|, | /);

      if (split.length > 1) {
        split.forEach(e => this.on(e, callback));
      } else {
        if (!Array.isArray(this._listeners.get(name))) {
          this._listeners.set(name, []);
        }

        (this._listeners.get(name)).push({
          once: once,
          callback: callback
        });
      }
    }
  }

  once(name, callback) {
    this.on(name, callback, true);
  }

  emit(name, data, silent = false) {
    name = name.toString();
    let listeners = this._listeners.get(name);
    let middlewares = null;
    let doneCount = 0;
    let execute = silent;

    if (Array.isArray(listeners)) {
      listeners.forEach((listener, index) => {
        // Start Middleware checks unless we're doing a silent emit
        if (!silent) {
          middlewares = this._middlewares.get(name);
          // Check and execute Middleware
          if (Array.isArray(middlewares)) {
            middlewares.forEach(middleware => {
              middleware(data, (newData = null) => {
                if (newData !== null) {
                  data = newData;
                }
                doneCount++;
              }, name);
            });

            if (doneCount >= middlewares.length) {
              execute = true;
            }
          } else {
            execute = true;
          }
        }

        // If Middleware checks have been passed, execute
        if (execute) {
          if (listener.once) {
            listeners[index] = null;
          }
          listener.callback({
            type: name,
            timeStamp: (new Date()).getTime(),
            data: data
          });
        }
      });

      // Dirty way of removing used Events
      while (listeners.indexOf(null) !== -1) {
        listeners.splice(listeners.indexOf(null), 1);
      }
    }
  }
}
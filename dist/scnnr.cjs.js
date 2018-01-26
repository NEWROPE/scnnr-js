'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));

var defaults = {
  url: 'https://api.scnnr.cubki.jp/',
  version: 'v1',
  timeout: null,
  apiKey: null
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Connection = function () {
  function Connection(_ref) {
    var url = _ref.url,
        apiKey = _ref.apiKey,
        params = _ref.params,
        onUploadProgress = _ref.onUploadProgress,
        onDownloadProgress = _ref.onDownloadProgress;
    classCallCheck(this, Connection);

    var headers = {};
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    this.httpClient = axios.create({
      params: params, headers: headers,
      baseURL: url,
      onUploadProgress: onUploadProgress,
      onDownloadProgress: onDownloadProgress
    });
  }

  createClass(Connection, [{
    key: 'get',
    value: function get$$1(path) {
      return this.httpClient.get(path, null);
    }
  }, {
    key: 'sendJson',
    value: function sendJson(path, data) {
      return this.send(path, data, 'application/json');
    }
  }, {
    key: 'sendBinary',
    value: function sendBinary(path, data) {
      return this.send(path, data, 'application/octet-stream');
    }
  }, {
    key: 'send',
    value: function send(path, data, contentType) {
      return this.httpClient.post(path, data, { headers: { 'Content-Type': contentType } });
    }
  }]);
  return Connection;
}();

var Item = function Item(props) {
  classCallCheck(this, Item);

  this.category = props.category;
  this.boundingBox = props.boundingBox || props.bounding_box;
  this.labels = props.labels;
};

var Size = function Size(_ref) {
  var width = _ref.width,
      height = _ref.height;
  classCallCheck(this, Size);

  this.width = width;
  this.height = height;
};

var Image = function Image(_ref) {
  var url = _ref.url,
      size = _ref.size;
  classCallCheck(this, Image);

  this.url = url;
  this.size = new Size(size);
};

Image.Size = Size;

var Recognition = function () {
  function Recognition(_ref) {
    var id = _ref.id,
        objects = _ref.objects,
        state = _ref.state,
        image = _ref.image,
        error = _ref.error;
    classCallCheck(this, Recognition);

    this.id = id;
    this.objects = (objects || []).map(function (obj) {
      return new Item(obj);
    });
    this.state = state;
    if (image != null) {
      this.image = new Image(image);
    }
    this.error = error;
  }

  createClass(Recognition, [{
    key: 'isFinished',
    value: function isFinished() {
      return this.state === 'finished';
    }
  }]);
  return Recognition;
}();

Recognition.Item = Item;
Recognition.Image = Image;

var PreconditionFailed = function (_Error) {
  inherits(PreconditionFailed, _Error);

  function PreconditionFailed(message) {
    classCallCheck(this, PreconditionFailed);

    var _this = possibleConstructorReturn(this, (PreconditionFailed.__proto__ || Object.getPrototypeOf(PreconditionFailed)).call(this, message));

    _this.name = 'PreconditionFailed';
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_this, PreconditionFailed);
    } else {
      _this.stack = new Error().stack;
    }
    return _this;
  }

  return PreconditionFailed;
}(Error);

var PollTimeout = function (_Error2) {
  inherits(PollTimeout, _Error2);

  function PollTimeout(message) {
    classCallCheck(this, PollTimeout);

    var _this2 = possibleConstructorReturn(this, (PollTimeout.__proto__ || Object.getPrototypeOf(PollTimeout)).call(this, message));

    _this2.name = 'PollTimeout';
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_this2, PollTimeout);
    } else {
      _this2.stack = new Error().stack;
    }
    return _this2;
  }

  return PollTimeout;
}(Error);



var errors = Object.freeze({
	PreconditionFailed: PreconditionFailed,
	PollTimeout: PollTimeout
});

function sanitizeAPIKey(key) {
  if (typeof key !== 'string') {
    return null;
  }
  key = key.replace(/^\s*/, '').replace(/\s*$/, '');
  return key === '' ? null : key;
}

var Client = function () {
  function Client(config) {
    classCallCheck(this, Client);

    this.config = Object.assign({}, defaults, config);
  }

  createClass(Client, [{
    key: 'recognizeURL',
    value: function recognizeURL(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var request = this.connection(true, options).sendJson('/remote/recognitions', { url: url }).then(this.handleResponse);

      return this.pollingRecognize(request, options.timeout);
    }
  }, {
    key: 'recognizeImage',
    value: function recognizeImage(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var params = { public: options.public };
      var fullOptions = Object.assign({}, options, { params: params });

      var request = this.connection(true, fullOptions).sendBinary('/recognitions', data).then(this.handleResponse);

      return this.pollingRecognize(request, fullOptions.timeout);
    }

    // Takes a request and timeout and checks if the recognize request
    // should start the polling process and calls poll if positive

  }, {
    key: 'pollingRecognize',
    value: function pollingRecognize(request, timeout) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        request.then(function (recognition) {
          if (timeout > 0 && !recognition.isFinished()) {
            return _this.poll(recognition.id, timeout, resolve, reject);
          }

          return resolve(recognition);
        }).catch(reject);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.connection(false, options).get('/recognitions/' + id).then(this.handleResponse);
    }

    // poll calls itself until recognition is finished or time expires

  }, {
    key: 'poll',
    value: function poll(id, remainingTime, resolve, reject) {
      var _this2 = this;

      var startPollTimeout = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;

      var startTime = new Date().getTime();

      this.fetch(id).then(function (recognition) {
        if (!recognition.isFinished()) {
          var elapsedTime = (new Date().getTime() - startTime) / 1000; // Divide to convert to seconds
          var newRemainingTime = remainingTime - elapsedTime;

          if (newRemainingTime <= 0) {
            return reject(new PollTimeout('Polling for ' + id + ' timed out'));
          }

          // See if next polling is going to be over remaining timeout time
          // if it is just use the remaining time for the next call to poll
          var isNextPollingOverTimeout = newRemainingTime - startPollTimeout / 1000 <= 0;
          var pollTimeout = isNextPollingOverTimeout ? newRemainingTime * 1000 : startPollTimeout;

          return setTimeout(function () {
            return _this2.poll.call(_this2, id, newRemainingTime, resolve, reject, startPollTimeout * 1.5);
          }, pollTimeout);
        }

        return resolve(recognition);
      }).catch(reject);
    }
  }, {
    key: 'handleResponse',
    value: function handleResponse(response) {
      return new Recognition(response.data);
    }
  }, {
    key: 'connection',
    value: function connection(useAPIKey, options) {
      return new Connection(this.connectionConfig(useAPIKey, options));
    }
  }, {
    key: 'connectionConfig',
    value: function connectionConfig(useAPIKey, options) {
      var config = Object.assign({}, this.config, options);
      var apiKey = sanitizeAPIKey(config.apiKey);
      if (useAPIKey && apiKey == null) {
        throw new PreconditionFailed('`apiKey` configuration is required.');
      }
      var params = options.params || {};
      if ((config.timeout || 0) > 0) {
        params.timeout = config.timeout;
      }
      return {
        apiKey: apiKey, params: params,
        url: config.url + config.version,
        onUploadProgress: config.onUploadProgress,
        onDownloadProgress: config.onDownloadProgress
      };
    }
  }]);
  return Client;
}();

function client(options) {
  return new Client(options);
}

var index = Object.assign(client, {
  Client: Client,
  Connection: Connection,
  Recognition: Recognition
}, errors);

module.exports = index;

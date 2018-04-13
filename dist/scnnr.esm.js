import axios from 'axios';

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

var ScnnrError = function (_Error) {
  inherits(ScnnrError, _Error);

  function ScnnrError(message) {
    classCallCheck(this, ScnnrError);

    var _this = possibleConstructorReturn(this, (ScnnrError.__proto__ || Object.getPrototypeOf(ScnnrError)).call(this, message));

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_this, ScnnrError);
    } else {
      _this.stack = new Error().stack;
    }
    return _this;
  }

  return ScnnrError;
}(Error);

var PollTimeout = function (_ScnnrError) {
  inherits(PollTimeout, _ScnnrError);

  function PollTimeout(message) {
    classCallCheck(this, PollTimeout);

    var _this2 = possibleConstructorReturn(this, (PollTimeout.__proto__ || Object.getPrototypeOf(PollTimeout)).call(this, message));

    _this2.name = 'PollTimeout';
    return _this2;
  }

  return PollTimeout;
}(ScnnrError);

var PreconditionFailed = function (_ScnnrError2) {
  inherits(PreconditionFailed, _ScnnrError2);

  function PreconditionFailed(message) {
    classCallCheck(this, PreconditionFailed);

    var _this3 = possibleConstructorReturn(this, (PreconditionFailed.__proto__ || Object.getPrototypeOf(PreconditionFailed)).call(this, message));

    _this3.name = 'PreconditionFailed';
    return _this3;
  }

  return PreconditionFailed;
}(ScnnrError);

function buildMessage(title, detail, type) {
  var message = '';

  if (title) message = '[' + title + ']';
  if (detail) message = message + ' ' + detail;
  if (type) message = message + ' (' + type + ')';

  return message;
}

var ScnnrAPIError = function (_ScnnrError3) {
  inherits(ScnnrAPIError, _ScnnrError3);

  function ScnnrAPIError(_ref) {
    var title = _ref.title,
        detail = _ref.detail,
        type = _ref.type,
        statusCode = _ref.statusCode,
        rawResponse = _ref.rawResponse;
    classCallCheck(this, ScnnrAPIError);

    var message = buildMessage(title, detail, type);

    var _this4 = possibleConstructorReturn(this, (ScnnrAPIError.__proto__ || Object.getPrototypeOf(ScnnrAPIError)).call(this, message));

    _this4.name = 'ScnnrAPIError';
    Object.assign(_this4, { title: title, detail: detail, type: type, statusCode: statusCode, rawResponse: rawResponse });
    return _this4;
  }

  return ScnnrAPIError;
}(ScnnrError);



var errors = Object.freeze({
	ScnnrError: ScnnrError,
	PollTimeout: PollTimeout,
	PreconditionFailed: PreconditionFailed,
	ScnnrAPIError: ScnnrAPIError
});

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

    this.httpClient.interceptors.response.use(function (response) {
      return response;
    }, this.errorInterceptor);
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
  }, {
    key: 'errorInterceptor',
    value: function errorInterceptor(err) {
      // If err does not have response, is not an HTTP error. Reject normally
      if (!err.response) return Promise.reject(err);

      return Promise.reject(new ScnnrAPIError({
        title: err.response.data.title || err.response.data.message,
        // In case the error is unkown and does not contain
        // details, use the original error message
        detail: err.response.data.detail || err.message,
        type: err.response.data.type,
        rawResponse: err.response.data,
        statusCode: err.response.status
      }));
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

function poll(config) {
  var _this = this;

  var requestFunc = config.requestFunc,
      conditionChecker = config.conditionChecker,
      remainingTime = config.remainingTime,
      resolve = config.resolve,
      reject = config.reject;

  var timeout = (remainingTime || 0) - 25 < 0 ? remainingTime : 25;

  if (remainingTime <= 0) {
    return reject(new PollTimeout('Polling timed out'));
  }

  requestFunc({ timeout: timeout }).then(function (result) {
    if (conditionChecker(result)) return resolve(result);

    var newRemainingTime = remainingTime - timeout;

    var newConfig = {
      requestFunc: requestFunc,
      conditionChecker: conditionChecker,
      remainingTime: newRemainingTime,
      resolve: resolve,
      reject: reject
    };

    return setTimeout(function () {
      return poll.call(_this, newConfig);
    }, timeout);
  }).catch(reject);
}

function sanitizeAPIKey(key) {
  if (typeof key !== 'string') {
    return null;
  }
  key = key.replace(/^\s*/, '').replace(/\s*$/, '');
  return key === '' ? null : key;
}

function getTimeoutLength() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var timeoutMaxAllowed = arguments[1];

  return timeout - timeoutMaxAllowed < 0 ? timeout : timeoutMaxAllowed;
}

var Client = function () {
  function Client(config) {
    classCallCheck(this, Client);

    this.config = Object.assign({}, defaults, config);
  }

  createClass(Client, [{
    key: 'recognizeURL',
    value: function recognizeURL(url) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.recognizeRequest(function (options) {
        return _this.connection(true, options).sendJson('/remote/recognitions', { url: url });
      }, options);
    }
  }, {
    key: 'recognizeImage',
    value: function recognizeImage(data) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var params = { public: options.public };
      var fullOptions = Object.assign({}, options, { params: params });

      return this.recognizeRequest(function (options) {
        return _this2.connection(true, options).sendBinary('/recognitions', data);
      }, fullOptions);
    }

    // Takes a request and timeout and checks if the recognize request
    // should start the polling process and calls poll if positive

  }, {
    key: 'recognizeRequest',
    value: function recognizeRequest(requestFunc, options) {
      var _this3 = this;

      if (options.timeout > 100) {
        throw new ScnnrError('Timeout time greater than 100 not allowed');
      }

      var timeoutForFirstRequest = getTimeoutLength(options.timeout, 25);
      var opt = Object.assign({}, options, { timeout: timeoutForFirstRequest });
      var request = requestFunc(opt);

      return new Promise(function (resolve, reject) {
        request.then(_this3.handleResponse).then(function (recognition) {
          if ((options.timeout || 0) > 0 && !recognition.isFinished()) {
            return poll({
              requestFunc: function requestFunc(options) {
                return _this3.fetch(recognition.id, options);
              },
              conditionChecker: function conditionChecker(recognition) {
                return recognition.isFinished();
              },
              remainingTime: options.timeout - timeoutForFirstRequest,
              resolve: resolve,
              reject: reject
            });
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

export default index;

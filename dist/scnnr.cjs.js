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

var ScnnrError = function (_Error) {
  inherits(ScnnrError, _Error);

  function ScnnrError(message) {
    classCallCheck(this, ScnnrError);

    var _this = possibleConstructorReturn(this, (ScnnrError.__proto__ || Object.getPrototypeOf(ScnnrError)).call(this, message));

    _this[Symbol.toStringTag] = 'scnnr-error';
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_this, ScnnrError);
    } else {
      _this.stack = new Error().stack;
    }
    return _this;
  }

  return ScnnrError;
}(Error);

var PreconditionFailed = function (_ScnnrError) {
  inherits(PreconditionFailed, _ScnnrError);

  function PreconditionFailed(message) {
    classCallCheck(this, PreconditionFailed);

    var _this2 = possibleConstructorReturn(this, (PreconditionFailed.__proto__ || Object.getPrototypeOf(PreconditionFailed)).call(this, message));

    _this2.name = 'PreconditionFailed';
    return _this2;
  }

  return PreconditionFailed;
}(ScnnrError);

var ScnnrAPIError = function (_ScnnrError2) {
  inherits(ScnnrAPIError, _ScnnrError2);

  function ScnnrAPIError(_ref) {
    var title = _ref.title,
        message = _ref.message,
        statusCode = _ref.statusCode,
        rawResponse = _ref.rawResponse;
    classCallCheck(this, ScnnrAPIError);

    var _this3 = possibleConstructorReturn(this, (ScnnrAPIError.__proto__ || Object.getPrototypeOf(ScnnrAPIError)).call(this, message));

    _this3[Symbol.toStringTag] = 'scnnr-api-error';
    _this3.name = (title || 'ScnnrAPIError').replace(/ /g, '');
    _this3.statusCode = statusCode;
    _this3.rawResponse = rawResponse;
    return _this3;
  }

  return ScnnrAPIError;
}(ScnnrError);

var ForbiddenError = function (_ScnnrAPIError) {
  inherits(ForbiddenError, _ScnnrAPIError);

  function ForbiddenError(_ref2) {
    var rawResponse = _ref2.rawResponse;
    classCallCheck(this, ForbiddenError);

    var message = 'You don\'t have access to this resource';
    return possibleConstructorReturn(this, (ForbiddenError.__proto__ || Object.getPrototypeOf(ForbiddenError)).call(this, { title: 'Forbidden', message: message, rawResponse: rawResponse, statusCode: 403 }));
  }

  return ForbiddenError;
}(ScnnrAPIError);

var TooManyRequestsError = function (_ScnnrAPIError2) {
  inherits(TooManyRequestsError, _ScnnrAPIError2);

  function TooManyRequestsError(_ref3) {
    var rawResponse = _ref3.rawResponse;
    classCallCheck(this, TooManyRequestsError);

    var message = 'Exceeded request quota';
    return possibleConstructorReturn(this, (TooManyRequestsError.__proto__ || Object.getPrototypeOf(TooManyRequestsError)).call(this, { title: 'TooManyRequests', message: message, rawResponse: rawResponse, statusCode: 429 }));
  }

  return TooManyRequestsError;
}(ScnnrAPIError);

var httpErrorsByCode = {
  '403': ForbiddenError,
  '429': TooManyRequestsError
};

function getErrorByStatusCode(statusCode) {
  return httpErrorsByCode[statusCode] || ScnnrAPIError;
}



var errors = Object.freeze({
	ScnnrError: ScnnrError,
	PreconditionFailed: PreconditionFailed,
	ScnnrAPIError: ScnnrAPIError,
	ForbiddenError: ForbiddenError,
	TooManyRequestsError: TooManyRequestsError,
	getErrorByStatusCode: getErrorByStatusCode
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
      var statusCode = err.response ? err.response.status : 500;
      var errorType = getErrorByStatusCode(statusCode);

      return Promise.reject(new errorType({
        title: err.response.data.title,
        // In case the error is unkown and does not contain
        // details, use the original error message
        message: err.response.data.detail || err.message,
        rawResponse: err.response.data,
        statusCode: statusCode
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

var Recognition = function Recognition(_ref) {
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
};

Recognition.Item = Item;
Recognition.Image = Image;

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

      return this.connection(true, options).sendJson('/remote/recognitions', { url: url }).then(this.handleResponse);
    }
  }, {
    key: 'recognizeImage',
    value: function recognizeImage(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var params = {};
      if (options.public) {
        params.public = true;
      }
      return this.connection(true, Object.assign({}, options, { params: params })).sendBinary('/recognitions', data).then(this.handleResponse);
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

module.exports = index;

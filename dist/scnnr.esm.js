import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import axios from 'axios';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _wrapNativeSuper from '@babel/runtime/helpers/wrapNativeSuper';

var defaults = {
  url: 'https://api.scnnr.cubki.jp/',
  version: 'v1',
  timeout: null,
  apiKey: null
};

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ScnnrError = /*#__PURE__*/function (_Error) {
  _inherits(ScnnrError, _Error);

  var _super = _createSuper(ScnnrError);

  function ScnnrError(message) {
    var _this;

    _classCallCheck(this, ScnnrError);

    _this = _super.call(this, message);

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_assertThisInitialized(_this), ScnnrError);
    } else {
      _this.stack = new Error().stack;
    }

    return _this;
  }

  return ScnnrError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var PollTimeout = /*#__PURE__*/function (_ScnnrError) {
  _inherits(PollTimeout, _ScnnrError);

  var _super2 = _createSuper(PollTimeout);

  function PollTimeout(message) {
    var _this2;

    _classCallCheck(this, PollTimeout);

    _this2 = _super2.call(this, message);
    _this2.name = 'PollTimeout';
    return _this2;
  }

  return PollTimeout;
}(ScnnrError);
var PreconditionFailed = /*#__PURE__*/function (_ScnnrError2) {
  _inherits(PreconditionFailed, _ScnnrError2);

  var _super3 = _createSuper(PreconditionFailed);

  function PreconditionFailed(message) {
    var _this3;

    _classCallCheck(this, PreconditionFailed);

    _this3 = _super3.call(this, message);
    _this3.name = 'PreconditionFailed';
    return _this3;
  }

  return PreconditionFailed;
}(ScnnrError);

function buildMessage(title, detail, type) {
  var message = '';

  if (title) {
    message = "[".concat(title, "]");
  }

  if (detail) {
    message = "".concat(message, " ").concat(detail);
  }

  if (type) {
    message = "".concat(message, " (").concat(type, ")");
  }

  return message;
}

var ScnnrAPIError = /*#__PURE__*/function (_ScnnrError3) {
  _inherits(ScnnrAPIError, _ScnnrError3);

  var _super4 = _createSuper(ScnnrAPIError);

  function ScnnrAPIError(_ref) {
    var _this4;

    var title = _ref.title,
        detail = _ref.detail,
        type = _ref.type,
        statusCode = _ref.statusCode,
        rawResponse = _ref.rawResponse;

    _classCallCheck(this, ScnnrAPIError);

    var message = buildMessage(title, detail, type);
    _this4 = _super4.call(this, message);
    _this4.name = 'ScnnrAPIError';
    Object.assign(_assertThisInitialized(_this4), {
      title: title,
      detail: detail,
      type: type,
      statusCode: statusCode,
      rawResponse: rawResponse
    });
    return _this4;
  }

  return ScnnrAPIError;
}(ScnnrError);
var RecognitionError = /*#__PURE__*/function (_ScnnrError4) {
  _inherits(RecognitionError, _ScnnrError4);

  var _super5 = _createSuper(RecognitionError);

  function RecognitionError(_ref2, recognition) {
    var _this5;

    var title = _ref2.title,
        detail = _ref2.detail,
        type = _ref2.type;

    _classCallCheck(this, RecognitionError);

    var message = buildMessage(title, detail, type);
    _this5 = _super5.call(this, message);
    _this5.name = 'RecognitionError';
    Object.assign(_assertThisInitialized(_this5), {
      title: title,
      detail: detail,
      type: type,
      recognition: recognition
    });
    return _this5;
  }

  return RecognitionError;
}(ScnnrError);

var errors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ScnnrError: ScnnrError,
  PollTimeout: PollTimeout,
  PreconditionFailed: PreconditionFailed,
  ScnnrAPIError: ScnnrAPIError,
  RecognitionError: RecognitionError
});

var AuthInterceptor = /*#__PURE__*/function () {
  function AuthInterceptor() {
    _classCallCheck(this, AuthInterceptor);

    this.interceptRequest = this.interceptRequest.bind(this);
  }

  _createClass(AuthInterceptor, [{
    key: "interceptRequest",
    value: function interceptRequest(config) {
      return Promise.resolve(config);
    }
  }]);

  return AuthInterceptor;
}();

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var PrivateKeyAuthInterceptor = /*#__PURE__*/function (_AuthInterceptor) {
  _inherits(PrivateKeyAuthInterceptor, _AuthInterceptor);

  var _super = _createSuper$1(PrivateKeyAuthInterceptor);

  function PrivateKeyAuthInterceptor(apiKey) {
    var _this;

    _classCallCheck(this, PrivateKeyAuthInterceptor);

    _this = _super.call(this);
    _this.apiKey = apiKey;
    return _this;
  }

  _createClass(PrivateKeyAuthInterceptor, [{
    key: "interceptRequest",
    value: function interceptRequest(config) {
      var _this2 = this;

      return new Promise(function (resolve) {
        config.headers['x-api-key'] = _this2.apiKey;
        resolve(config);
      });
    }
  }]);

  return PrivateKeyAuthInterceptor;
}(AuthInterceptor);

var OneTimeToken = /*#__PURE__*/function () {
  function OneTimeToken(value, expiresIn) {
    _classCallCheck(this, OneTimeToken);

    this.value = value;
    this.expiresIn = expiresIn;
    this.expiresAt = new Date(Date.now() + expiresIn * 1000);
  }

  _createClass(OneTimeToken, [{
    key: "hasExpired",
    value: function hasExpired() {
      var margin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return Date.now() >= this.expiresAt.getTime() - margin;
    }
  }]);

  return OneTimeToken;
}();

function buildToken(data) {
  switch (data.type) {
    case 'one-time':
      return new OneTimeToken(data.value, data.expires_in);

    default:
      return null;
  }
}

var token = /*#__PURE__*/Object.freeze({
  __proto__: null,
  OneTimeToken: OneTimeToken,
  buildToken: buildToken
});

var OneTimeTokenProvider = /*#__PURE__*/function () {
  function OneTimeTokenProvider(publicAPIKey, options) {
    _classCallCheck(this, OneTimeTokenProvider);

    this.publicAPIKey = publicAPIKey;
    this.options = options;
    this.token = null;
    this.timeout = null;
    this.marginToExpire = 0.05; // a margin to prevent unexpected expiration (5% of the time)
  }

  _createClass(OneTimeTokenProvider, [{
    key: "get",
    value: function get() {
      var _this = this;

      return this.issue().then(function () {
        return _this.getAndClearToken();
      });
    }
  }, {
    key: "issue",
    value: function issue() {
      var _this2 = this;

      if (this.hasValidToken()) {
        return Promise.resolve();
      }

      return this.requestToken().then(function (token) {
        _this2.token = token;
      });
    }
  }, {
    key: "requestToken",
    value: function requestToken() {
      return Connection.build(true, Object.assign({}, this.options, {
        apiKey: this.publicAPIKey
      })).sendJson('/auth/tokens', {
        type: 'one-time'
      }).then(function (response) {
        return buildToken(response.data);
      });
    }
  }, {
    key: "hasValidToken",
    value: function hasValidToken() {
      if (this.token == null) {
        return false;
      }

      return !this.token.hasExpired(this.token.expiresIn * this.marginToExpire * 1000);
    }
  }, {
    key: "getAndClearToken",
    value: function getAndClearToken() {
      var token = this.token;
      this.token = null;
      return token;
    }
  }]);

  return OneTimeTokenProvider;
}();

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var PublicKeyAuthInterceptor = /*#__PURE__*/function (_AuthInterceptor) {
  _inherits(PublicKeyAuthInterceptor, _AuthInterceptor);

  var _super = _createSuper$2(PublicKeyAuthInterceptor);

  function PublicKeyAuthInterceptor(publicAPIKey, options) {
    var _this;

    _classCallCheck(this, PublicKeyAuthInterceptor);

    _this = _super.call(this);
    _this.oneTimeTokenProvider = new OneTimeTokenProvider(publicAPIKey, options);
    return _this;
  }

  _createClass(PublicKeyAuthInterceptor, [{
    key: "interceptRequest",
    value: function interceptRequest(config) {
      return this.oneTimeTokenProvider.get().then(function (token) {
        config.headers['x-api-key'] = 'use-scnnr-one-time-token';
        config.headers['x-scnnr-one-time-token'] = token.value;
        return config;
      });
    }
  }]);

  return PublicKeyAuthInterceptor;
}(AuthInterceptor);

function sanitizeAPIKey(key) {
  if (typeof key !== 'string') {
    return null;
  }

  key = key.replace(/^\s*/, '').replace(/\s*$/, '');
  return key === '' ? null : key;
}

function authInterceptor(config) {
  var apiKey = sanitizeAPIKey(config.apiKey);
  var publicAPIKey = sanitizeAPIKey(config.publicAPIKey);

  if (apiKey != null) {
    return new PrivateKeyAuthInterceptor(apiKey);
  } else if (publicAPIKey != null) {
    return new PublicKeyAuthInterceptor(publicAPIKey, {
      url: config.url,
      version: config.version
    });
  } else {
    throw new PreconditionFailed('`apiKey` or `publicAPIKey` configuration is required.');
  }
}

var Connection = /*#__PURE__*/function () {
  function Connection(_ref) {
    var url = _ref.url,
        apiKey = _ref.apiKey,
        params = _ref.params,
        authInterceptor = _ref.authInterceptor,
        onUploadProgress = _ref.onUploadProgress,
        onDownloadProgress = _ref.onDownloadProgress;

    _classCallCheck(this, Connection);

    var headers = {};

    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    this.httpClient = axios.create({
      params: params,
      headers: headers,
      baseURL: url,
      onUploadProgress: onUploadProgress,
      onDownloadProgress: onDownloadProgress
    });
    this.httpClient.interceptors.response.use(function (response) {
      return response;
    }, this.errorInterceptor);

    if (authInterceptor != null) {
      this.httpClient.interceptors.request.use(authInterceptor.interceptRequest);
    }
  }

  _createClass(Connection, [{
    key: "get",
    value: function get(path) {
      return this.httpClient.get(path, null);
    }
  }, {
    key: "sendJson",
    value: function sendJson(path, data) {
      return this.send(path, data, 'application/json');
    }
  }, {
    key: "sendBinary",
    value: function sendBinary(path, data) {
      return this.send(path, data, 'application/octet-stream');
    }
  }, {
    key: "send",
    value: function send(path, data, contentType) {
      return this.httpClient.post(path, data, {
        headers: {
          'Content-Type': contentType
        }
      });
    }
  }, {
    key: "errorInterceptor",
    value: function errorInterceptor(err) {
      // If err does not have response, is not an HTTP error. Reject normally
      if (!err.response) {
        return Promise.reject(err);
      }

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
  }], [{
    key: "build",
    value: function build(needAuth, config) {
      var params = config.params || {};

      if ((config.timeout || 0) > 0) {
        params.timeout = config.timeout;
      }

      return new Connection({
        params: params,
        authInterceptor: needAuth ? authInterceptor(config) : null,
        url: config.url + config.version,
        onUploadProgress: config.onUploadProgress,
        onDownloadProgress: config.onDownloadProgress
      });
    }
  }]);

  return Connection;
}();

var Item = function Item(props) {
  _classCallCheck(this, Item);

  this.category = props.category;
  this.boundingBox = props.boundingBox || props.bounding_box;
  this.labels = props.labels;
};

var Size = function Size(_ref) {
  var width = _ref.width,
      height = _ref.height;

  _classCallCheck(this, Size);

  this.width = width;
  this.height = height;
};

var Image = function Image(_ref) {
  var url = _ref.url,
      size = _ref.size;

  _classCallCheck(this, Image);

  this.url = url;
  this.size = new Size(size);
};
Image.Size = Size;

var Recognition = /*#__PURE__*/function () {
  function Recognition(_ref) {
    var id = _ref.id,
        objects = _ref.objects,
        state = _ref.state,
        image = _ref.image,
        error = _ref.error;

    _classCallCheck(this, Recognition);

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

  _createClass(Recognition, [{
    key: "isFinished",
    value: function isFinished() {
      return this.state === 'finished';
    }
  }, {
    key: "hasError",
    value: function hasError() {
      return !!this.error;
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
      remainingTime = config.remainingTime;
  var timeout = (remainingTime || 0) - 25 < 0 ? remainingTime : 25;
  return new Promise(function (resolve, reject) {
    if (remainingTime <= 0) {
      return reject(new PollTimeout('Polling timed out'));
    }

    return requestFunc({
      timeout: timeout
    }).then(function (result) {
      if (conditionChecker(result)) {
        return resolve(result);
      }

      var newRemainingTime = remainingTime - timeout;
      var newConfig = {
        requestFunc: requestFunc,
        conditionChecker: conditionChecker,
        remainingTime: newRemainingTime
      };
      return resolve(poll.call(_this, newConfig));
    });
  });
}

function getTimeoutLength() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var timeoutMaxAllowed = arguments.length > 1 ? arguments[1] : undefined;
  return timeout - timeoutMaxAllowed < 0 ? timeout : timeoutMaxAllowed;
}

var Client = /*#__PURE__*/function () {
  function Client(config) {
    _classCallCheck(this, Client);

    this.config = Object.assign({}, defaults, config);
  }

  _createClass(Client, [{
    key: "recognizeURL",
    value: function recognizeURL(url) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.recognizeRequest(function (options) {
        return _this.connection(true, options).sendJson('/remote/recognitions', {
          url: url
        });
      }, options);
    }
  }, {
    key: "recognizeImage",
    value: function recognizeImage(data) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var params = {
        "public": options["public"]
      };
      var fullOptions = Object.assign({}, options, {
        params: params
      });
      return this.recognizeRequest(function (options) {
        return _this2.connection(true, options).sendBinary('/recognitions', data);
      }, fullOptions);
    } // Takes a request and timeout and checks if the recognize request
    // should start the polling process and calls poll if positive

  }, {
    key: "recognizeRequest",
    value: function recognizeRequest(requestFunc, options) {
      var _this3 = this;

      var timeoutForFirstRequest = getTimeoutLength(options.timeout, 25);
      var opt = Object.assign({}, options, {
        timeout: timeoutForFirstRequest
      });
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
              remainingTime: options.timeout - timeoutForFirstRequest
            });
          }

          return resolve(recognition);
        }).then(resolve)["catch"](reject);
      });
    }
  }, {
    key: "fetch",
    value: function fetch(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.connection(false, options).get("/recognitions/".concat(id)).then(this.handleResponse);
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      var recognition = new Recognition(response.data);

      if (recognition.hasError()) {
        throw new RecognitionError(recognition.error, recognition);
      }

      return recognition;
    }
  }, {
    key: "connection",
    value: function connection(needAuth, options) {
      return Connection.build(needAuth, Object.assign({}, this.config, options));
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
  Recognition: Recognition,
  PrivateKeyAuthInterceptor: PrivateKeyAuthInterceptor,
  PublicKeyAuthInterceptor: PublicKeyAuthInterceptor,
  authInterceptor: authInterceptor,
  OneTimeTokenProvider: OneTimeTokenProvider
}, token, errors);

export default index;

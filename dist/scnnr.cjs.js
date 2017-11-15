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
        params = _ref.params;
    classCallCheck(this, Connection);

    this.httpClient = axios.create();
    this.httpClient.defaults.baseURL = url;

    if (apiKey) {
      this.httpClient.defaults.headers['x-api-key'] = apiKey;
    }

    this.httpClient.defaults.params = params;
  }

  createClass(Connection, [{
    key: 'get',
    value: function get$$1(path) {
      return this.httpClient.get(path, null, { headers: { 'Content-Type': 'application/json' } });
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

var Recognition = function Recognition(_ref) {
  var id = _ref.id,
      objects = _ref.objects,
      state = _ref.state,
      error = _ref.error;
  classCallCheck(this, Recognition);

  this.id = id;
  this.objects = (objects || []).map(function (obj) {
    return new Item(obj);
  });
  this.state = state;
  this.error = error;
};

Recognition.Item = Item;

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



var errors = Object.freeze({
	PreconditionFailed: PreconditionFailed
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
    key: 'recognizeUrl',
    value: function recognizeUrl(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.connection(true, options).sendJson('/remote/recognitions', { url: url }).then(this.handleResponse);
    }
  }, {
    key: 'recognizeImage',
    value: function recognizeImage(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.connection(true, options).sendBinary('/recognitions', data).then(this.handleResponse);
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
      var params = {};
      if ((config.timeout || 0) > 0) {
        params.timeout = config.timeout;
      }
      return {
        apiKey: apiKey, params: params,
        url: config.url + config.version
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

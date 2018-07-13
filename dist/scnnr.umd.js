!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.scnnr=t()}(this,function(){"use strict";function e(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}function t(e){return"[object Array]"===k.call(e)}function n(e){return null!==e&&"object"==typeof e}function r(e){return"[object Function]"===k.call(e)}function o(e,n){if(null!==e&&void 0!==e)if("object"==typeof e||t(e)||(e=[e]),t(e))for(var r=0,o=e.length;r<o;r++)n.call(null,e[r],r,e);else for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&n.call(null,e[i],i,e)}function i(){function e(e,n){t[n]="object"==typeof t[n]&&"object"==typeof e?i(t[n],e):e}for(var t={},n=0,r=arguments.length;n<r;n++)o(arguments[n],e);return t}function s(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}function u(){this.message="String contains an invalid character"}function a(e,t){!P.isUndefined(e)&&P.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}function c(){this.handlers=[]}function f(e){e.cancelToken&&e.cancelToken.throwIfRequested()}function l(e){this.defaults=e,this.interceptors={request:new q,response:new q}}function p(e){this.message=e}function h(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new D(e),t(n.reason))})}function d(e){var t=new L(e),n=b(L.prototype.request,t);return P.extend(n,L.prototype,t),P.extend(n,t),n}function m(e,t,n){var r="";return e&&(r="["+e+"]"),t&&(r=r+" "+t),n&&(r=r+" ("+n+")"),r}function y(e){return"string"!=typeof e?null:""===(e=e.replace(/^\s*/,"").replace(/\s*$/,""))?null:e}function g(e){var t=y(e.apiKey),n=y(e.publicAPIKey);if(null!=t)return new ee(t);if(null!=n)return new ne(n,{url:e.url,version:e.version});throw new G("`apiKey` or `publicAPIKey` configuration is required.")}function v(e){var t=this,n=e.requestFunc,r=e.conditionChecker,o=e.remainingTime,i=(o||0)-25<0?o:25;return new Promise(function(e,s){return o<=0?s(new M("Polling timed out")):n({timeout:i}).then(function(s){if(r(s))return e(s);return e(v.call(t,{requestFunc:n,conditionChecker:r,remainingTime:o-i}))})})}var w={url:"https://api.scnnr.cubki.jp/",version:"v1",timeout:null,apiKey:null},b=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}},k=Object.prototype.toString,P={isArray:t,isArrayBuffer:function(e){return"[object ArrayBuffer]"===k.call(e)},isBuffer:function(t){return null!=t&&(e(t)||function(t){return"function"==typeof t.readFloatLE&&"function"==typeof t.slice&&e(t.slice(0,0))}(t)||!!t._isBuffer)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:n,isUndefined:function(e){return void 0===e},isDate:function(e){return"[object Date]"===k.call(e)},isFile:function(e){return"[object File]"===k.call(e)},isBlob:function(e){return"[object Blob]"===k.call(e)},isFunction:r,isStream:function(e){return n(e)&&r(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product)&&"undefined"!=typeof window&&"undefined"!=typeof document},forEach:o,merge:i,extend:function(e,t,n){return o(t,function(t,r){e[r]=n&&"function"==typeof t?b(t,n):t}),e},trim:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}},E=function(e,t,n,r,o){return function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e}(new Error(e),t,n,r,o)},R=P.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(r.setAttribute("href",t),t=r.href),r.setAttribute("href",t),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a");return t=e(window.location.href),function(n){var r=P.isString(n)?e(n):n;return r.protocol===t.protocol&&r.host===t.host}}():function(){return!0},j="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";(u.prototype=new Error).code=5,u.prototype.name="InvalidCharacterError";var C=function(e){for(var t,n,r=String(e),o="",i=0,s=j;r.charAt(0|i)||(s="=",i%1);o+=s.charAt(63&t>>8-i%1*8)){if((n=r.charCodeAt(i+=.75))>255)throw new u;t=t<<8|n}return o},O=P.isStandardBrowserEnv()?{write:function(e,t,n,r,o,i){var s=[];s.push(e+"="+encodeURIComponent(t)),P.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),P.isString(r)&&s.push("path="+r),P.isString(o)&&s.push("domain="+o),!0===i&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}},T="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||C,_=function(e){return new Promise(function(t,n){var r=e.data,o=e.headers;P.isFormData(r)&&delete o["Content-Type"];var i=new XMLHttpRequest,u="onreadystatechange",a=!1;if("test"===process.env.NODE_ENV||"undefined"==typeof window||!window.XDomainRequest||"withCredentials"in i||R(e.url)||(i=new window.XDomainRequest,u="onload",a=!0,i.onprogress=function(){},i.ontimeout=function(){}),e.auth){o.Authorization="Basic "+T((e.auth.username||"")+":"+(e.auth.password||""))}if(i.open(e.method.toUpperCase(),function(e,t,n){if(!t)return e;var r;if(n)r=n(t);else if(P.isURLSearchParams(t))r=t.toString();else{var o=[];P.forEach(t,function(e,t){null!==e&&void 0!==e&&(P.isArray(e)&&(t+="[]"),P.isArray(e)||(e=[e]),P.forEach(e,function(e){P.isDate(e)?e=e.toISOString():P.isObject(e)&&(e=JSON.stringify(e)),o.push(s(t)+"="+s(e))}))}),r=o.join("&")}return r&&(e+=(-1===e.indexOf("?")?"?":"&")+r),e}(e.url,e.params,e.paramsSerializer),!0),i.timeout=e.timeout,i[u]=function(){if(i&&(4===i.readyState||a)&&(0!==i.status||i.responseURL&&0===i.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in i?function(e){var t,n,r,o={};return e?(P.forEach(e.split("\n"),function(e){r=e.indexOf(":"),t=P.trim(e.substr(0,r)).toLowerCase(),n=P.trim(e.substr(r+1)),t&&(o[t]=o[t]?o[t]+", "+n:n)}),o):o}(i.getAllResponseHeaders()):null;!function(e,t,n){var r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(E("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n)}(t,n,{data:e.responseType&&"text"!==e.responseType?i.response:i.responseText,status:1223===i.status?204:i.status,statusText:1223===i.status?"No Content":i.statusText,headers:r,config:e,request:i}),i=null}},i.onerror=function(){n(E("Network Error",e,null,i)),i=null},i.ontimeout=function(){n(E("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED",i)),i=null},P.isStandardBrowserEnv()){var c=O,f=(e.withCredentials||R(e.url))&&e.xsrfCookieName?c.read(e.xsrfCookieName):void 0;f&&(o[e.xsrfHeaderName]=f)}if("setRequestHeader"in i&&P.forEach(o,function(e,t){void 0===r&&"content-type"===t.toLowerCase()?delete o[t]:i.setRequestHeader(t,e)}),e.withCredentials&&(i.withCredentials=!0),e.responseType)try{i.responseType=e.responseType}catch(t){if("json"!==e.responseType)throw t}"function"==typeof e.onDownloadProgress&&i.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&i.upload&&i.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){i&&(i.abort(),n(e),i=null)}),void 0===r&&(r=null),i.send(r)})},A={"Content-Type":"application/x-www-form-urlencoded"},S={adapter:function(){var e;return"undefined"!=typeof XMLHttpRequest?e=_:"undefined"!=typeof process&&(e=_),e}(),transformRequest:[function(e,t){return function(e,t){P.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}(t,"Content-Type"),P.isFormData(e)||P.isArrayBuffer(e)||P.isBuffer(e)||P.isStream(e)||P.isFile(e)||P.isBlob(e)?e:P.isArrayBufferView(e)?e.buffer:P.isURLSearchParams(e)?(a(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):P.isObject(e)?(a(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(e){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};S.headers={common:{Accept:"application/json, text/plain, */*"}},P.forEach(["delete","get","head"],function(e){S.headers[e]={}}),P.forEach(["post","put","patch"],function(e){S.headers[e]=P.merge(A)});var x=S;c.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},c.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},c.prototype.forEach=function(e){P.forEach(this.handlers,function(t){null!==t&&e(t)})};var q=c,B=function(e,t,n){return P.forEach(n,function(n){e=n(e,t)}),e},U=function(e){return!(!e||!e.__CANCEL__)},I=function(e){f(e),e.headers=e.headers||{},e.data=B(e.data,e.headers,e.transformRequest),e.headers=P.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),P.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]});return(e.adapter||x.adapter)(e).then(function(t){return f(e),t.data=B(t.data,t.headers,e.transformResponse),t},function(t){return U(t)||(f(e),t&&t.response&&(t.response.data=B(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})};l.prototype.request=function(e){"string"==typeof e&&(e=P.merge({url:arguments[0]},arguments[1])),(e=P.merge(x,this.defaults,{method:"get"},e)).method=e.method.toLowerCase(),e.baseURL&&!function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}(e.url)&&(e.url=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}(e.baseURL,e.url));var t=[I,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},P.forEach(["delete","get","head","options"],function(e){l.prototype[e]=function(t,n){return this.request(P.merge(n||{},{method:e,url:t}))}}),P.forEach(["post","put","patch"],function(e){l.prototype[e]=function(t,n,r){return this.request(P.merge(r||{},{method:e,url:t,data:n}))}});var L=l;p.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},p.prototype.__CANCEL__=!0;var D=p;h.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},h.source=function(){var e;return{token:new h(function(t){e=t}),cancel:e}};var F=h,N=d(x);N.Axios=L,N.create=function(e){return d(P.merge(x,e))},N.Cancel=D,N.CancelToken=F,N.isCancel=U,N.all=function(e){return Promise.all(e)},N.spread=function(e){return function(t){return e.apply(null,t)}};var K=N;K.default=N;var z=K,H=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},X=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),J=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},V=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},$=function(e){function t(e){H(this,t);var n=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return Error.hasOwnProperty("captureStackTrace")?Error.captureStackTrace(n,t):n.stack=(new Error).stack,n}return J(t,e),t}(Error),M=function(e){function t(e){H(this,t);var n=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.name="PollTimeout",n}return J(t,$),t}(),G=function(e){function t(e){H(this,t);var n=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.name="PreconditionFailed",n}return J(t,$),t}(),Q=function(e){function t(e){var n=e.title,r=e.detail,o=e.type,i=e.statusCode,s=e.rawResponse;H(this,t);var u=m(n,r,o),a=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,u));return a.name="ScnnrAPIError",Object.assign(a,{title:n,detail:r,type:o,statusCode:i,rawResponse:s}),a}return J(t,$),t}(),W=function(e){function t(e,n){var r=e.title,o=e.detail,i=e.type;H(this,t);var s=m(r,o,i),u=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,s));return u.name="RecognitionError",Object.assign(u,{title:r,detail:o,type:i,recognition:n}),u}return J(t,$),t}(),Y=Object.freeze({ScnnrError:$,PollTimeout:M,PreconditionFailed:G,ScnnrAPIError:Q,RecognitionError:W}),Z=function(){function e(){H(this,e),this.interceptRequest=this.interceptRequest.bind(this)}return X(e,[{key:"interceptRequest",value:function(e){return Promise.resolve(e)}}]),e}(),ee=function(e){function t(e){H(this,t);var n=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n.apiKey=e,n}return J(t,Z),X(t,[{key:"interceptRequest",value:function(e){var t=this;return new Promise(function(n,r){e.headers["x-api-key"]=t.apiKey,n(e)})}}]),t}(),te=function(){function e(t,n){H(this,e),this.publicAPIKey=t,this.options=n,this.token=null,this.timeout=null,this.marginToExpire=.05}return X(e,[{key:"get",value:function(){var e=this;return this.retrieve().then(function(){return e.getAndClearToken()})}},{key:"retrieve",value:function(){var e=this;return null!=this.token?Promise.resolve():this.issue().then(function(t){return e.storeToken(t)})}},{key:"issue",value:function(){return re.build(!0,Object.assign({},this.options,{apiKey:this.publicAPIKey})).sendJson("/auth/tokens",{type:"one-time"}).then(function(e){return e.data})}},{key:"storeToken",value:function(e){var t=this;this.timeout=setTimeout(function(){t.token=null},e.expires_in*(1-this.marginToExpire)*1e3),this.token=e.value}},{key:"getAndClearToken",value:function(){this.clearExpiration();var e=this.token;return this.token=null,e}},{key:"clearExpiration",value:function(){null!=this.timeout&&(clearTimeout(this.timeout),this.timeout=null)}}]),e}(),ne=function(e){function t(e,n){H(this,t);var r=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r.oneTimeTokenProvider=new te(e,n),r}return J(t,Z),X(t,[{key:"interceptRequest",value:function(e){return this.oneTimeTokenProvider.get().then(function(t){return e.headers["x-api-key"]="use-scnnr-one-time-token",e.headers["x-scnnr-one-time-token"]=t,e})}}]),t}(),re=function(){function e(t){var n=t.url,r=t.apiKey,o=t.params,i=t.authInterceptor,s=t.onUploadProgress,u=t.onDownloadProgress;H(this,e);var a={};r&&(a["x-api-key"]=r),this.httpClient=z.create({params:o,headers:a,baseURL:n,onUploadProgress:s,onDownloadProgress:u}),this.httpClient.interceptors.response.use(function(e){return e},this.errorInterceptor),null!=i&&this.httpClient.interceptors.request.use(i.interceptRequest)}return X(e,[{key:"get",value:function(e){return this.httpClient.get(e,null)}},{key:"sendJson",value:function(e,t){return this.send(e,t,"application/json")}},{key:"sendBinary",value:function(e,t){return this.send(e,t,"application/octet-stream")}},{key:"send",value:function(e,t,n){return this.httpClient.post(e,t,{headers:{"Content-Type":n}})}},{key:"errorInterceptor",value:function(e){return e.response?Promise.reject(new Q({title:e.response.data.title||e.response.data.message,detail:e.response.data.detail||e.message,type:e.response.data.type,rawResponse:e.response.data,statusCode:e.response.status})):Promise.reject(e)}}],[{key:"build",value:function(t,n){var r=n.params||{};return(n.timeout||0)>0&&(r.timeout=n.timeout),new e({params:r,authInterceptor:t?g(n):null,url:n.url+n.version,onUploadProgress:n.onUploadProgress,onDownloadProgress:n.onDownloadProgress})}}]),e}(),oe=function e(t){H(this,e),this.category=t.category,this.boundingBox=t.boundingBox||t.bounding_box,this.labels=t.labels},ie=function e(t){var n=t.width,r=t.height;H(this,e),this.width=n,this.height=r},se=function e(t){var n=t.url,r=t.size;H(this,e),this.url=n,this.size=new ie(r)};se.Size=ie;var ue=function(){function e(t){var n=t.id,r=t.objects,o=t.state,i=t.image,s=t.error;H(this,e),this.id=n,this.objects=(r||[]).map(function(e){return new oe(e)}),this.state=o,null!=i&&(this.image=new se(i)),this.error=s}return X(e,[{key:"isFinished",value:function(){return"finished"===this.state}},{key:"hasError",value:function(){return!!this.error}}]),e}();ue.Item=oe,ue.Image=se;var ae=function(){function e(t){H(this,e),this.config=Object.assign({},w,t)}return X(e,[{key:"recognizeURL",value:function(e){var t=this;return this.recognizeRequest(function(n){return t.connection(!0,n).sendJson("/remote/recognitions",{url:e})},arguments.length>1&&void 0!==arguments[1]?arguments[1]:{})}},{key:"recognizeImage",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r={public:n.public},o=Object.assign({},n,{params:r});return this.recognizeRequest(function(n){return t.connection(!0,n).sendBinary("/recognitions",e)},o)}},{key:"recognizeRequest",value:function(e,t){var n=this,r=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments[1];return e-t<0?e:t}(t.timeout,25),o=e(Object.assign({},t,{timeout:r}));return new Promise(function(e,i){o.then(n.handleResponse).then(function(o){return(t.timeout||0)>0&&!o.isFinished()?v({requestFunc:function(e){return n.fetch(o.id,e)},conditionChecker:function(e){return e.isFinished()},remainingTime:t.timeout-r}):e(o)}).then(e).catch(i)})}},{key:"fetch",value:function(e){return this.connection(!1,arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).get("/recognitions/"+e).then(this.handleResponse)}},{key:"handleResponse",value:function(e){var t=new ue(e.data);if(t.hasError())throw new W(t.error,t);return t}},{key:"connection",value:function(e,t){return re.build(e,Object.assign({},this.config,t))}}]),e}();return Object.assign(function(e){return new ae(e)},{Client:ae,Connection:re,Recognition:ue,PrivateKeyAuthInterceptor:ee,PublicKeyAuthInterceptor:ne,authInterceptor:g,OneTimeTokenProvider:te},Y)});

// mozSettings API tests (polyfilled!)
(function(window) {
  window.Tests = window.Tests || {};

  function onChange(log, e) {
    log('onchangeproperty-received' + JSON.stringify(e));
  };

  function setHandlers(mozFMRadio, log) {
    var properties = ['enabled', 'antennaAvailable', 'frequencyUpperBound',
      'frequencyLowerBound', 'channelWidth', 'frequency'];

    properties.forEach(property => {
      mozFMRadio['on' + property] = onChange.bind(undefined, log);
    });
  };

  window.Tests['fmradio'] = {
    dependencies: [
      '/WebAPI_pf/polyfills/common/webapi_poly_common.js',
      '/WebAPI_pf/polyfills/fm/fmradio.js'
    ],

    runTest: function() {
      var log = window.Tests.log.bind(undefined, 'fmradio');
      var abort = window.Tests.abort;
      var _mozFMRadio = window.navigator.mozFMRadio ||
          abort('polyfill window.navigator.mozFMRadio not defined.');

      var properties = ['enabled', 'antennaAvailable', 'frequencyUpperBound',
       'frequencyLowerBound', 'channelWidth', 'frequency'];
      var frequencyTest = 87.5;

      var _resolve;
      var _reject;

      var enableRadio = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      });


      function _enableRadio() {
        var request = _mozFMRadio.enable(frequencyTest);
      
        request.onsuccess = function onsuccess() {
          log('Successfuly enable ' + JSON.stringify(this.result));
          _resolve(this.result);
        }

        request.onerror = function onerror() {
          log('enable. Error: ' + this.error.name);
          _reject();
        }
      }

      function seek(operation) {
        return new Promise((resolve, reject) => {
          var request = _mozFMRadio[operation]();
        
          request.onsuccess = function onsuccess() {
            log('Successfuly ' + operation + ' ' + JSON.stringify(this.result));
            resolve();
          }

          request.onerror = function onerror() {
            log(operation + '. Error: ' + this.error.name);
            reject();
          }
        });
      }

      function testEnable() {
        log('***** TESTING enable');
        _enableRadio();
      }

      function testDisable() {
        log('***** TESTING disable');
        var request = _mozFMRadio.disable();
        
        request.onsuccess = function onsuccess() {
          log('Successfuly disable ' + JSON.stringify(this.result));
        }

        request.onerror = function onerror() {
          log('disable. Error: ' + this.error.name);
        }
      }

      function testSeek() {
        log('***** TESTING seek');
        enableRadio.then(() => {
          seek('seekUp').then(seek('seekDown').then(seek('cancelSeek')));
        });
      }

      function testSetFrequency() {
        log('***** TESTING setFrequency');
        enableRadio.then(() => {
          var request = _mozFMRadio.setFrequency(97.1);
        
          request.onsuccess = function onsuccess() {
            log('Successfuly setFrequency ' + JSON.stringify(this.result));
          }

          request.onerror = function onerror() {
            log('setFrequency. Error: ' + this.error.name);
          }
        });
      }

      function testGetters() {
        properties.forEach(property => {
          log('Get ' + property + ' Value: ' + _mozFMRadio[property]);
        });
      }

      try {
        log('Starting fmradio polyfill tests');
        setHandlers(_mozFMRadio, log);

        testEnable();
        testSeek();
        testSetFrequency();
        testGetters();
        //testDisable();
      } catch (e) {
        log("Finished early with " + e);
      }
    }
  };

})(window);

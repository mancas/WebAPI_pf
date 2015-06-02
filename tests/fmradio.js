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

      function testSeekUp() {
        log('***** TESTING seekUp');
        enableRadio.then(() => {
          var request = _mozFMRadio.seekUp();
        
          request.onsuccess = function onsuccess() {
            log('Successfuly seekUp ' + JSON.stringify(this.result));
          }

          request.onerror = function onerror() {
            log('seekUp. Error: ' + this.error.name);
          }
        });
      }

      function testSeekDown() {
        log('***** TESTING seekDown');
        enableRadio.then(() => {
          var request = _mozFMRadio.seekDown();
        
          request.onsuccess = function onsuccess() {
            log('Successfuly seekDown ' + JSON.stringify(this.result));
          }

          request.onerror = function onerror() {
            log('seekDown. Error: ' + this.error.name);
          }
        });
      }

      function testCancelSeek() {
        log('***** TESTING cancelSeek');
        enableRadio.then(() => {
          var request = _mozFMRadio.cancelSeek();
        
          request.onsuccess = function onsuccess() {
            log('Successfuly cancelSeek ' + JSON.stringify(this.result));
          }

          request.onerror = function onerror() {
            log('cancelSeek. Error: ' + this.error.name);
          }
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
        testSeekUp();
        testSeekDown();
        testCancelSeek();
        testSetFrequency();
        testGetters();
        testDisable();
      } catch (e) {
        log("Finished early with " + e);
      }
    }
  };

})(window);

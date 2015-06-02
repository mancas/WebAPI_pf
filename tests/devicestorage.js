// mozSettings API tests (polyfilled!)
(function(window) {
  window.Tests = window.Tests || {};

  window.Tests['devicestorage'] = {
    dependencies: [
      '/WebAPI_pf/polyfills/common/webapi_poly_common.js',
      '/WebAPI_pf/polyfills/devicestorage/devicestorage.js'
    ],

    runTest: function() {
      var log = window.Tests.log.bind(undefined, 'Device Storage');
      var abort = window.Tests.abort;
      var _mozContacts = navigator.getDeviceStorage &&
        navigator.getDeviceStorages ||
        abort('polyfill Device Storage not defined.');
      var fileTextName = 'myFile.txt';

      function getDeviceStorage(type) {
        return window.navigator.getDeviceStorage(type);
      }

      function getDeviceStorages(type) {
        return window.navigator.getDeviceStorages(type);
      }

      function addFile() {
        return new Promise((resolve, reject) => {
          var sdcard = getDeviceStorage('sdcard');
          var file   = new Blob(['This is a text file.'], {type: 'text/plain'});

          var request = sdcard.add(file);

          request.onsuccess = function () {
            var name = this.result.name;
            log('Successfuly File "' + name +
              '" successfully wrote on the sdcard storage area');
            resolve(name);
          }

          request.onerror = function () {
            var msg = 'addNamed. Error: ' + this.error;
            log(msg);
            reject();
          }
        });
      }

      function testGetDeviceStorage() {
        log('***** TESTING getDeviceStorage');
        var ds = getDeviceStorage('sdcard');
        if (ds) {
          log('Successfuly getDeviceStorage ' + JSON.stringify(ds));
        } else {
          log('getDeviceStorage. Error');
        }
      }

      function testGetDeviceStorages() {
        log('***** TESTING getDeviceStorages');
        var deviceStorages = getDeviceStorages('sdcard');
        if (deviceStorages && deviceStorages.length > 0) {
          log('Successfuly getDeviceStorage ' + deviceStorages.length);
        } else {
          log('getDeviceStorages. Error');
        }
      }

      function testAdd() {
        log('***** TESTING add');
        addFile();
      }

      function testAddNamed() {
        log('***** TESTING addNamed');
        var sdcard = getDeviceStorage('sdcard');
        var file   = new Blob(['This is a text file.'], {type: 'text/plain'});

        var request = sdcard.add(file, fileTextName);

        request.onsuccess = function () {
          var name = this.result.name;
          log('Successfuly File "' + name +
            '" successfully wrote on the sdcard storage area');
          resolve(name);
        }

        request.onerror = function () {
          var msg = 'addNamed. Error: ' + this.error;
          log(msg);
          reject();
        }
      }


      function testAvailable() {
        log('***** TESTING available');
        var sdcard = getDeviceStorage('sdcard');

        var request = sdcard.available();

        request.onsuccess = function () {
          log('Successfuly sdcard is "' + this.result);
        }

        request.onerror = function () {
          var msg = 'available. Error: ' + this.error;
          log(msg);
        }
      }

      function testDelete() {
        log('***** TESTING delete');
        var sdcard = getDeviceStorage('sdcard');

        var request = sdcard.delete(fileTextName);

        request.onsuccess = function () {
          log('Successfuly delete file "' + this.result);
        }

        request.onerror = function () {
          var msg = 'delete. Error: ' + this.error;
          log(msg);
        }
      }

      function testEnumerate() {
        log('***** TESTING enumerate');
        var sdcard = navigator.getDeviceStorage('sdcard');

        var cursor = sdcard.enumerate();

        cursor.onsuccess = function onsuccess() {
          if (this.result) {
            var file = this.result;
            console.log("Succesfully File updated: " + file.lastModifiedDate);
            this.continue();
          }
        }

        cursor.onerror = function onerror() {
          var msg = 'enumerate. Error: ' + this.error;
          log(msg);
        }
      }

      function testEnumerateEditable() {
        log('***** TESTING enumerateEditable');
        var sdcard = navigator.getDeviceStorage('sdcard');

        var cursor = sdcard.enumerateEditable();

        cursor.onsuccess = function onsuccess() {
          if (this.result) {
            var file = this.result;
            console.log("Succesfully File updated: " + file.lastModifiedDate);
            this.continue();
          }
        }

        cursor.onerror = function onerror() {
          var msg = 'enumerateEditable. Error: ' + this.error;
          log(msg);
        }
      }

      function testFreeSpace() {
        log('***** TESTING freeSpace');
        var sdcard = getDeviceStorage('sdcard');

        var request = sdcard.freeSpace();

        request.onsuccess = function () {
          log('Successfuly freeSpace "' + this.result);
        }

        request.onerror = function () {
          var msg = 'freeSpace. Error: ' + this.error;
          log(msg);
        }
      }

      function testGet() {
        log('***** TESTING get');
        addFile().then(fileName => {
          var request = sdcard.get(fileName);

          request.onsuccess = function () {
            var name = this.result.name;
            log('File "' + name +
              '" successfully retrieved from the sdcard storage area');
          }

          request.onerror = function () {
            log('get. Error: ' + this.error);
          }
        });
      }

      function testGetEditable() {
        log('***** TESTING getEditable');
        addFile().then(fileName => {
          var request = sdcard.getEditable(fileName);

          request.onsuccess = function () {
            var name = this.result.name;
            log('File "' + name +
              '" successfully retrieved from the sdcard storage area');
          }

          request.onerror = function () {
            log('get. Error: ' + this.error);
          }
        });
      }

      function testUsedSpace() {
        log('***** TESTING usedSpace');
        var sdcard = getDeviceStorage('sdcard');

        var request = sdcard.usedSpace();

        request.onsuccess = function () {
          log('Successfuly usedSpace "' + this.result);
        }

        request.onerror = function () {
          var msg = 'usedSpace. Error: ' + this.error;
          log(msg);
        }
      }

      try {
        log('Starting device storage polyfill tests');
        testGetDeviceStorage();
        testGetDeviceStorages();
        testAdd();
        testAddNamed();
        testAvailable()
        testDelete();
        testEnumerate();
        testEnumerateEditable();
        testFreeSpace();
        testGet();
        testGetEditable();
        testUsedSpace();
      } catch (e) {
        log("Finished early with " + e);
      }
    }
  };

})(window);

// mozSettings API tests (polyfilled!)
(function(window) {
  window.Tests = window.Tests || {};

  window.Tests['contacts'] = {
    dependencies: [
      '/WebAPI_pf/polyfills/common/webapi_poly_common.js',
      '/WebAPI_pf/polyfills/contacts/contacts.js'
    ],

    runTest: function() {
      var log = window.Tests.log.bind(undefined, 'contacts');
      var abort = window.Tests.abort;
      var _mozContacts = window.navigator.mozContacts ||
          abort('polyfill window.navigator.mozContacts not defined.');

      function testGetCount() {
        log('***** TESTING getCount');
        var request = _mozContacts.getCount();
        
        request.onsuccess = function onsuccess() {
          log('Successfuly getCount ' + JSON.stringify(this.result));
        }

        request.onerror = function onerror() {
          var msg = 'getCount. Error: ' + this.error.name;
          log(msg);
        }
      }

      function testGetAll() {
        log('***** TESTING getAll');
        var cursor;
        try {
          cursor = _mozContacts.getAll();
        } catch (e) {
          log('Exception retrieving contacts ' + JSON.stringify(e));
        }

        cursor.onsuccess = function onsuccess() {
          log("testGetAll.cursor.onsuccess: " + this.done + ", " +
              JSON.stringify(this.result));
          if (!this.done) {
            this.continue();
          } else {
            log("testGetAll: All done!");
          }
        };
        cursor.onerror = function onerror() {
          var msg = 'getAll. Error: ' + this.error.name;
          log(msg);
        };
      }

      function testFind() {
        log('***** TESTING find');
        var options = {
          filterValue : "Test",
          filterBy    : ["givenName","name","nickName"],
          filterOp    : "contains",
          filterLimit : 1,
          sortBy      : "familyName",
          sortOrder   : "ascending"
        };
        var request = _mozContacts.find(options);
        
        request.onsuccess = function onsuccess() {
          log('Successfuly find ' + JSON.stringify(this.result));
        }

        request.onerror = function onerror() {
          var msg = 'find. Error: ' + this.error.name;
          log(msg);
        }
      }

      function testClear() {
        log('***** TESTING clear');
        var request = _mozContacts.clear();
        
        request.onsuccess = function onsuccess() {
          log('Successfuly clear ' + JSON.stringify(this.result));
        }

        request.onerror = function onerror() {
          var msg = 'clear. Error: ' + this.error.name;
          log(msg);
        }
      }

      function testSave() {
        log('***** TESTING save');
        var contact = new mozContact();
        var request = _mozContacts.save(contact);
        
        request.onsuccess = function onsuccess() {
          log('Successfuly save ' + JSON.stringify(this.result));
        }

        request.onerror = function onerror() {
          var msg = 'save. Error: ' + this.error.name;
          log(msg);
        }
      }

      function testGetRevision() {
        log('***** TESTING getRevision');
        var request = _mozContacts.getRevision();
        
        request.onsuccess = function onsuccess() {
          log('Successfuly getRevision ' + JSON.stringify(this.result));
        }

        request.onerror = function onerror() {
          var msg = 'getRevision. Error: ' + this.error.name;
          log(msg);
        }
      }

      try {
        log('Starting contacts polyfill tests');
        testGetCount();
        testGetAll();
        //testFind();
        testClear();
        testSave();
        //testGetRevision();
      } catch (e) {
        log("Finished early with " + e);
      }
    }
  };

})(window);

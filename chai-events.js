
(function (chaiEventful) {
  /*global module:true, chai:true */
  'use strict';

  // Module systems magic dance.
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // NodeJS
    module.exports = chaiEventful;
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function () {
      return chaiEventful;
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    chai.use(chaiEventful);
  }
}(function chaiEventful(chai, utils) {
  /*jshint validthis:true */
  'use strict';

  var Assertion = chai.Assertion;

  var EVENT_NAME = 'eventName';

  var triggerChaining = function (eventName) {
    utils.flag(this, EVENT_NAME, eventName);
  };

  Assertion.addMethod('trigger', triggerChaining);
  Assertion.addMethod('fire', triggerChaining);

  var checkPreconditions = function (createEvent, triggeringObj, eventName) {
    var err;
    if (typeof createEvent !== 'function') {
      err = 'You must pass a function in your assertion or in the "when" method that cause an event to be fired';
    }
    if (typeof triggeringObj.on !== 'function') {
      err = 'You must pass an object that fires events (i.e. has an "on" function) to "on"';
    }
    if (!eventName) {
      err = 'You must specify an event name in the "fire" method before "on" or "when"';
    }
    if (err) { throw new Error(err); }
  };

  var runAssertion = function (createEvent, triggeringObj) {
    var eventFired, eventName = utils.flag(this, EVENT_NAME);

    checkPreconditions(createEvent, triggeringObj, eventName);
    triggeringObj.on(eventName, function () {
      eventFired = true;
    });
    createEvent();

    this.assert(
      eventFired,
      'expected object to trigger a #{exp} event.',
      'expected object not to trigger a #{exp} event',
      eventName
    );
  };

 /**
  * ### .trigger(eventName)/.fire(eventName)
  * ### .on(object)
  *
  * Asserts that an event with the given name is fired on the specified
  * object.
  *
  *     var model = new Backbone.Model();
  *     var fn = function () { model.set('foo', 'bar'); };
  *     expect(fn).to.trigger('change:foo').on(model);
  *     expect(fn).to.fire('change:foo').on(model);
  *
  */
  Assertion.addMethod('on', function (triggeringObj) {
    runAssertion.call(this, this._obj, triggeringObj);
  });

 /**
  * ### .trigger(eventName)/.fire(eventName)
  * ### .when(createEventFunction)
  *
  * Asserts that an event with the given name is fired on the specified
  * object.
  *
  *     var model = new Backbone.Model();
  *     var fn = function () { model.set('foo', 'bar'); };
  *     expect(fn).to.trigger('change:foo').on(model);
  *     expect(fn).to.fire('change:foo').on(model);
  *
  */
  Assertion.addMethod('when', function (createEvent) {
    runAssertion.call(this, createEvent, this._obj);
  });


}));
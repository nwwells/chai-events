chai-events
===========

This chai plugin that allows you to easily make assertions about objects firing events.


Usage
-----

There are two styles for making assertions about events using chai-events: (1) `on` and (2) `when`

### .on(object)

    # A Backbone.js example
    var model = new Backbone.Model();
    var fn = function () { model.set('foo', 'bar'); };
    expect(fn).to.trigger('change:foo').on(model);
    expect(fn).to.fire('change:foo').on(model);
    
With `on` you write your assertion in terms of a function 
that will cause an event, similar to the 
[throws](http://chaijs.com/api/bdd/#keys-section) assertion.

### .when(fn)

    # A JQuery example - currently untested
    expect($('#input-el')).to.fire('blur').when(function () {
      $('body').trigger('click');
    });

With `when`, you write the assertion in terms of the object
that will fire the event, when the function you pass is run.

Installation
------------
Installation follows standard chai plugin installation
practices. For an example, see 
[sinon-chai](http://chaijs.com/plugins/sinon-chai)

Notes
-----

### Asyncronous Tests

There is currently no support for asyncronous events. This
means that many Node.js use cases with stricter run-to-completion 
semantics won't really work. In this case, it will appear
that the event didn't fire at all, even if it really did.

### License

This code is released under the MIT license.

var client = require('../index.js');
var Vertex = require("../src/gremlin/vertex");
var Gremlin = require('../src/gremlin');


describe('Graph elements', function() {
  describe('.setProperty()', function() {
    it('should set property', function() {
      var gremlin = new Gremlin(client);
      var vertex = new Vertex(gremlin, 'v');

      vertex.setProperty('name', 'bob');
      vertex.should.have.property('name', 'bob');
      gremlin.script.should.equal("v.setProperty('name','bob')");
    });
  });

  describe('.addProperty()', function() {
    it('should add property', function() {
      var gremlin = new Gremlin(client);
      var vertex = new Vertex(gremlin, 'v');

      vertex.addProperty('name', 'alice');
      vertex.should.have.property('name', 'alice');
      gremlin.script.should.equal("v.addProperty('name','alice')");
    });
  });

  describe('.setProperties()', function() {
    it('should set properties', function() {
      var gremlin = new Gremlin(client);
      var vertex = new Vertex(gremlin, 'v');
      vertex.setProperties({
        'foo': 'bar',
        'baz': 'duh'
      });
      vertex.should.have.property('foo', 'bar');
      vertex.should.have.property('baz', 'duh');

      gremlin.script.should.equal('v.setProperties(["foo":"bar","baz":"duh"])');
    });
  });

  describe('.addProperties()', function() {
    it('should add properties', function() {
      var gremlin = new Gremlin(client);
      var vertex = new Vertex(gremlin, 'v');
      vertex.addProperties({
        'foo': 'bar',
        'baz': 'duh'
      });
      vertex.should.have.property('foo', 'bar');
      vertex.should.have.property('baz', 'duh');

      gremlin.script.should.equal('v.addProperties(["foo":"bar","baz":"duh"])');
    });
  });

  describe('.getProperties()', function() {
    it('should return properties', function() {
      var gremlin = new Gremlin(client);
      var vertex = new Vertex(gremlin, 'v');
      vertex.setProperty('name', 'bob');

      var vertexProperties = vertex.getProperties();
      vertexProperties.should.have.property('_type', 'vertex');
      vertexProperties.should.have.property('_id', null);
      vertexProperties.should.have.property('name', 'bob');
    });
  });

  describe('.remove()', function() {
    it('should remove element', function() {
      var gremlin = new Gremlin(client);
      var vertex = new Vertex(gremlin, 'v');

      vertex.remove();
      gremlin.script.should.equal('v.remove()');
    });
  });

  describe('.keys()', function() {
    it("should chain .keys()", function() {
      var gremlin = client.gremlin();
      var g = gremlin.g;

      gremlin.line(g.v(1).keys());
      gremlin.script.should.equal("g.v(1).keys()");
    });
  });

  describe('.values', function() {
    it("should chain .values()", function() {
      var gremlin = client.gremlin();
      var g = gremlin.g;

      gremlin.line(g.v(1).values());
      gremlin.script.should.equal("g.v(1).values()");
    });
  });


});

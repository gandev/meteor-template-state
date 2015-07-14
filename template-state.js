var isMatch = function(object, attrs) {
  var keys = _.keys(attrs);
  var length = keys.length;

  if (object === null) return !length;

  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = keys[i];

    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
};

TemplateState = {
  _templateInstances: {},
  _init: function () {
    var self = this;
    var migrationData = Reload._migrationData('template-reactive-vars');

    _.each(_.keys(Template), function(templateName) {
      var template = Template[templateName];

      if(!(template instanceof Blaze.Template)) return;

      template.onCreated(function () {
        var instance = this;

        if(!self._templateInstances[templateName]) {
          self._templateInstances[templateName] = {};
        }

        instance.__id__ = Random.id();
        self._templateInstances[templateName][instance.__id__] = instance;
      });

      template.onRendered(function () {
        var instance = this;

        var instanceMigrationData = migrationData && migrationData[templateName + (instance.data ? '_' + instance.data._id: '')];
        _.each(instanceMigrationData, function (value, key) {
          if(instance[key] instanceof ReactiveVar) {
            instance[key].set(value);
          }
        });
      });

      template.onDestroyed(function () {
        var instance = this;

        delete self._templateInstances[templateName][instance.__id__];
      });
    });
  },
  lookup: function (template, dataFilter) {
    var self = this;

    var instances;
    if(template instanceof Blaze.Template) {
      instances = self._templateInstances[template.viewName.split('.')[1]];
    } else {
      instances = self._templateInstances[template];
    }

    instances = _.filter(instances, function (instance) {
      return _.isObject(dataFilter) ? isMatch(instance.data, dataFilter): true;
    });

    return instances;
  },
  getMigrationData: function () {
    var self = this;
    var data = {};
    _.each(self._templateInstances, function (instances, name) {
      _.each(instances, function (instance) {
        var instanceIdentifier = name + (instance.data ? '_' + instance.data._id: '');
        data[instanceIdentifier] = {};
        _.each(instance, function (varValue, varName) {
          if(varValue instanceof ReactiveVar) {
            data[instanceIdentifier][varName] = varValue.get();
          }
        });
      });
    });
    return data;
  }
};

Reload._onMigrate('template-reactive-vars', function () {
  return [true, TemplateState.getMigrationData()];
});

Meteor.startup(function() {
  TemplateState._init();
});

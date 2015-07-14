Package.describe({
  name: 'gandev:time-travel',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('templating');
  api.use('reload');
  api.use('reactive-var');

  api.addFiles('time-travel.js', 'client');
  api.addFiles('template-state.js', 'client');

  api.export('TemplateState');

  // api.addFiles('overlay.html', 'client');
  // api.addFiles('overlay.js', 'client');
  // api.addFiles('overlay.css', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('gandev:time-travel');
  api.addFiles('time-travel-tests.js');
});

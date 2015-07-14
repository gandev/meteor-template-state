TODO

- when migration, save reactive-var content on template instances
 1. when more then one instance, try using data._id
 or 2. when only one instance take name as id

- loading
 1. when template gets rendered, set the content of the reactive vars with migrated data

- invalidate state when template gets destroyed


Implications:

- reactive-vars have to be created when template gets created

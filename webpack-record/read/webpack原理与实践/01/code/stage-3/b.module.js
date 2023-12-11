// module-b.js

(function () {
  var name = 'module-b';

  function method1() {
    console.log(name + '#method1');
  }

  window.moduleB = {
    method1: method1,
  };
})();

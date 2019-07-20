const madge = require('madge');
const treeify = require('treeify');
const entry = 'index.js';
const context = 'lib/';

madge(context + entry)
  .then((res) => {
    // console.log(treeify.asTree(res.obj()));
    console.log(res.obj());
  });

  function createDependencyObjecFrom(flat) {

  }

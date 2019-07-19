const madge = require('madge');
const treeify = require('treeify');

madge('lib/index.js')
  .then((res) => {
    // console.log(treeify.asTree(res.obj()));
    console.log(res.obj());
  });

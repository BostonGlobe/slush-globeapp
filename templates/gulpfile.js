require ('babel-register')

const requireDir = require('require-dir');

// Require all tasks in gulp-tasks
requireDir('./gulp-tasks', { recurse: true });

const { src, dest, watch, parallel, task } = require("gulp"),
  browsersync = require("browser-sync").create();
const gulpEsbuild = require("gulp-esbuild");

function taskBuild(done) {
  src("./src/index.jsx")
    .pipe(
      gulpEsbuild({
        outfile: "bundle.js",
        bundle: true,
        platform: "browser",
        define: {
          "process.env.NODE_ENV": "'production'",
        },
      })
    )
    .pipe(dest("./public"));
  done();
}

const taskServer = (done) => {
  browsersync.init({
    server: {
      baseDir: "public/",
      index: "index.html",
    },
    port: 2000,
  });
  done();
};

const taskReload = (done) => {
  browsersync.reload();
  done();
};

const taskWatchPublic = (done) => {
  watch("public/*", { usePolling: true }, taskReload);
  done();
};

const taskWatchSrc = (done) => {
  watch("src/**/*", { usePolling: true }, taskBuild);
  done();
};

exports.dev = parallel(taskServer, taskWatchSrc, taskWatchPublic);

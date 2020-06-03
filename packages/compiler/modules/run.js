const { isNumber, isArray, isDefined } = require('valid-types');
const WebpackDevServer = require('webpack-dev-server');
const log = require('../utils/log');
const sourceCompile = require('../utils/sourceCompile');

const runAppStrategy = (compiler, webpack, webpackConfig, conf) => ({
  simple: () => (
    new Promise((resolve, reject) => {
      compiler.run(async (err, stats) => {
        if (err) {
          return reject(err);
        }
        log(stats);
        if (isDefined(conf.esm) || isDefined(conf.cjs)) {
          // Transpile source
          try {
            await sourceCompile(conf);
          } catch (e) {
            console.error(e.message);
          }
        }
        return resolve(stats);
      });
    })
  ),
  'dev-server': () => {
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);

    server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, () => {
      if (isNumber(conf._liveReloadPort)) {
        console.log(`LiveReload server on http://localhost:${conf._liveReloadPort}`);
      }
      console.log(`Starting server on http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}/`);
    });
  },
  watch: () => {
    compiler.watch({}, (err, stats) => {
      log(stats);
      if (isNumber(conf._liveReloadPort)) {
        console.log(`LiveReload server on http://localhost:${conf._liveReloadPort}`);
      }
    });
  }
});

const runNodeStrategy = (compiler, webpack, webpackConfig, conf) => ({
  simple: () => (
    runAppStrategy(compiler, webpack, webpackConfig, conf).simple()
  ),
  'node-watch': () => {
    compiler.watch({}, (err, stats) => {
      log(stats);
    });
  }
});

const getStrategy = (mode, conf) => {
  if (conf.onlyWatch) {
    return conf.nodejs ? 'node-watch' : 'watch';
  }
  if (mode === 'development') {
    if (conf.nodejs) {
      return 'node-watch';
    }
    return 'dev-server';
  }
  return 'simple';
};

const run = async (webpackConfig, mode, webpack, configs) => {
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;

  if (configs.isomorphicMode) {
    const compiler = webpack(webpackConfig);
    const strategy = getStrategy(mode, {
      nodejs: true
    });
    const runner = runNodeStrategy;
    try {
      const frontConf = configs.find(c => c.__isIsomorphicFrontend);
      await runner(
        compiler,
        webpack,
        webpackConfig,
        {
          _liveReloadPort: frontConf._liveReloadPort
        },
      )[strategy]();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    if (strategy === 'simple') {
      process.exit(0);
    }
  } else {
    const isMultiCompile = isArray(webpackConfig);

    webpackConfig = isMultiCompile ? webpackConfig : [webpackConfig];
    configs = isMultiCompile ? configs : [configs];

    // eslint-disable-next-line no-shadow
    webpackConfig.forEach((webpackConfig, index) => {
      configs[index].strategy = getStrategy(mode, configs[index]);
    });

    const compiler = isMultiCompile ? webpack(webpackConfig) : webpack(webpackConfig[0]);

    for (let i = 0, l = configs.length; i < l; i++) {
      const config = configs[i];
      let compileStrategy;
      const runner = config.nodejs ? runNodeStrategy : runAppStrategy;

      try {
        compileStrategy = runner(
          isMultiCompile ?
            compiler.compilers[i] :
            compiler,
          webpack,
          webpackConfig[i],
          config
        )[config.strategy];

        await compileStrategy();
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }

    if (configs.length === configs.filter(c => c.strategy === 'simple').length) {
      process.exit(0);
    }
  }
};

module.exports = run;

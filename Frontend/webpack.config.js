const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  // other configurations...

  devServer: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    // if using proxy middleware, add your proxy settings here
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use(
        '/api',
        createProxyMiddleware({
          target: 'http://localhost:5000',
          changeOrigin: true,
        })
      );
      return middlewares;
    },
  },
};

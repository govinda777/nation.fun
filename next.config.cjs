/** @type {import('next').NextConfig} */
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const nextConfig = {
  reactStrictMode: true,

  webpack: (config, options) => {
    const { isServer } = options;

    config.plugins.push(
      new NextFederationPlugin({
        name: 'nationfun',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './AgentDashboard': './components/microfrontend/AgentDashboard',
          './AgentList': './components/microfrontend/AgentList',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
            eager: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
            eager: false,
          },
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;

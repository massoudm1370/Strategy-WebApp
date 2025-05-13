// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove source-map-loader for react-datepicker
      webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
        if (rule.use && rule.use.some(u => u.loader && u.loader.includes("source-map-loader"))) {
          return {
            ...rule,
            include: rule.include.filter(item => !item.includes("react-datepicker"))
          };
        }
        return rule;
      });
      return webpackConfig;
    }
  }
};
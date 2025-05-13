// config-overrides.js
module.exports = function override(config, env) {
  // Exclude source map parsing for react-datepicker
  const scopePluginIndex = config.resolve.plugins.findIndex(
    (plugin) => plugin && plugin.constructor && plugin.constructor.name === "ModuleScopePlugin"
  );

  if (scopePluginIndex !== -1) {
    config.resolve.plugins.splice(scopePluginIndex, 1);
  }

  // Remove source-map-loader for react-datepicker
  config.module.rules = config.module.rules.map(rule => {
    if (rule.use && rule.use.some(u => u.loader && u.loader.includes("source-map-loader"))) {
      return {
        ...rule,
        include: rule.include.filter(item => !item.includes("react-datepicker"))
      };
    }
    return rule;
  });

  return config;
};
module.exports = {
  "stories": [
    "../src/stories/*.stories.@(js|jsx|ts|tsx)",
    "../src/stories/public/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  "typescript": {
    "reactDocgen": false
  },
  "babel": async (options) => ({
    ...options,
    presets: [
      ...(options.presets || []),
      "@babel/preset-typescript"
    ]
  })
}

module.exports = {
  "staticDirs": ["./assets"],
  "stories": [
    "../src/stories/*.stories.@(js|jsx|ts|tsx)",
    "../src/stories/public/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-webpack5-compiler-swc"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  "typescript": {
    "reactDocgen": false
  },
}

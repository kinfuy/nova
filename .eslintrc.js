module.exports = {
  extends: ["@alqmc/eslint-config"],
  rules: {
    "arrow-parens": "off",
    "import/no-extraneous-dependencies": ["error", {"peerDependencies":false,"packageDir":["./"]}]
  },
};

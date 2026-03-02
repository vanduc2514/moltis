import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../schema/schema.graphqls",
  documents: "../operations/**/*.graphql",
  generates: {
    "./src/generated/": {
      preset: "client",
      plugins: []
    }
  },
  ignoreNoDocuments: false
};

export default config;

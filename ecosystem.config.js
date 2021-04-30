module.exports = {
  apps : [
      {
        name: "Chatbot Server",
        script: "./init.ts",
        instance_var: 'INSTANCE_ID',
        env: {
          "NODE_ENV": "development",
		  "NODE_CONFIG_DIR":"./configs/app"
        }
      }
  ]
}
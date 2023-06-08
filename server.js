const http = require("http")
process.env.NODE_ENV = "production"

http
   .createServer((req, res) => {
      res.write("I'm alive")
      res.end()
   })
   .listen(9000)

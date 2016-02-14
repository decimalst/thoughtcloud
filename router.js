//this is going to create a router object to handle all them routes
module.exports = (server) => {
  return {
    routes: [{}],
    on: (method, route, func) => {

      this.routes.push({method:method,route:route,func:func});

      server.on("request", (req,resp)=>{
        var res = routes.reduce((prev,cur)=>{
          return (prev)||(cur.method==method&&cur.route==route)?cur.func:false;
        },false);
        if(res){
          res(req,resp);
        }
        else{
          resp.statusCode = 404;
          resp.end();
        }
      })
    }
  };
}

import proxy from "express-http-proxy";

const proxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    limit: "10mb",
    proxyReqOptDecorator(proxyReqOpts, srcReq) {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts 
    },
  });
};

export default proxyWithHeader;
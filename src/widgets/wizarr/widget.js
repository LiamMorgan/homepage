import credentialedProxyHandler from "utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/api/{endpoint}",
  proxyHandler: credentialedProxyHandler,

  mappings: {
    invites: {
      endpoint: "invitations"
    },
    accepted: {
      endpoint: "users"
    },
    expired: {
      endpoint: "invitations"
    }
  },
};

export default widget;

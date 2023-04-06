export const OAuthSettings = {
  // appId: '49d594d3-2b7c-4a1d-8635-bfc346ae1d0c', //Live
  // appId: '0117c931-07a7-4128-9d94-e4f3e44d114d', //Success
  appId: '5e61d7cb-d428-4f70-8e93-d34c02e70dea', //OP
  //  appId: 'd7cb1b0a-0688-479a-8b8c-63b4caa32fd9', //new (10/07/2021)
  //appId: 'e552bc2b-6d78-40a9-8170-c7dfe45a4f91', //new2 (10/07/2021)

  //redirectUri: 'http://localhost:8100',
  redirectUri: 'https://helloangularop.azurewebsites.net/',
  scopes: [
    "user.read",
  ],
  // prompt: 'consent',
  // tenantId: 'ab6d6a8a-83ea-4650-a631-5cb43442842b', //Live
  // tenantId: '6e3beb6c-aa4d-4787-a9ad-516eec22feee', //Success
  tenantId:'7ebe2378-d14c-4989-95ae-7dfa7e5a0bdf' //OP
  //tenantId: '93ae5c68-ee3f-4f62-b574-e2efbd7077fa', //new (10/07/2021)
};

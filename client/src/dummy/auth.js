const authInfo = {
  id: 1,
  username: "admin",
  role: "admin",
  permissions: { 
    dashboard: ["view"],
    documents: ["upload document", "edit file", "import website", "archive document"], 
  },
  token: "token",
  refreshToken: "refreshToken",
  expiresAt: new Date().getTime() + 3600000,
};

export default authInfo;

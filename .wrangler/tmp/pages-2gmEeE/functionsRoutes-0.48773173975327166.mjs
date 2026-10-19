import { onRequestPost as __api_form_js_onRequestPost } from "/home/claude/fackt-site/functions/api/form.js"
import { onRequest as __api_auth_js_onRequest } from "/home/claude/fackt-site/functions/api/auth.js"
import { onRequest as __api_callback_js_onRequest } from "/home/claude/fackt-site/functions/api/callback.js"

export const routes = [
    {
      routePath: "/api/form",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_form_js_onRequestPost],
    },
  {
      routePath: "/api/auth",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_auth_js_onRequest],
    },
  {
      routePath: "/api/callback",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_callback_js_onRequest],
    },
  ]
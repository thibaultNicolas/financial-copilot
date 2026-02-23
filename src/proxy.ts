import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const proxy = createMiddleware(routing);

export default proxy;
export { proxy };

export const config = {
  // Match all pathnames except api, _next, _vercel, and static files
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

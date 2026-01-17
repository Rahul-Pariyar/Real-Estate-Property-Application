import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";

const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes,
  ...userRoutes,
]);

export default router;

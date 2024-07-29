

// import '../src/assets/frontend/fonts/fontawesome/css/all.min.css';
// import '../src/assets/frontend/styles/bootstrap.css';
// import '../src/assets/frontend/styles/ui.css';
// import '../src/assets/frontend/styles/responsive.css';

import { Route, Router, Routes } from "react-router-dom";
import LayoutSite from "./layouts/LayoutSite";
import RouterSite from "./router";
// import LayoutAdmin from './layouts/LayoutAdmin';
import AuthProvider from "./component/Provider/AuthProvider";
import { ProtectedRoute } from "./component/Provider/ProtectedRoute";
import LoginAdmin from "./pages/backend/LoginAdmin";
import LayoutAdmin2 from "./layouts/LayoutAdmin2";

// import '../src/assets/backend/plugins/fontawesome-free/css/all.min.css';
// import '../src/assets/backend/dist/css/adminlte.min.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LayoutSite />}>
          {RouterSite.RouterPublic.map(function (router, index) {
            const Page = router.component;
            return (
              <Route key={index} path={router.path} element={<Page />} />
            )
          })
          }
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute><LayoutAdmin2 /></ProtectedRoute>
          // <LayoutAdmin2 />
        }>
          {RouterSite.RouterPrivate.map(function (router, index) {
            const Page = router.component;
            return (
              <Route key={index} path={router.path} element={<Page />} />
            )
          })
          }
        </Route>
        <Route path="/admin-login" element={<LoginAdmin />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

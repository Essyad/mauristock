import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./fonts.css";
import "./global.css";

// Material Kit theme
import theme from "./assets/theme";

// Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./components/admin/ProductManagement";
import CategoryManagement from "./components/admin/CategoryManagement";
import CompanyManagement from "./components/admin/CompanyManagement";
import SubcategoryManagement from "./components/admin/SubcategoryManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import DiscountManagement from "components/admin/DiscountManagement";
import CategoriesList from "components/user/components/CategoriesList";
import Header from "components/user/components/Header";
import Footer from "components/user/components/Footer";
import CategoryDetail from "components/user/components/CategoryDetail";
import SearchResults from "components/user/pages/SearchResults";
import Promotions from "components/user/pages/Promotions";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {pathname.startsWith("/admin") ? null : <Header />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<CategoriesList />} />
          <Route path="/categories/:categoryId" element={<CategoryDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/promotions" element={<Promotions />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="subcategories" element={<SubcategoryManagement />} />
            <Route path="companies" element={<CompanyManagement />} />
            <Route path="discounts" element={<DiscountManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {pathname.startsWith("/admin") ? null : <Footer />}

      </ThemeProvider>
    </StyledEngineProvider>
  );
}

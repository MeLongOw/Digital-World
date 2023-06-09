import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import {
    Login,
    Home,
    Public,
    DetailProduct,
    FAQs,
    Products,
    Services,
    Blogs,
    AuthRegister,
    ResetPassword,
    WishList,
    Cart,
} from "./pages/public";

import {
    Admin,
    Dashboard,
    Products as ProductsAdmin,
    Brands,
    Categories,
    Orders,
    Ratings as RatingsAdmin,
    Coupons,
} from "./pages/private";
import { getCategories } from "./store/app/asyncThunk";
import path from "./utils/path";
import {
    Account,
    Profile,
    Ratings,
    Orders as ProfileOrders,
} from "./pages/public/Account";
import User from "./pages/private/Users";
import Checkout from "./pages/public/Checkout";
import { getCurrent } from "./store/user/asyncThunk";

function App() {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.app.categories);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const token = useSelector((state) => state.user.token);
    const { decodedToken, isExpired } = useJwt(token);

    useEffect(() => {
        dispatch(getCategories());
    }, []);

    useEffect(() => {
        dispatch(getCurrent(token));
    }, [token, dispatch]);


    return (
        <div className="min-h-screen font-main">
            <Routes>
                {/* CLIENT */}
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.FAQs} element={<FAQs />} />
                    <Route
                        path={`/${path.DETAIL_PRODUCT__SLUG}`}
                        element={<DetailProduct />}
                    />
                    <Route path={path.PRODUCTS} element={<Products />}>
                        {categories?.map((cate, index) => (
                            <Route
                                key={index}
                                path={`/${path.PRODUCTS}/${cate.title}`}
                                element={<Products />}
                            />
                        ))}
                    </Route>
                    <Route path={path.BLOGS} element={<Blogs />} />
                    <Route path={path.SERVICES} element={<Services />} />
                    <Route path={path.WISHLIST} element={<WishList />} />
                    <Route path={path.CART} element={<Cart />} />
                    <Route path={`/${path.CHECKOUT}`} element={<Checkout />} />

                    <Route path={path.ACCOUNT} element={<Account />}>
                        <Route
                            path={`/${path.ACCOUNT_PROFILE}`}
                            element={<Profile />}
                        />
                        <Route
                            path={`/${path.ACCOUNT_ORDERS}`}
                            element={<ProfileOrders />}
                        />
                        <Route
                            path={`/${path.ACCOUNT_RATINGS}`}
                            element={<Ratings />}
                        />
                    </Route>
                </Route>
                <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
                <Route path={path.AUTH_REGISTER} element={<AuthRegister />} />
                {!isLoggedIn && <Route path={path.LOGIN} element={<Login />} />}

                {/* ADMIN */}
                {isLoggedIn && decodedToken?.role === "admin" && !isExpired && (
                    <Route path={`/${path.ADMIN}`} element={<Admin />}>
                        <Route
                            path={`/${path.DASHBOARD}`}
                            element={<Dashboard />}
                        />
                        <Route
                            path={`/${path.PRODUCTS_ADMIN}`}
                            element={<ProductsAdmin />}
                        />
                        <Route path={`/${path.BRANDS}`} element={<Brands />} />
                        <Route path={`/${path.USERS}`} element={<User />} />
                        <Route
                            path={`/${path.CATEGOGIES}`}
                            element={<Categories />}
                        />
                        <Route path={`/${path.ORDERS}`} element={<Orders />} />
                        <Route
                            path={`/${path.RATINGS}`}
                            element={<RatingsAdmin />}
                        />
                        <Route
                            path={`/${path.COUPONS}`}
                            element={<Coupons />}
                        />
                    </Route>
                )}
            </Routes>
        </div>
    );
}

export default App;

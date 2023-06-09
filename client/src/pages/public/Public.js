import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Navigation, TopHeader, Footer } from "../../components";
import BreadCrumb from "../../components/BreadCrumb";
import Cart from "../../components/Cart";
import MoveTopButton from "../../components/MoveTopButton";
import { app } from "../../firebase/config";
import { appSlice } from "../../store/app/appSlice";
import { getCurrent } from "../../store/user/asyncThunk";

const Public = () => {
    const { pathname } = useLocation();
    const { isShowCart, isIconCardClick } = useSelector((state) => state.app);
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();

    const handleToggleCart = () => {
        dispatch(appSlice.actions.toggleCart());
    };
    useEffect(() => {
        dispatch(getCurrent(token));
        return () => {
            dispatch(appSlice.actions.setisIconCartClickFalse());
        };
    }, []);

    return (
        <div className={`flex`}>
            <div
                className={`w-full flex relative flex-col items-center ${
                    isIconCardClick
                        ? isShowCart
                            ? "right[0px] animate-slide-left"
                            : "right-[375px] animate-slide-right"
                        : ""
                }`}
            >
                <TopHeader />
                <Header />
                <Navigation />
                <div className="max-w-main max-xl:px-3 w-full">
                    <BreadCrumb pathname={pathname} />
                    <div className="w-full mt-6">
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </div>
            <MoveTopButton />
            {isShowCart && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 bg-modal"
                    onClick={handleToggleCart}
                ></div>
            )}
            <div
                className={`w-[375px] flex-shirnk-0 h-screen fixed bg-gray-950 ${
                    isIconCardClick
                        ? isShowCart
                            ? "right-[-375px]  animate-slide-left"
                            : " right-[0] animate-slide-right"
                        : "right-[-375px]"
                } `}
            >
                <Cart />
            </div>
        </div>
    );
};

export default Public;

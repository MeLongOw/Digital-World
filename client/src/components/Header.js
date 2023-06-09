import React, { memo, useEffect, useRef, useState } from "react";
import { useJwt } from "react-jwt";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiLogout } from "../apis";
import logo from "../assets/logo.png";
import { appSlice } from "../store/app/appSlice";
import { userSlice } from "../store/user/userSlice";
import icons from "../utils/icons";
import path from "../utils/path";
import Button from "./Button";

const { AiFillPhone, MdEmail, BsFillBagFill, FaUserCircle } = icons;

const Header = () => {
    const [isClickAvatar, setIsClickAvatar] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const iconMenuRef = useRef(null);
    const token = useSelector((state) => state.user.token);
    const { decodedToken, isExpired } = useJwt(token);
    const isIconCardClick = useSelector((state) => state.app.isIconCardClick);
    const currentUser = useSelector((state) => state.user.current);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const handleToggleCart = () => {
        dispatch(appSlice.actions.toggleCart());
        if (!isIconCardClick) {
            dispatch(appSlice.actions.setisIconCartClickTrue());
        }
    };
    const handleToggleMenu = () => {
        setIsClickAvatar(!isClickAvatar);
    };

    const handleLogout = async () => {
        handleToggleMenu();
        const response = await apiLogout();
        if (response?.success) {
            dispatch(userSlice.actions.logout());
            Swal.fire("Success!", response.mes, "success");
        }
    };

    const handleClickOutsideMenu = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            if (!iconMenuRef.current.contains(event.target))
                setIsClickAvatar(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideMenu);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideMenu);
        };
    }, []);

    return (
        <div className=" max-w-main max-xl:px-3 w-full flex justify-between h-[110px] py-[35px]">
            <Link to={`/${path.HOME}`} className="flex items-center">
                <img
                    src={logo}
                    alt="logo"
                    className="w-[234px] object-contain"
                />
            </Link>

            <div className="flex text-[13px]">
                <div className="flex flex-col items-center px-6 border-r max-lg:hidden">
                    <span className="flex gap-4 items-center">
                        <AiFillPhone color="red" />
                        <span className="font-semibold">
                            (+84) 0906 243 XXX
                        </span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>

                <div className="flex flex-col items-center px-6 border-r max-md:hidden">
                    <span className="flex gap-4 items-center">
                        <MdEmail color="red" />
                        <span className="font-semibold">
                            long.huynh200899@gmail.com
                        </span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>

                <div
                    className="flex items-center justify-center gap-2 px-6 max-md:px-3 max-md:ml-3 border-r hover:text-main hover:cursor-pointer flex-wrap"
                    onClick={handleToggleCart}
                >
                    <BsFillBagFill color="red" size={20} />
                    <span className="text-sm">
                        {currentUser?.cart?.length > 1
                            ? `${currentUser?.cart?.length} items`
                            : `${currentUser?.cart?.length || "0"} item`}
                    </span>
                </div>

                <div className="flex relative items-center justify-center px-6 max-md:px-3 text-sm">
                    <div ref={iconMenuRef}>
                        {isLoggedIn ? (
                            <FaUserCircle
                                size={30}
                                className="cursor-pointer"
                                onClick={handleToggleMenu}
                            />
                        ) : (
                            <Button
                                name="Log in"
                                rounded
                                handleClick={() => {
                                    navigate(`/login`);
                                }}
                            />
                        )}
                    </div>

                    <div
                        ref={menuRef}
                        className={`absolute top-[48px] right-[8px] bg-white text-gray-700 shadow-xl rounded-md border w-[160px] overflow-hidden ${
                            !isClickAvatar && "hidden"
                        }`}
                    >
                        <Link
                            className="p-3  border-b border-gray-300 hover:bg-gray-100 flex"
                            onClick={handleToggleMenu}
                            to={`/${path.ACCOUNT_PROFILE}`}
                            state={"profile"}
                        >
                            My Account
                        </Link>
                        <Link
                            to={`${path.WISHLIST}`}
                            className="p-3 border-b border-gray-300 hover:bg-gray-100 flex"
                            onClick={handleToggleMenu}
                        >
                            Wish List
                        </Link>
                        {isLoggedIn &&
                            decodedToken?.role === "admin" &&
                            !isExpired && (
                                <Link
                                    to={`/${path.ADMIN}`}
                                    className="p-3 border-b border-gray-300 hover:bg-gray-100 flex font-semibold"
                                    onClick={handleToggleMenu}
                                >
                                    Go To Admin
                                </Link>
                            )}
                        <div
                            className="text-main  p-3 hover:bg-gray-100 flex hover:cursor-pointer"
                            onClick={handleLogout}
                        >
                            Log Out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Header);

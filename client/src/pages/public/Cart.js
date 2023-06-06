import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRemoveFromCart, apiUpdateCart } from "../../apis";
import { Button } from "../../components";
import { capitalize, formatMoney } from "../../utils/helpers";
import emptyCart from "../../assets/empty-cart.png";
import path from "../../utils/path";
import icons from "../../utils/icons";
import InputNumberCart from "../../components/InputNumberCart";
import { getCurrent } from "../../store/user/asyncThunk";
import { userSlice } from "../../store/user/userSlice";

const { AiOutlineArrowRight } = icons;

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.user.token);
    const currentUser = useSelector((state) => state.user.current);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    const totalPrice = useMemo(() => {
        const arrPrice = isCheck?.map(
            (item) => item.product?.price * item.quantity
        );
        const totalPrice = arrPrice?.reduce(
            (total, currentValue) => total + +currentValue,
            0
        );
        return totalPrice;
    }, [isCheck]);

    const fetchCurrent = () => {
        dispatch(getCurrent(token));
    };

    const handleRemoveFromCart = async (cid) => {
        const response = await apiRemoveFromCart(token, { cid });
        if (response.success) {
            fetchCurrent();
        }
    };

    const handleUpdateCart = async (pid, quantity, variant) => {
        const response = await apiUpdateCart(token, { pid, quantity, variant });
        if (response?.success) {
            fetchCurrent();
        }
    };

    const handleClickCheckBox = (item) => {
        if (isCheck.includes(item)) {
            setIsCheck(isCheck.filter((el) => el !== item));
        } else {
            setIsCheck([...isCheck, item]);
        }
    };

    const handleSelectAll = (e) => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(currentUser.cart?.map((item) => item));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    useEffect(() => {
        if (currentUser?.cart?.length === isCheck?.length) {
            setIsCheckAll(true);
        } else {
            setIsCheckAll(false);
        }
    }, [isCheck, currentUser]);

    useEffect(() => {
        fetchCurrent();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div className="flex border p-5 text-lg text-gray-800 font-semibold">
                <div className="flex flex-6 items-center">
                    <div className="flex items-center">
                        <input
                            id="checkbox-all"
                            type="checkbox"
                            className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                            onChange={handleSelectAll}
                            checked={isCheckAll}
                        />
                        <label htmlFor="checkbox" className="sr-only">
                            Checkbox
                        </label>
                    </div>
                </div>
                <div className="flex flex-4">
                    <div className="flex-1 text-center">QUANTITY</div>
                    <div className="flex-3 text-end">TOTAL</div>
                </div>
            </div>
            {currentUser?.cart?.length ? (
                currentUser?.cart?.map((item) => (
                    <div className="border p-5 mt-[-1px] flex" key={item._id}>
                        <div className="flex flex-6 items-center">
                            <div className="flex items-center">
                                <input
                                    id="checkbox-all"
                                    type="checkbox"
                                    className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                                    checked={isCheck.includes(item)}
                                    onChange={() => handleClickCheckBox(item)}
                                />
                                <label htmlFor="checkbox" className="sr-only">
                                    Checkbox
                                </label>
                            </div>
                            <img
                                src={item.product?.thumb}
                                alt=""
                                className="h-[214px] w-[214px] object-contain pr-5"
                            />
                            <div className="p-5 flex flex-col ">
                                <Link
                                    to={`/${path.DETAIL_PRODUCT}/${item.product?.slug}`}
                                    className="font-base capitalize hover:text-main"
                                >
                                    {item.product?.title &&
                                        capitalize(item.product?.title)}
                                </Link>
                                <span className="text-xs">
                                    {item?.variant
                                        .map(({ variant }) => variant)
                                        .join(" / ")}
                                </span>
                                <span
                                    className="text-main hover:cursor-pointer mt-2 text-sm"
                                    onClick={() => {
                                        handleRemoveFromCart(item._id);
                                    }}
                                >
                                    remove
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-4 items-center">
                            <div className="flex-1 flex justify-center">
                                <InputNumberCart
                                    number={item.quantity}
                                    handleUpdateCart={(quantity) => {
                                        handleUpdateCart(
                                            item.product._id,
                                            quantity,
                                            item.variant
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex-3 flex justify-end text-lg text-gray-800 font-semibold">
                                {formatMoney(item.product?.price)} VND
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="border p-5 mt-[-1px] flex justify-center items-center">
                    <img
                        className="w-[300px] object-contain"
                        alt="emptycart"
                        src={emptyCart}
                    />
                </div>
            )}

            <div className="border p-5 mb-10 mt-[-1px] flex flex-col items-end">
                <div className="flex items-center w-[40%] mb-[10px]">
                    <p className="flex-1 text-center text-sm text-gray-600">
                        Subtotal
                    </p>
                    <div className="flex-1 text-end text-xl text-gray-800 font-semibold line-clamp-2">
                        {formatMoney(totalPrice) || "0"} VND
                    </div>
                    <div></div>
                </div>
                <i className="text-sm text-gray-600 mb-[10px]">
                    Shipping, and discounts calculated at checkout.
                </i>
                <div className="flex gap-3">
                    <div className="w-[180px]">
                        <Button
                            name="CHECK OUT"
                            iconsAfter={<AiOutlineArrowRight />}
                            handleClick={() => {
                                if (isCheck?.length) {
                                    navigate(`/${path.CHECKOUT}`, {
                                        state: { selectedProducts: isCheck },
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

import React, { memo, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { apiGetProducts } from "../../apis";
import { Product } from "../../components";
import Filter from "../../components/Filter";
import Pagination from "../../components/Pagination";
import SortBy from "../../components/SortBy";
import noProductFoundImg from "../../assets/no-product.jpg";
import icons from "../../utils/icons";

const { AiOutlineLoading } = icons;

const Products = () => {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [limitItem, setLimitItem] = useState(12);
    const [sort, setSort] = useState("-createdAt");
    const [priceFilter, setPriceFilter] = useState("");
    const [brandFilter, setbrandFilter] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = async (page, limit, pathname, sort) => {
        const arrLocation = pathname.split("/");
        let category;
        if (arrLocation[1] === "products") {
            category = arrLocation[2];
        }
        setIsLoading(true);
        const response = await apiGetProducts({
            sort,
            limit,
            page,
            category,
            price: priceFilter,
            brand: brandFilter,
        });
        if (response) setIsLoading(false);
        if (response.success) {
            setProducts(response.products);
            setTotalItem(response.counts);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        for (const entry of searchParams.entries()) {
            const [param, value] = entry;
            if (param === "page") setCurrentPage(+value || 1);
            if (param === "limit") setLimitItem(+value || 12);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts(currentPage, limitItem, pathname, sort);
    }, [currentPage, limitItem, pathname, sort, priceFilter, brandFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sort, priceFilter]);

    useEffect(() => {
        if (!totalItem) setCurrentPage(1);
    }, [totalItem]);

    return (
        <div>
            <div className="my-[15px] p-[10px] min-h-[108px] border flex items-center font-semibold text-sm text-gray-600 flex-wrap">
                <div className="w-4/5 flex flex-col flex-wrap max-md:w-full">
                    <p className="mb-[10px]">Fillter by</p>
                    <Filter
                        setBrandFilter={setbrandFilter}
                        setPriceFilter={setPriceFilter}
                    />
                </div>
                <div className="w-1/5 max-md:w-full ">
                    <p className="max-md:mt-3 mb-[10px]">Sort by</p>
                    <SortBy setValue={setSort} />
                </div>
            </div>

            <div className="flex w-full flex-wrap mx-[-10px] ">
                {products?.length ? (
                    products?.map((data) => (
                        <div
                            className="w-1/4 max-lg:w-1/3 max-md:w-1/2 max-sm:w-full mb-5"
                            key={data._id}
                        >
                            <Product productData={data} isHasLabel={false} />
                        </div>
                    ))
                ) : !isLoading ? (
                    <div className="w-full flex justify-center items-center">
                        <img
                            className="w-[1000px] object-contain"
                            alt="no-product-found"
                            src={noProductFoundImg}
                        />
                    </div>
                ) : (
                    <div className="flex w-full h-[50vh] justify-center items-center ml-[10px]">
                        <span className="flex items-center">
                            <AiOutlineLoading
                                size={20}
                                className="animate-spin"
                            />
                        </span>
                        <span className="ml-3 text-lg">
                            Loading products...
                        </span>
                    </div>
                )}
            </div>

            {!!products?.length && (
                <div className="my-10 flex justify-center">
                    <Pagination
                        totalItem={totalItem}
                        currentPage={currentPage}
                        limitItem={limitItem}
                        onChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default memo(Products);

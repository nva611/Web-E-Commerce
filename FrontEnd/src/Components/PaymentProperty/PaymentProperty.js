import { ArrowDown2, Back, Crown, MessageText1, Shop } from "iconsax-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { StoreContext } from "../../context/StoreContext";
import "./paymentProperty.scss";
import axios from "./../../hooks/axios";
import { toast } from "react-toastify";

const PaymentProperty = () => {
    const { user, dispatch } = useContext(AuthContext);

    const { state, contextDispatch } = useContext(StoreContext);
    const {
        cart: { cartItems, shopItems },
    } = state;
    const [userDetail, setUserDetail] = useState();
    const [products, setProducts] = useState([]);
    const [shops, setShops] = useState([]);
    const [deliveryIndex, setDeliveryIndex] = useState(0);
    const [deliveryTempIndex, setDeliveryTempIndex] = useState();
    const [notes, setNotes] = useState([]);
    const [open, setOpen] = useState(false);
    const [shippingShops, setShippingShops] = useState([]);
    const navigate = useNavigate();
    const handleBack = () => {
        navigate("/cart");
    };
    useEffect(() => {
        setProducts([]);
        cartItems.forEach(async (element) => {
            const { data } = await axios.get(`/products/${element._id}`);
            setProducts((preProducts) => [
                ...preProducts,
                {
                    ...data,
                    classifyProduct: element.classifyProduct,
                    quantityProduct: element.quantityProduct,
                    price: element.price,
                    sizeProduct: element.sizeProduct,
                    indexItem: element.indexItem,
                },
            ]);
        });
    }, [cartItems]);
    useEffect(() => {
        setShops([]);
        shopItems.forEach(async (element) => {
            const { data } = await axios.get(`/shops/shop/${element._id}`);
            setShops((pre) => [...pre, data]);
        });
    }, [shopItems]);
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/users/${user._id}`);
            setUserDetail(data);
        };
        fetchData();
    }, [user]);
    useEffect(() => {
        if (userDetail) {
            setShippingShops([]);
            shops.forEach(async (element) => {
                const { data } = await axios.get(
                    `/shippingCost/cost?start=${element.addressInfo.distinct}&end=${userDetail.deliveryInfo[deliveryIndex].distinct}`
                );

                setShippingShops((pre) => [
                    ...pre,
                    ...data.map((d) => {
                        return {
                            _id: element._id,
                            cost: d.cost,
                            addressInfo: element.addressInfo,
                        };
                    }),
                ]);
            });
        }
    }, [deliveryIndex, shops, userDetail]);
    const gotoShop = (id) => {
        navigate(`/shop/${id}`);
    };
    const checkoutHandler = async () => {
        try {
            let successPayment = 1;
            let index = 0;
            for (const shopItem of shopItems) {
                const dataItems = cartItems.filter(
                    (item) => item.shopID === shopItem._id
                );
                const cost = dataItems.reduce(
                    (accumulate, currentValue) =>
                        accumulate +
                        currentValue.price * currentValue.quantityProduct,
                    0
                );
                const ship = shippingShops.find(
                    (ship) => ship._id === shopItem._id
                );
                const data = {
                    productItems: dataItems,
                    shop: shopItem._id,
                    user: user._id,
                    deliveryInfo: userDetail.deliveryInfo[deliveryIndex],
                    totalCost: cost,
                    shipCost: ship.cost,
                    status: "waiting",
                    note: notes[index],
                };
                if (userDetail.ruby < cost + ship.cost) {
                    successPayment = 0;
                } else {
                    await axios.post("/checkouts", data);
                    user.ruby = user.ruby - (cost + ship.cost);
                    dispatch({ type: "USER_RELOAD", payload: user });
                }
                ++index;
            }
            // shopItems.forEach(async (shopItem, index) => {
            //     const dataItems = cartItems.filter(
            //         (item) => item.shopID === shopItem._id
            //     );
            //     const cost = dataItems.reduce(
            //         (accumulate, currentValue) =>
            //             accumulate +
            //             currentValue.price * currentValue.quantityProduct,
            //         0
            //     );
            //     const ship = shippingShops.find(
            //         (ship) => ship._id === shopItem._id
            //     );
            //     const data = {
            //         productItems: dataItems,
            //         shop: shopItem._id,
            //         user: user._id,
            //         deliveryInfo: userDetail.deliveryInfo[deliveryIndex],
            //         totalCost: cost,
            //         shipCost: ship.cost,
            //         status: "waiting",
            //         note: notes[index],
            //     };
            //     if (userDetail.ruby < cost + ship.cost) {
            //         successPayment = 0;
            //     } else {
            //         await axios.post("/checkouts", data);
            //         user.ruby = user.ruby - (cost + ship.cost);
            //         dispatch({ type: "USER_RELOAD", payload: user });
            //     }
            // });
            if (successPayment) {
                contextDispatch({ type: "CART_CLEAR" });
                contextDispatch({ type: "SHOP_CLEAR" });

                toast.success(
                    "Thanh to??n th??nh c??ng, b???n s??? ???????c chuy???n v??? trang ch??? sau v??i gi??y"
                );

                window.setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                throw new Error(
                    "B???n kh??ng ????? ti???n ????? thanh to??n! Vui l??ng n???p th??m s??? d?? ????? c?? th??? ti???p t???c mua s???m!"
                );
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        userDetail && (
            <div className="paymentProperty">
                <div className="paymentProperty-container">
                    <div className="PaymentProperty-content">
                        <div className="paymentProperty-address">
                            <div className="paymentProperty-addressTitle">
                                <span>
                                    Th??ng tin ng?????i nh???n v?? ?????a ch??? nh???n h??ng
                                </span>
                                <span onClick={() => setOpen(true)}>
                                    Thay ?????i
                                </span>
                            </div>
                            <div className="paymentProperty-addressInfo">
                                <span>
                                    H??? v?? t??n:{" "}
                                    {
                                        userDetail.deliveryInfo[deliveryIndex]
                                            .fullName
                                    }
                                </span>
                                <span>
                                    S??? ??i???n tho???i:{" "}
                                    {
                                        userDetail.deliveryInfo[deliveryIndex]
                                            .phoneNumber
                                    }
                                </span>
                                <span>
                                    ?????a ch???:{" "}
                                    {
                                        userDetail.deliveryInfo[deliveryIndex]
                                            .address
                                    }
                                    ,{" "}
                                    {
                                        userDetail.deliveryInfo[deliveryIndex]
                                            .ward
                                    }
                                    ,{" "}
                                    {
                                        userDetail.deliveryInfo[deliveryIndex]
                                            .distinct
                                    }
                                    ,{" "}
                                    {
                                        userDetail.deliveryInfo[deliveryIndex]
                                            .province
                                    }
                                </span>
                            </div>
                        </div>
                        {shops.map((shop, index) => (
                            <div
                                className="paymentProperty-product"
                                key={shop._id}
                            >
                                <div className="paymentProperty-productBrand">
                                    <span>{shop.name}</span>
                                    <button onClick={() => gotoShop(shop._id)}>
                                        <Shop />
                                        Tham quan
                                    </button>
                                </div>
                                {products
                                    .filter(
                                        (product) =>
                                            product.shop._id === shop._id
                                    )
                                    .map((product) => (
                                        <div
                                            className="paymentProperty-productBox"
                                            key={product._id}
                                        >
                                            <img
                                                src={product.imgPath[0]}
                                                alt="productImg"
                                            />
                                            <div className="paymentProperty-productProperty">
                                                <div className="paymentProperty-productContent">
                                                    <span>{product.name}</span>
                                                    <div className="paymentProperty-productQuantity">
                                                        <div className="paymentProperty-productCount">
                                                            <span>
                                                                S??? l?????ng
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    product.quantityProduct
                                                                }
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="paymentProperty-moneySum">
                                                            <span>
                                                                Gi?? ti???n
                                                            </span>
                                                            <span>
                                                                {product.price}
                                                                <Crown variant="Bold" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <span>
                                                    Ph??n lo???i:{" "}
                                                    {product.classifyProduct}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                <textarea
                                    placeholder="L??u ?? cho ng?????i b??n h??ng"
                                    value={notes[index]}
                                    onChange={(e) =>
                                        setNotes((pre) => {
                                            notes[index] = e.target.value;
                                            return notes;
                                        })
                                    }
                                />
                                <span>
                                    V???n chuy???n t???:{" "}
                                    {shippingShops[index]?.addressInfo.address},{" "}
                                    {shippingShops[index]?.addressInfo.ward},{" "}
                                    {shippingShops[index]?.addressInfo.distinct}
                                    ,{" "}
                                    {shippingShops[index]?.addressInfo.province}{" "}
                                </span>
                                <span>
                                    Ph?? v???n chuy???n :{" "}
                                    {shippingShops[index]?.cost}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="paymentProperty-comfirm">
                        <div className="paymentProperty-confirmItem">
                            <span>T???ng ti???n h??ng</span>
                            <span>
                                {cartItems.reduce(
                                    (accumulate, currentValue) =>
                                        accumulate +
                                        currentValue.price *
                                            currentValue.quantityProduct,
                                    0
                                )}
                                <Crown variant="Bold" />
                            </span>
                        </div>
                        <div className="paymentProperty-confirmItem">
                            <span>T???ng s??? l?????ng</span>
                            <span>
                                {cartItems.reduce(
                                    (accumulate, currentValue) =>
                                        accumulate +
                                        currentValue.quantityProduct,
                                    0
                                )}
                            </span>
                        </div>
                        <div className="paymentProperty-confirmItem">
                            <span>T???ng ph?? v???n chuy???n</span>
                            <span>
                                {shippingShops.reduce(
                                    (accumulate, currentValue) =>
                                        accumulate + currentValue.cost,
                                    0
                                )}{" "}
                                <Crown variant="Bold" />
                            </span>
                        </div>
                        <div className="paymentProperty-confirmItem">
                            <span>T???ng thanh to??n</span>
                            <span>
                                {cartItems.reduce(
                                    (accumulate, currentValue) =>
                                        accumulate +
                                        currentValue.price *
                                            currentValue.quantityProduct,
                                    0
                                ) +
                                    shippingShops.reduce(
                                        (accumulate, currentValue) =>
                                            accumulate + currentValue.cost,
                                        0
                                    )}{" "}
                                <Crown variant="Bold" />
                            </span>
                        </div>
                        <button onClick={checkoutHandler}>X??c nh???n</button>
                        <button onClick={handleBack}>
                            <Back size={32} />
                            Quay l???i
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="waitProduct-modal">
                        <div className="waitProduct-modalChangeContainer">
                            <span>Thay ?????i ?????a ch???</span>
                            {userDetail.deliveryInfo.map((info, index) => (
                                <div
                                    className="waitProduct-modalChangeBox"
                                    onClick={() => setDeliveryTempIndex(index)}
                                    style={{
                                        color:
                                            index === deliveryTempIndex
                                                ? "var(--primary-color)"
                                                : null,
                                    }}
                                >
                                    <span>?????a ch??? giao h??ng {index + 1}</span>
                                    <div className="waitProduct-modalContent">
                                        <span>H??? v?? t??n: {info.fullName}</span>
                                        <span>
                                            S??? ??i???n tho???i: {info.phoneNumber}
                                        </span>
                                        <span>
                                            ?????a ch???:{" "}
                                            {`${info.address}, ${info.ward}, ${info.distinct}, ${info.province}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="waitProduct-modalBtn">
                                <button onClick={() => setOpen(false)}>
                                    <Back size={32} />
                                    Quay l???i
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        setDeliveryIndex(deliveryTempIndex);
                                    }}
                                >
                                    Ho??n T???t
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default PaymentProperty;

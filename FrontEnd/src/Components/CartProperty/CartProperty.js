import React, { useContext, useEffect, useState } from "react";
import "./cartProperty.scss";
import { ArrowDown2, Crown, Heart, MessageText1, Shop } from "iconsax-react";
import { AuthContext } from "../../context/AuthContext";
import { StoreContext } from "../../context/StoreContext";
import axios from "./../../hooks/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const CartProperty = () => {
    const { user } = useContext(AuthContext);
    const [userDetail, setUserDetail] = useState();
    const { state, contextDispatch } = useContext(StoreContext);
    const {
        cart: { cartItems, shopItems },
    } = state;
    const [products, setProducts] = useState([]);
    const [shops, setShops] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/users/${user._id}`);
            setUserDetail(data);
        };
        fetchData();
    }, [user]);
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
    const handleDeleteProduct = async (productDeleted) => {
        try {
            contextDispatch({
                type: "CART_REMOVE_ITEM",
                payload: productDeleted,
            });

            const { data: shopDeleted } = await axios.get(
                `/shops/shop/${productDeleted.shop._id}`
            );

            const count = products.reduce((accumulate, currentValue) => {
                if (currentValue.shop._id === productDeleted.shop._id) {
                    return accumulate + 1;
                }
                return accumulate;
            }, 0);
            if (count === 1) {
                contextDispatch({
                    type: "SHOP_REMOVE_ITEM",
                    payload: shopDeleted,
                });
            }
            setProducts([]);
            toast.success("Delete product successfully");
        } catch (err) {
            toast.error(err.message);
        }
    };
    const gotoShop = (id) => {
        navigate(`/shop/${id}`);
    };
    return (
        <div className="cartProperty">
            <div className="cart-container">
                <div className="cart-content">
                    {shops.length > 0 ? (
                        shops.map((shop) => (
                            <div className="cart-contentBox" key={shop._id}>
                                <div className="cart-title">
                                    <span>{shop.name}</span>
                                    <div className="cart-infoShop">
                                        <button
                                            onClick={() => gotoShop(shop._id)}
                                        >
                                            <Shop />
                                            Tham quan
                                        </button>
                                    </div>
                                </div>
                                {products
                                    .filter(
                                        (product) =>
                                            product.shop._id === shop._id
                                    )
                                    .map((product) => (
                                        <div
                                            className="cart-product"
                                            key={product._id}
                                        >
                                            <img
                                                src={product.imgPath[0]}
                                                alt="productImg"
                                            />
                                            <div className="cart-productProperty">
                                                <div className="cart-productContent">
                                                    <span>{product.name}</span>
                                                    <div className="cart-productQuantity">
                                                        <div className="cart-productCount">
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
                                                        <div className="cart-moneySum">
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
                                                <div className="cart-productButton">
                                                    <span>
                                                        Ph??n lo???i:{" "}
                                                        {
                                                            product.classifyProduct
                                                        }
                                                    </span>
                                                    <span
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        X??a
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))
                    ) : (
                        <div class="cartImg-center">
                            <img src="/Img/empty_cart.png" alt="empty" />
                        </div>
                    )}
                </div>
                <div className="cart-confirm">
                    <div className="cart-comfirmList">
                        <div className="cart-confirmItem">
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
                        <div className="cart-confirmItem">
                            <span>T???ng thanh to??n</span>
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

                        {cartItems.length > 0 ? (
                            user === null ? (
                                <button>
                                    <Link
                                        to="/login"
                                        style={{
                                            textDecoration: "none",
                                            color: "#fff",
                                        }}
                                        onClick={() =>
                                            toast.warning(
                                                "Tr?????c khi ti???n th??nh thanh to??n, c???n ph???i ????ng nh???p "
                                            )
                                        }
                                    >
                                        X??c nh???n
                                    </Link>
                                </button>
                            ) : userDetail &&
                              userDetail.name &&
                              userDetail.gender &&
                              userDetail.birthday &&
                              userDetail.email &&
                              userDetail.phoneNumber &&
                              userDetail.deliveryInfo.length > 0 ? (
                                <button>
                                    <Link
                                        to="/payment"
                                        style={{
                                            textDecoration: "none",
                                            color: "#fff",
                                        }}
                                    >
                                        X??c nh???n
                                    </Link>
                                </button>
                            ) : (
                                <button>
                                    <Link
                                        to="/profile"
                                        style={{
                                            textDecoration: "none",
                                            color: "#fff",
                                        }}
                                        onClick={() =>
                                            toast.warning(
                                                "Tr?????c khi ti???n th??nh thanh to??n, ph???i c???p nh???t l???i th??ng tin c?? nh??n v?? ?????a ch??? "
                                            )
                                        }
                                    >
                                        X??c nh???n
                                    </Link>
                                </button>
                            )
                        ) : (
                            <button
                                style={{ opacity: 0.8, cursor: "not-allowed" }}
                                disabled
                            >
                                X??c nh???n
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartProperty;

import React, { useContext, useEffect, useState } from "react";
import {
    ArrowLeft2,
    ArrowRight2,
    Back,
    Crown,
    GalleryAdd,
    MessageText1,
    SearchNormal1,
    Shop,
    Star1,
} from "iconsax-react";
import "./productPay.scss";
import axios from "./../../hooks/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Star from "./../Star/Star";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
// Register the plugin
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { toast } from "react-toastify";

// Register the plugins
registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginImageValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
);

const ProductPay = () => {
    const { user } = useContext(AuthContext);
    const [active, setActive] = useState(1);
    const [open, setOpen] = useState(false);
    const setClick = (i) => {
        setActive(i);
    };
    const navigate = useNavigate();
    const [checkouts, setCheckouts] = useState([]);
    const [checkoutAuctions, setCheckoutAuctions] = useState([]);
    const [product, setProduct] = useState();
    const [rating, setRating] = useState(0);
    const [contentReview, setContentReview] = useState("");
    const [reviews, setReviews] = useState([]);
    const [files, setFiles] = useState([]);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/checkouts/all/${user._id}`);
            setCheckouts(data);
        };
        fetchData();
    }, [user, reload]);
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(
                `/checkoutAuction/all/${user._id}`
            );

            setCheckoutAuctions(data);
        };
        fetchData();
    }, [user, reload]);
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/reviews/user/${user._id}`);
            setReviews(data);
        };
        fetchData();
    }, [user, reload]);

    const rebuyHandler = (slug) => {
        navigate(`/products/${slug}`);
    };
    const getImageData = (files) => {
        let rs = [];
        files.forEach((item) => {
            var imgData = `{"type":"${
                item.fileType.split(";")[0]
            }","data":"${item.getFileEncodeBase64String()}"}`;

            rs.push(imgData);
        });
        return rs;
    };
    const img = getImageData(files);
    const addReviewHandler = async () => {
        if (rating === 0) {
            toast.warning("B???n ph???i ch???n s??? sao mu???n ????nh gi?? ");
            return;
        } else if (contentReview.trim() === "") {
            toast.warning("B???n ph???i nh???p n???i dung ????nh gi??");
            return;
        }
        try {
            await axios.post("/reviews", {
                user: user._id,
                product: product._id._id,
                content: contentReview,
                rating,
                img,
            });
            toast.success("????nh gi?? s???n ph???m th??nh c??ng");
        } catch (error) {
            toast.error(error.message);
        }
    };
    const gotoshopHandler = (id) => {
        navigate(`/shop/${id}`);
    };
    const receivedProductHandler = async (id) => {
        try {
            await axios.patch(`/checkouts/${id}`, {
                status: "delivered",
            });
            setReload(!reload);
            toast.success("B???n ???? nh???n ???????c h??ng th??nh c??ng");
        } catch (error) {
            toast.error(error.message);
        }
    };
    const receivedProductAuctionHandler = async (id) => {
        try {
            await axios.patch(`/checkoutAuction/status/${id}`, {
                status: "delivered",
            });
            setReload(!reload);
            toast.success("B???n ???? nh???n ???????c h??ng th??nh c??ng");
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <div className="productPay">
            <div className="productPay-container">
                <div className="productPay-title">
                    <button
                        className={
                            active === 1 ? "active active__underline" : ""
                        }
                        onClick={() => setClick(1)}
                    >
                        Mua h??ng
                    </button>
                    <button
                        className={
                            active === 2 ? "active active__underline" : ""
                        }
                        onClick={() => setClick(2)}
                    >
                        ?????u gi??
                    </button>
                </div>

                <div className={active === 1 ? "productPay-list" : "tab-hide"}>
                    {checkouts &&
                        checkouts.map((checkout) => (
                            <div className="productPay-item" key={checkout._id}>
                                <div className="productPay-header">
                                    <div className="productPay-itemTitle">
                                        <span>{checkout.shop.name}</span>
                                        <button
                                            onClick={() =>
                                                gotoshopHandler(
                                                    checkout.shop._id
                                                )
                                            }
                                        >
                                            <Shop />
                                            Tham quan
                                        </button>
                                    </div>
                                    <span>M?? ????n: {checkout._id} </span>
                                </div>
                                {checkout.productItems.map((product, index) => (
                                    <div key={index}>
                                        <div className="productPay-body">
                                            <img
                                                src={product._id.imgPath[0]}
                                                alt=""
                                            />
                                            <div className="productPay-bodyText">
                                                <span>{product.name}</span>
                                                <div className="productPay-bodyType">
                                                    <span>
                                                        Ph??n lo???i:{" "}
                                                        {
                                                            product.classifyProduct
                                                        }
                                                    </span>
                                                    <span>
                                                        S??? l?????ng:{" "}
                                                        {
                                                            product.quantityProduct
                                                        }
                                                    </span>
                                                    <span>
                                                        Gi?? ti???n:{" "}
                                                        {product.price}
                                                        <Crown
                                                            size={20}
                                                            variant="Bold"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="productPay-footer">
                                            <div className="productPay-footerBtn">
                                                {checkout.status ===
                                                "delivered" ? (
                                                    reviews.find(
                                                        (item) =>
                                                            item.product ===
                                                            product._id._id
                                                    ) != null ? (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    rebuyHandler(
                                                                        product
                                                                            ._id
                                                                            .slug
                                                                    )
                                                                }
                                                            >
                                                                Mua l???i
                                                            </button>
                                                            <button
                                                                disabled
                                                                style={{
                                                                    cursor: "not-allowed",
                                                                }}
                                                            >
                                                                ???? ????nh gi??
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    rebuyHandler(
                                                                        product
                                                                            ._id
                                                                            .slug
                                                                    )
                                                                }
                                                            >
                                                                Mua l???i
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setProduct(
                                                                        product
                                                                    );
                                                                    setOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                ????nh gi??
                                                            </button>
                                                        </>
                                                    )
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="productPay-footer">
                                    <span>
                                        Tr???ng th??i:{" "}
                                        <span>
                                            {checkout.status === "waiting"
                                                ? "Ch??? giao h??ng"
                                                : checkout.status ===
                                                  "delivering"
                                                ? "??ang giao h??ng"
                                                : "???? giao h??ng"}
                                        </span>
                                    </span>
                                    <span>
                                        T???ng ti???n:{" "}
                                        {checkout.totalCost + checkout.shipCost}{" "}
                                        <Crown size={34} variant="Bold" />
                                    </span>
                                </div>
                                {checkout.status === "delivering" && (
                                    <button
                                        onClick={() =>
                                            receivedProductHandler(checkout._id)
                                        }
                                    >
                                        ???? nh???n ???????c h??ng
                                    </button>
                                )}
                            </div>
                        ))}
                </div>
                <div
                    className={
                        active === 2 ? "productAuction-list" : "tab-hide"
                    }
                >
                    {checkoutAuctions.map((c) => (
                        <div className="productAuction-item">
                            <div className="productAuction-header">
                                <span>{c.shop.name}</span>
                                <span>M?? ????n: {c._id}</span>
                            </div>
                            <div className="productAuction-body">
                                <img src={c.imgPath} alt="" />
                                <div className="productAuction-bodyText">
                                    <span>{c.name}</span>
                                    <span>S??? l?????ng: {c.quantity}</span>
                                </div>
                            </div>
                            <div className="productAuction-footer">
                                <span className="active">
                                    {c.status === "waiting"
                                        ? "Ch??? giao h??ng"
                                        : c.status === "delivering"
                                        ? "??ang giao h??ng"
                                        : "???? giao h??ng"}
                                </span>
                                <span>
                                    T???ng ti???n: {c.totalCost + c.shipCost}{" "}
                                    <Crown size={34} variant="Bold" />
                                </span>
                            </div>
                            {c.status === "delivering" && (
                                <button
                                    onClick={() =>
                                        receivedProductAuctionHandler(c._id)
                                    }
                                    style={{
                                        padding: "10px",
                                        border: "none",
                                        borderRadius: "10px",
                                        backgroundColor: "var(--primary-color)",
                                        color: "#fff",
                                        fontSize: "2rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    ???? nh???n ???????c h??ng
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {open && (
                    <div className="modalComment">
                        <div className="modalComment-container">
                            <span>????nh gi?? s???n ph???m</span>
                            <div className="modalComment-product">
                                <img
                                    src={product._id.imgPath[0]}
                                    alt="product"
                                />
                                <div className="modalComment-productName">
                                    <span>{product.name}</span>
                                    <div className="modalComment-productDetail">
                                        <span>
                                            Ph??n lo???i: {product.classifyProduct}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="modalComment-rate">
                                <span>Ch???t l?????ng s???n ph???m</span>
                                <div className="modalComent-rateBox">
                                    <Star setRating={setRating} />
                                </div>
                            </div>

                            <textarea
                                value={contentReview}
                                onChange={(e) =>
                                    setContentReview(e.target.value)
                                }
                            ></textarea>

                            <FilePond
                                files={files}
                                onupdatefiles={setFiles}
                                allowMultiple={true}
                                maxFiles={3}
                                maxFileSize="3MB"
                                //server="/api"
                                name="img"
                                labelIdle={"Th??m ???nh t???i ??a 3 ???nh"}
                            />
                            <div className="modalComment-btn">
                                <button onClick={() => setOpen(false)}>
                                    <Back />
                                    Quay l???i
                                </button>
                                <button onClick={addReviewHandler}>
                                    Ho??n t???t
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPay;

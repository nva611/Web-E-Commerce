import { GalleryEdit } from "iconsax-react";
import React, { useContext, useEffect, useState } from "react";
import "./profileShop.scss";
import axios from "./../../hooks/axios.js";
import { default as axiosOriginal } from "axios";
import { toast } from "react-toastify";
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
import { AuthContext } from "../../context/AuthContext";

// Register the plugins
registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginImageValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
);
const ProfileShop = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [files, setFiles] = useState([]);
    const [mainCategory, setMainCategory] = useState("");
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategory, setSubCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [shop, setShop] = useState();
    const [shopImg, setShopImg] = useState();
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);

    const [provinceArray, setProvinceArray] = useState([]);
    const [distinctArray, setDistinctArray] = useState([]);
    const [wardArray, setWardArray] = useState([]);
    const [province, setProvince] = useState("");
    const [distinct, setDistinct] = useState("");
    const [ward, setWard] = useState("");
    const [provinceText, setProvinceText] = useState("");
    const [distinctText, setDistinctText] = useState("");
    const [wardText, setWardText] = useState("");
    const [address, setAddress] = useState("");
    const [addressInfo, setAddressInfo] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/shops/${user._id}`);
            if (data) {
                setShop(data);
                setName(data.name);
                setMainCategory(data.mainCategory);
                setSubCategories(data.subCategories);
                setShopImg(data.imgPath);
                setAddressInfo(data.addressInfo);
            }
        };
        fetchData();
    }, [user, reload]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get("/categories/");
            setMainCategories(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosOriginal.get(
                    "https://provinces.open-api.vn/api/?depth=1"
                );
                setProvince(data[49].code);
                setProvinceText(data[49].name);
                setProvinceArray(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosOriginal.get(
                    `https://provinces.open-api.vn/api/p/${province}/?depth=2`
                );
                setDistinct(data.districts[0].code);
                setDistinctText(data.districts[0].name);
                setDistinctArray(data.districts);
            } catch (err) {
                console.log(err);
            }
        };
        if (province) {
            fetchData();
            setWardArray([]);
        }
    }, [province]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosOriginal.get(
                    `https://provinces.open-api.vn/api/d/${distinct}/?depth=2`
                );
                setWard(data.wards[0].code);
                setWardText(data.wards[0].name);
                setWardArray(data.wards);
            } catch (err) {
                console.log(err);
            }
        };
        if (distinct) {
            fetchData();
        }
    }, [distinct]);

    const addCategoryHandler = () => {
        if (subCategories.find((s) => s === subCategory)) {
            toast.warning("Danh m???c ???? t???n t???i trong shop");
            return;
        }
        setSubCategories((pre) => [...pre, subCategory]);
        setSubCategory("");
    };
    const getImageData = (item) => {
        return `{"type":"${
            item.fileType.split(";")[0]
        }","data":"${item.getFileEncodeBase64String()}"}`;
    };
    const createHandler = async () => {
        try {
            let img;
            if (files[0] === undefined) {
                toast.warn("You haven't added a photo yet");
                return;
            } else {
                img = getImageData(files[0]);
            }
            await axios.post("/shops", {
                name,
                user: user._id,
                mainCategory,
                subCategories,
                img,
                addressInfo,
            });
            toast.success("T???o shop th??nh c??ng");
            setReload(!reload);
            //TODO: C???n ki???m c??ch ????? trang seller reload lo???i
            window.location.reload();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const updateHandler = async () => {
        try {
            let img;
            if (files[0] === undefined) {
                //TODO: N???u 0 t???i ???nh
                // toast.warn("You haven't added a photo yet");
                // return;
            } else {
                img = getImageData(files[0]);
            }
            await axios.patch(`/shops/${user._id}`, {
                name,
                mainCategory,
                subCategories,
                img,
                addressInfo,
            });
            toast.success("C???p nh???t shop th??nh c??ng");
            setReload(!reload);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setAddressInfo({
            province: provinceText,
            distinct: distinctText,
            ward: wardText,
            address,
        });
        setOpen(false);
    };

    return (
        <div className="profileShop">
            <div className="profileShop-container">
                <span>H??? S?? Shop</span>
                <div className="profileShop-img">
                    <img
                        src={shopImg ? shopImg : "/Img/default-user.png"}
                        alt="shop"
                    />
                    {/* <GalleryEdit className="profileShop-icon" size={44} /> */}
                    <FilePond
                        files={files}
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        maxFiles={3}
                        maxFileSize="3MB"
                        //server="/api"
                        name="img"
                        labelIdle="Upload Shop Avatar"
                    />
                </div>
                <div className="profileShop-name">
                    <span>T??n Shop</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="profileShop-address">
                    <span>?????a ch???</span>
                    <span>
                        {addressInfo
                            ? `${addressInfo.address}, ${addressInfo.ward}, ${addressInfo.distinct}, ${addressInfo.province}`
                            : "Ch??a c???p nh???t ?????a ch???"}
                    </span>
                </div>

                <button onClick={() => setOpen(true)}>C???p Nh???t ?????a Ch???</button>

                <div className="profileShop-product">
                    <span>Ng??nh h??ng</span>
                    <div className="profleShop-productList">
                        {mainCategories.map((category) => (
                            <span
                                key={category._id}
                                onClick={() => setMainCategory(category._id)}
                                style={{
                                    backgroundColor:
                                        category._id === mainCategory
                                            ? "var(--sub-color)"
                                            : null,
                                    color:
                                        category._id === mainCategory
                                            ? "#fff"
                                            : null,
                                }}
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="profileShop-product">
                    <span>Danh m???c</span>
                    <div className="profileShop-productBox">
                        <input
                            type="text"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                        />
                        <button onClick={addCategoryHandler}>Th??m</button>
                        <div className="profleShop-productList">
                            {subCategories.map((subCategory) => (
                                <span key={subCategory}>{subCategory}</span>
                            ))}
                        </div>
                    </div>
                </div>
                {shop ? (
                    <button onClick={updateHandler}>C???p nh???t Shop</button>
                ) : (
                    <button onClick={createHandler}>T???o Shop</button>
                )}
            </div>
            {open && (
                <div className="addressModal">
                    <form
                        className="addressModal-container"
                        onSubmit={submitHandler}
                    >
                        <span>Th??m ?????a ch??? m???i</span>
                        <div className="addressModal-boxList">
                            <select
                                value={province}
                                onChange={(e) => {
                                    const index =
                                        e.nativeEvent.target.selectedIndex;
                                    setProvinceText(
                                        e.nativeEvent.target[index].text
                                    );
                                    setProvince(e.target.value);
                                }}
                                disabled
                            >
                                <option value="" key="default" disabled>
                                    Ch???n 1 Th??nh ph???
                                </option>
                                {provinceArray.map((element) => (
                                    <option
                                        value={element.code}
                                        key={element.code}
                                    >
                                        {element.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="addressModal-boxList">
                            <span>Qu???n</span>
                            <select
                                value={distinct}
                                onChange={(e) => {
                                    const index =
                                        e.nativeEvent.target.selectedIndex;
                                    setDistinctText(
                                        e.nativeEvent.target[index].text
                                    );
                                    setDistinct(e.target.value);
                                }}
                                required
                            >
                                <option value="" key="default" disabled>
                                    Ch???n 1 Qu???n
                                </option>
                                {distinctArray.map((element) => (
                                    <option
                                        value={element.code}
                                        key={element.code}
                                    >
                                        {element.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="addressModal-boxList">
                            <span>Ph?????ng</span>
                            <select
                                value={ward}
                                onChange={(e) => {
                                    const index =
                                        e.nativeEvent.target.selectedIndex;
                                    setWardText(
                                        e.nativeEvent.target[index].text
                                    );
                                    setWard(e.target.value);
                                }}
                                required
                            >
                                <option value="" key="default" disabled>
                                    Ch???n 1 Ph?????ng
                                </option>
                                {wardArray.map((element) => (
                                    <option
                                        value={element.code}
                                        key={element.code}
                                    >
                                        {element.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="addressModal-boxList">
                            <span>?????a ch??? c??? th???</span>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="addressModal-btn">
                            <button onClick={() => setOpen(false)}>Hu???</button>
                            <button type="submit">Th??m ?????a ch???</button>
                        </div>{" "}
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfileShop;

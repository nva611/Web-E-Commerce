import { Crown, GalleryAdd } from "iconsax-react";
import React, { useContext, useState } from "react";
import "./newAuction.scss";
import { useNavigate } from "react-router-dom";
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
import Classify from "../../Components/Classify/Classify";
import axios from "./../../hooks/axios";
import { toast } from "react-toastify";

// Register the plugins
registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginImageValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
);

const NewAuction = () => {
    const [active, setActive] = useState(1);
    const { user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [files, setFiles] = useState([]);
    const [startingPrice, setStartingPrice] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [time, setTime] = useState(1);
    const [auctionHistory, setAuctionHistory] = useState();
    const navigate = useNavigate();

    const setClick = (i) => {
        setActive(i);
        setTime(i);
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

    const addAuctionHandler = async () => {
        try {
            const img = getImageData(files);
            var endTime = new Date();
            endTime.setDate(endTime.getDate() + time);
            const data = {
                buyer: user._id,
                product: {
                    name,
                    description,
                    img,
                    quantity: quantity,
                },
                startingPrice: startingPrice,
                currentPrice: startingPrice,
                endTime,
            };
            await axios.post("/auction/create", data);
            toast.success(
                "S???n ph???m ph???m ???? ???????c ????a l??n s??n ?????u gi?? th??nh c??ng"
            );
            window.setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="newAuction">
            <span>Th??ng tin s???n ph???m mong mu???n ?????u gi??</span>
            <div className="newAuction-name">
                <span>T??n s???n ph???m</span>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="">
                <span>H??nh ???nh li??n quan</span>
                <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={true}
                    maxFiles={3}
                    maxFileSize="3MB"
                    //server="/api"
                    name="img"
                    labelIdle="Th??m t???i ??a 3 ???nh cho s???n ph???m"
                />
                {/* <div className="newAuction-imgBox">
                    <img src="../Img/iphone14.png" alt="" />
                    <img src="../Img/iphone14.png" alt="" />
                    <img src="../Img/iphone14.png" alt="" />
                    <button>
                        <GalleryAdd />
                        Th??m h??nh ???nh
                    </button>
                </div> */}
            </div>
            {/* <div className="newAuction-brand">
                <span>Th????ng hi???u</span>
                <input type="text" />
            </div>
            <div className="newAuction-wish">
                <span>Size mong mu???n</span>
                <div className="newAuction-wishInput">
                    <input type="text" />
                </div>
            </div>
            <div className="newAuction-wish">
                <span>M??u s???c mong mu???n</span>
                <div className="newAuction-wishInput">
                    <input type="text" />
                </div>
            </div> */}
            <div className="newAuction-wish">
                <span>S??? l?????ng mong mu???n</span>
                <div className="newAuction-wishInput">
                    <input
                        type="number"
                        min={0}
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
            </div>
            <div className="newAuction-auctionPrice">
                <span>M???c ?????u gi?? kh???i ??i???m</span>
                <div className="newAuction-price">
                    <div className="newAuction-priceInput">
                        <input
                            type="number"
                            min={0}
                            value={startingPrice}
                            onChange={(e) => setStartingPrice(e.target.value)}
                            required
                        />
                        <Crown variant="Bold" className="active" />
                    </div>
                </div>
            </div>
            <span>M?? t??? v??? s???n ph???m mong mu???n</span>
            <div className="newAuction-desc">
                <span>M?? t??? s???n ph???m</span>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
            </div>
            <span>Th???i gian c???a cu???c ?????u gi??</span>
            {/* <div className="newAuction-date">
                <span>Ng??y b???t ?????u</span>
                <div className="newAuction-dateInput">
                    <input type="date" value={new Date()} />
                </div>
            </div> */}
            {/* <div className="newAuction-time">
                <span>Th???i gian b???t ?????u</span>
                <div className="newAuction-timeBox">
                    <input type="number" />
                    <span>gi???</span>
                    <input type="number" />
                    <span>ph??t</span>
                </div>
            </div> */}
            <div className="newAuction-timeTake">
                <span>Kho???ng th???i gian ?????u gi??</span>
                <div className="newAuction-timeTakeBox">
                    <span
                        className={active === 1 ? "active active-border" : ""}
                        onClick={() => setClick(1)}
                    >
                        1 ng??y
                    </span>
                    <span
                        className={active === 3 ? "active active-border" : ""}
                        onClick={() => setClick(3)}
                    >
                        3 ng??y
                    </span>
                    <span
                        className={active === 7 ? "active active-border" : ""}
                        onClick={() => setClick(7)}
                    >
                        1 tu???n
                    </span>
                </div>
            </div>
            <div className="newAuction-btn">
                <button>H???y</button>
                <button onClick={addAuctionHandler}>L??u</button>
            </div>
        </div>
    );
};

export default NewAuction;

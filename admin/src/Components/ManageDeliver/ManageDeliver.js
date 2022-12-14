import { Back, Crown, TruckFast } from "iconsax-react";
import React, { useState, useEffect } from "react";
import "./manageDeliver.scss";
import axios from "./../../hooks/axios";

const ManageDeliver = () => {
    const [open, setOpen] = useState(false);
    const [zone1, setZone1] = useState({});
    const [zone2, setZone2] = useState({});
    const [zone3, setZone3] = useState({});
    const [zone4, setZone4] = useState({});
    const [zone5, setZone5] = useState({});
    const [info, setInfo] = useState({});
    const [info1, setInfo1] = useState({});
    const [cost, setCost] = useState();
    useEffect(() => {
        try {
            const fetchZone1 = async () => {
                const { data } = await axios.get(
                    "/shippingCost/zone?start=-1&end=-1"
                );

                setZone1(data);
            };
            fetchZone1();
            const fetchZone2 = async () => {
                const { data } = await axios.get(
                    "/shippingCost/zone?start=0&end=0"
                );

                setZone2(data);
            };
            fetchZone2();
            const fetchZone3 = async () => {
                const { data } = await axios.get(
                    "/shippingCost/zone?start=1&end=2"
                );
                setZone3(data);
            };
            fetchZone3();
            const fetchZone4 = async () => {
                const { data } = await axios.get(
                    "/shippingCost/zone?start=2&end=3"
                );
                setZone4(data);
            };
            fetchZone4();
            const fetchZone5 = async () => {
                const { data } = await axios.get(
                    "/shippingCost/zone?start=1&end=3"
                );
                setZone5(data);
            };
            fetchZone5();
        } catch (err) {
            console.error(err);
        }
    }, []);
    const handleOpen = (zone, sameZone) => {
        setOpen(true);
        setInfo(zone);
        setInfo1(sameZone);
    };
    const handleUpdate = async (e) => {
        e.stopPropagation();
        try {
            const deliverCost = cost;
            if (info1 === undefined) {
                await axios.patch("/shippingCost/update", {
                    starting: info.starting,
                    destination: info.destination,
                    cost: Number(deliverCost),
                });
                setOpen(false);
            } else {
                await axios.patch("/shippingCost/update", {
                    starting: info.starting,
                    destination: info.destination,
                    cost: deliverCost,
                });
                await axios.patch("/shippingCost/update", {
                    starting: info1.starting,
                    destination: info1.destination,
                    cost: deliverCost,
                });
                setOpen(false);
            }
            if (info.starting === -1 && info.destination === -1) {
                setZone1((prev) => {
                    zone1.cost = deliverCost;
                    return zone1;
                });
            }
            if (info.starting === 0 && info.destination === 0) {
                setZone2((prev) => {
                    zone2.cost = deliverCost;
                    return zone2;
                });
            }
            if (
                info.starting === 1 &&
                info.destination === 2 &&
                info1.starting === 2 &&
                info1.destination === 3
            ) {
                setZone3((prev) => {
                    zone3.cost = deliverCost;
                    return zone3;
                });
                setZone4((prev) => {
                    zone4.cost = deliverCost;
                    return zone4;
                });
            }
            if (info.starting === 1 && info.destination === 3) {
                setZone5((prev) => {
                    zone5.cost = deliverCost;
                    return zone5;
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="manageDeliver">
            <div className="manageDeliver-fee">
                <div className="manageDeliver-feeList">
                    <div className="manageDeliver-feeItem">
                        <div className="manageDeliver-feeTitle">
                            <span>PH?? V???N CHUY???N - C??NG QU???N</span>
                            <span onClick={() => handleOpen(zone1)}>
                                THAY ?????I
                            </span>
                        </div>
                        <span>
                            {zone1?.cost === 0 ? "Free" : zone1?.cost}
                            <Crown size={30} variant="Bold" />
                        </span>
                    </div>
                    <div className="manageDeliver-feeItem">
                        <div className="manageDeliver-feeTitle">
                            <span>PH?? V???N CHUY???N</span>
                            <span onClick={() => handleOpen(zone3, zone4)}>
                                THAY ?????I
                            </span>
                        </div>
                        <div className="manageDeliver-feePlace">
                            <span>
                                V??NG {zone3?.starting} {"<"}--{">"} V??NG{" "}
                                {zone3?.destination}
                            </span>
                            <span>
                                V??NG {zone4?.starting} {"<"}--{">"} V??NG{" "}
                                {zone4?.destination}
                            </span>
                        </div>
                        <span>
                            {zone3?.cost && zone4?.cost}
                            <Crown size={30} variant="Bold" />
                        </span>
                    </div>
                </div>
                <TruckFast size={100} variant="Bold" className="active" />
                <div className="manageDeliver-feeList">
                    <div className="manageDeliver-feeItem">
                        <div className="manageDeliver-feeTitle">
                            <span>PH?? V???N CHUY???N - C??NG V??NG</span>
                            <span onClick={() => handleOpen(zone2)}>
                                THAY ?????I
                            </span>
                        </div>
                        <span>
                            {zone2?.cost}
                            <Crown size={30} variant="Bold" />
                        </span>
                    </div>
                    <div className="manageDeliver-feeItem">
                        <div className="manageDeliver-feeTitle">
                            <span>PH?? V???N CHUY???N</span>
                            <span onClick={() => handleOpen(zone5)}>
                                THAY ?????I
                            </span>
                        </div>
                        <div className="manageDeliver-feePlace">
                            <span>
                                V??NG {zone5?.starting} {"<"}--{">"} V??NG{" "}
                                {zone5?.destination}
                            </span>
                        </div>
                        <span>
                            {zone5?.cost} <Crown size={30} variant="Bold" />
                        </span>
                    </div>
                </div>
            </div>
            <div className="manageDeliver-region">
                <span>Quy ?????nh v??ng</span>
                <div className="manageDeliver-regionList">
                    <div className="manageDeliver-regionItem">
                        <span>V??ng 1</span>
                        <div className="manageDeliver-place">
                            <span>Qu???n T??n B??nh</span>
                            <span>Qu???n Ph?? Nhu???n</span>
                            <span>Qu???n G?? V???p</span>
                            <span>Qu???n T??n Ph??</span>
                            <span>Qu???n 1</span>
                            <span>Qu???n 3</span>
                            <span>Qu???n 5</span>
                            <span>Qu???n 10</span>
                            <span>Qu???n 11</span>
                        </div>
                    </div>
                    <div className="manageDeliver-regionItem">
                        <span>V??ng 2</span>
                        <div className="manageDeliver-place">
                            <span>Qu???n B??nh Th???nh</span>
                            <span>Qu???n B??nh T??n</span>
                            <span>Qu???n 2</span>
                            <span>Qu???n 4</span>
                            <span>Qu???n 6</span>
                            <span>Qu???n 8</span>
                            <span>Qu???n 9</span>
                            <span>Qu???n 12</span>
                            <span>Th??nh Ph??? Th??? ?????c</span>
                        </div>
                    </div>
                    <div className="manageDeliver-regionItem">
                        <span>V??ng 3</span>
                        <div className="manageDeliver-place">
                            <span>Huy???n H??c M??n</span>
                            <span>Huy???n B??nh Ch??nh</span>
                            <span>Huy???n Nh?? B??</span>
                            <span>Qu???n 7</span>
                            <span>Huy???n C??? Chi</span>
                            <span>Huy???n C???n Gi???</span>
                        </div>
                    </div>
                </div>
            </div>
            {open && (
                <div className="modal-changeShip">
                    <div className="modal-changeShipContainer">
                        <span>Thay ?????i Ph?? Ship</span>
                        <div className="modal-changeShipBox">
                            <span>Ph?? Ship</span>
                            <div className="modal-changeShipInput">
                                <input
                                    type="number"
                                    onChange={(e) => setCost(e.target.value)}
                                    defaultValue={info?.cost}
                                />
                                <Crown size={20} variant="Bold" />
                            </div>
                        </div>
                        <div className="modal-changeShipBtn">
                            <button onClick={() => setOpen(false)}>
                                <Back size={32} />
                                Quay L???i
                            </button>
                            <button onClick={handleUpdate}>X??c Nh???n</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDeliver;

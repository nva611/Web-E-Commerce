import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Ruby from "./Pages/Ruby/Ruby.js";
import Image from "./Pages/Image/image.js";
import Show from "./Pages/Image/Show.js";
import Money from "./Pages/Ruby/Money.js";
import Paypal from "./Pages/Ruby/Paypal.js";
import SellPage from "./Pages/SellPage/SellPage";
import CartList from "./Pages/CartList/CartList";
import Profile from "./Pages/Profile/Profile";
function App() {
    return (
        <BrowserRouter>
            <ToastContainer
                position="bottom-center"
                limit={1}
                autoClose={2000}
                pauseOnHover={false}
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:slug" element={<SellPage />} />
                <Route path="/img" element={<Image />} />
                <Route path="/money" element={<Money />} />
                <Route path="/paypal" element={<Paypal />} />
                <Route path="/simg" element={<Show />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/thanhtoan" element={<Ruby />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<CartList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

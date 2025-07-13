import { useState } from 'react'
import { assets } from "../assets/assets"
import { Link, useLocation } from "react-router-dom"
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from "motion/react"

const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "My Bookings", path: "/my-bookings" },
]

const Navbar = () => {

    const { setShowLogin, user, logout, isOwner, axios, setIsOwner, navigate } = useAppContext();
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    const changeRole = async () => {
        try {
            const response = await axios.post("/api/owner/change-role");
            const { data } = response;
            if (data.success) {
                setIsOwner(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <motion.div
            initial={{ y: -1, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-border-color relative transition-all ${location.pathname === "/" && "bg-light"}`}>
            <Link to="/">
                <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="" />
            </Link>

            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-border-color right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${isOpen ? "max-sm:translate-x-0" : "max-sm:translate-x-full"} `}>
                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path}>
                        {link.name}
                    </Link>
                ))}

                <div className="hidden lg:flex items-center text-sm gap-2 border border-border-color px-3 rounded-full max-w-56">
                    <input type="text" className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" placeholder="Search prodcuts" />
                    <img src={assets.search_icon} alt="search" />
                </div>

                <div className="flex max-sm:flex-col items-start sm:items-center gap-6">

                    <button onClick={() => isOwner ? navigate("/owner") : changeRole()} className="cursor-pointer">{isOwner ? "Dashboard" : "List Cars"}</button>

                    <button onClick={() => { user ? logout() : setShowLogin(true) }} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg ">{user ? "Logout" : "Login"}</button>
                </div>
            </div>

            <button className="sm:hidden cursor-pointer" aria-label='Menu' onClick={() => setIsOpen(!isOpen)}>
                <img src={isOpen ? assets.close_icon : assets.menu_icon} alt="menu" />
            </button>
        </motion.div>
    )
}

export default Navbar
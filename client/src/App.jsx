import React, { useState } from 'react'
import Navbar from "./components/Navbar"
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from "./pages/Home"
import Cars from "./pages/Cars"
import CarDetails from "./pages/CarDetails"
import MyBookings from "./pages/MyBookings"
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'

const App = () => {

    const [showLogin, setShowLogin] = useState(false)
    const isOwnerPath = useLocation().pathname.startsWith('/owner')
    return (
        <>
            {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/owner" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="cars/add" element={<AddCar />} />
                    <Route path="cars/manage" element={<ManageCars />} />
                    <Route path="bookings/manage" element={<ManageBookings />} />
                </Route>
            </Routes>
            {!isOwnerPath && <Footer />}
        </>
    )
}

export default App
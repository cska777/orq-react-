/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react'
import "./style.css"
import logoOrqBlanc from "../../asset/logo/ORQ_blanc.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCircleUser, FaBars } from "react-icons/fa6";
import { Connexion } from "./modalConnexion"
import { useAppStore } from '../../store'



export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuBurgerOpen, setIsMenuBurgerOpen] = useState(false)
    const dropdownRef = useRef(null)
    const burgerRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    // Accéder aux états et actions du store 
    const isAuth = useAppStore((state) => state.isAuth)
    const user = useAppStore((state) => state.user)
    const logout = useAppStore((state) => state.logout)
    const getUserData = useAppStore((state) => state.getUserData)
    const token = useAppStore((state) => state.token)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token){
            getUserData(token)
        }
    }, [])

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const toggleMenuBurger = () => {
        setIsMenuBurgerOpen(!isMenuBurgerOpen)
    }

    const closeMenuBurger = () => {
        setIsMenuBurgerOpen(false)
    }

    const handleNavigate = (path) => {
        closeMenuBurger()
        navigate(path)
    }
    useEffect(() => {
        function clickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        window.addEventListener("click", clickOutside)
        return () => {
            window.removeEventListener("click", clickOutside)
        }

    }, [isDropdownOpen])

    function dropdownItemClick() {
        setIsDropdownOpen(false)
    }

    const linkStyleBurger = (path) => {
        return location.pathname === path ? {color : "var(--hover-btn)"} : {color : "var(--font-color)"}
    }

    return (
        <nav>
            <div id='containerNav'>
                <div className='burgerLogo'>
                    <div className='menuBurger' onClick={toggleMenuBurger}>
                        <FaBars />
                    </div>
                    <div id='navLogo'>
                        <Link to="/"><img src={logoOrqBlanc} alt='Logo du site en blanc' id='logoOrqBlanc' /></Link>
                    </div>
                </div>

                <div id='navItems'>
                <span onClick={() => handleNavigate("/trouverFilm")} style={{ textDecoration: "none",...linkStyleBurger("/trouverFilm") }} className='mx-4'> Trouver mon film</span>
                    <span onClick={() => handleNavigate("/trouverSerie")} style={{ textDecoration: "none",...linkStyleBurger("/trouverSerie") }} className='align-bottom d-flex'>Trouver ma série</span>
                </div>

                <div id='navItemsBurger' className={isMenuBurgerOpen ? "open" : ""}>
                <span className='navLinkBurger' onClick={() => handleNavigate("/")} style={{ textDecoration: "none",...linkStyleBurger("/") }}>Accueil</span> <br></br>
                    <span className='navLinkBurger' onClick={() => handleNavigate("/trouverFilm")} style={{ textDecoration: "none",...linkStyleBurger("/trouverFilm") }}> Trouver mon film</span> <br></br>
                    <span onClick={() => handleNavigate("/trouverSerie")} style={{ textDecoration: "none",...linkStyleBurger("/trouverSerie") }} className='align-bottom d-flex navLinkBurger'>Trouver ma série</span><br></br>
                    
                </div>

                <div id='authNav'>
                    {isAuth ? (
                        <div className='dropdown' ref={dropdownRef}>
                            <button onClick={() => {toggleDropdown(); closeMenuBurger() }}id='btnNavCo'><FaCircleUser /> <span id='usernameNav'>{user?.username}</span></button>
                            {isDropdownOpen && (
                                <div className='dropdown-menu'>
                                    {/* <Link to="/profil" className='dropdown-item' onClick={dropdownItemClick}>Voir mon profil</Link> */}
                                    <Link to="/watchlist" className='dropdown-item' onClick={dropdownItemClick}>Ma watchlist</Link>
                                    <Link onClick={logout} className='dropdown-item'>Déconnexion</Link>
                                </div>
                            )}
                        </div> 

                    ) : (
                        <Connexion />
                    )}
                </div>
            </div>
        </nav>
    )
}

import React, { useEffect, useState } from 'react'
import './style.css'
import { motion } from "framer-motion"
import { CarouselHome } from './carouselHome'
import { CarouselHomeMobile } from "./carouselHomeMobile"
import { useIsMobile } from '../hook/useIsMobile'
import { Link } from 'react-router-dom'

const visible = { opacity: 1, y: -20, x: 0, transition: { duration: 1 } }

const itemVariants = {
  hidden: { opacity: 0, y: 10, x: 20 }, visible
}



export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const isMobile = useIsMobile()

  // Simuler un chargement pour le carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 1 } }}
      variants={{ visible: { transition: { staggerChildren: 0.7 } } }}
    >
      <div className='containerHome'>
        <div className='containerTitreCarouHome'>
          <div className='titreOrqDiv'>
            <h1>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 70 },
                  visible
                }}
              >
                ON
              </motion.p>
              <motion.p
                variants={itemVariants}
              >
                REGARDE
              </motion.p>
              <motion.p
                variants={itemVariants}
              >
                QUOI
              </motion.p>
              <motion.p
                variants={itemVariants}
              >
                ?
              </motion.p>
            </h1>
          </div>

          {isLoading ? (
            <div className='divLoadingHome'>
              <div className='loader'>
                <div className='tv-snow'></div>
                <div className='black-bar'></div>
              </div>
            </div>
          ) : (
            <div className='carouselHome'>
              {isMobile ? (
                <>
                  <CarouselHomeMobile />
                  <div className="divButtonHomeMobile">
                    <Link to={"/trouverFilm"}><button className='btnTrouverFilmMobile btnHomeMobile'>Trouver mon film</button></Link>
                    <Link to={"/trouverSerie"}><button className='btnTrouverSerieMobile btnHomeMobile'>Trouver ma série</button></Link>
                  </div>
                </>

              ) : (
                <CarouselHome />
              )}

            </div>
          )}
        </div>
      </div>

    </motion.article>


  )
}

import React from 'react'
import './style.css'
import { delay, motion } from "framer-motion"
import { Link } from 'react-router-dom'
import Paricles from "react-particles"

const visible = { opacity: 1, y: -20, x: -30, transition: { duration: 1 } }

const itemVariants = {
  hidden: { opacity: 0, y: 10, x: 20 }, visible
}



const buttonVariants = {
  hidden: { opacity: 0, y: -20, x: 30 },
  visible: {
    opacity: 1, x: 0, y: 0,
    transition: {
      duration: 0.8,
    }
  }
}

const buttonVariantsDeux = {
  hidden: { opacity: 0, y: -20, x: 30 },
  visible: {
    opacity: 1, x: 0, y: 0,
    transition: {
      duration: 0.9
    }
  }
}

export default function Home() {
  return (
    <motion.article
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 1 } }}
      variants={{ visible: { transition: { staggerChildren: 0.4 } } }}
    >
      <div className='containerHome'>
        <div className='containerTitreBtnHome'>
          <div className='titreOrqDiv'>
            <h1>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 60 },
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
                QUOI ?
              </motion.p>
            </h1>
          </div>
          <div className='btnHomeDiv'>
            <motion.button
              className='trouverFilmBtn'
              variants={buttonVariants}
            >
              <Link to="/trouverFilm" style={{ textDecoration: "none", color: "var(--font-color)" }}>Trouver mon film</Link>

            </motion.button>
            <br></br>
            <motion.button
              className='trouverSerieBtn'
              variants={buttonVariantsDeux}
            >
              <Link to="/trouverSerie" style={{ textDecoration: "none", color: "var(--font-color)" }}>Trouver ma série</Link>
            </motion.button>
          </div>
        </div>
      </div>

    </motion.article>


  )
}

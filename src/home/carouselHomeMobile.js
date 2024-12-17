import React, { useEffect, useState } from "react"
import jsonDataFilm from "../asset/data/movies_with_details.json"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectCoverflow, Keyboard, Virtual } from "swiper/modules"
import { OeuvreDescription } from "./popupCarousel"

export function CarouselHomeMobile(){
    const [films, setFilms] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOeuvre, setSelectedOeuvre] = useState(null)
  
    const handleOeuvreClick = (oeuvre) => {
      setSelectedOeuvre(oeuvre)
      setIsModalOpen(true)
    }
  
    const closeModal = () => {
      setIsModalOpen(false)
      setSelectedOeuvre(null)
    }
  
    useEffect(() => {
      const shuffledFilms = [...jsonDataFilm].sort(() => Math.random() - 0.5).slice(0, 100)
      setFilms(shuffledFilms)
    }, [])
  
    
    return(
        <><>
         {isModalOpen && selectedOeuvre && (
        <OeuvreDescription
          titre={selectedOeuvre.title}
          synopsis={selectedOeuvre.overview}
          realisateur={selectedOeuvre.directors}
          acteurs={selectedOeuvre.actors}
          date_sortie={selectedOeuvre.releaseYear}
          selectedOeuvre={selectedOeuvre}
          onClose={closeModal} />)}
        </>
            <Swiper
            modules={[Autoplay,Virtual, Keyboard, EffectCoverflow]}
            className="swiper_container_mobile"
            slidesPerView={2}
            autoplay={{
                delay: 1000,
                disableOnInteraction: false
              }}
            grabCursor={true}
            speed={1500}
            >
                {films.map((oeuvre,index) => (
                    <SwiperSlide 
                    key={index} 
                    className="swiper_custom_mobile"
                    >
                        <img src={oeuvre.poster_url} alt={`Illustration de ${oeuvre.titre}`} className="illuCarouselHome" onClick={() => handleOeuvreClick(oeuvre)} />
                    </SwiperSlide>
                ))}
            </Swiper></>
    )
}
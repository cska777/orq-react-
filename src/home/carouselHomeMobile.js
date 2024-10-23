import React, { useEffect, useState } from "react"
import jsonDataFilm from "../asset/data/list_films.json"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectCoverflow, Keyboard, Virtual } from "swiper/modules"

export function CarouselHomeMobile(){
    const [films, setfilms] = useState([])

    useEffect(() => {
        const shuffledFilms = [...jsonDataFilm].sort(() => Math.random() - 0.5).slice(0,50)
        setfilms(shuffledFilms)
    }, [])
    
    return(
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
                        <img src={oeuvre.poster_url} alt={`Illustration de ${oeuvre.titre}`} className="illuCarouHomeMobile" />
                    </SwiperSlide>
                ))}
            </Swiper>
    )
}
import React, { useEffect, useState } from 'react'
import jsonDataFilm from "../asset/data/list_films.json"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Keyboard, Virtual } from "swiper/modules"
import "swiper/css"

export function CarouselHome() {
  const [films, setFilms] = useState([])

  useEffect(() => {
    const shuffledFilms = [...jsonDataFilm].sort(() => Math.random() - 0.5).slice(0, 100)
    setFilms(shuffledFilms)
  }, [])

  return (
    <Swiper
    modules={[Autoplay,Virtual, Keyboard, EffectCoverflow]}
      className='swiper_container'
      autoplay={{
        delay: 2000,
        disableOnInteraction: false
      }}
      spaceBetween={20}
      slidesPerView={3}
      grabCursor={true}
      keyboard={{
        enabled:true
      }}
      effect={"coverflow"}
      speed={1500}
    >
      {films.map((oeuvre, index) => (
        <SwiperSlide key={index}  className="swiper-slide-custom">
          <img src={oeuvre.poster_url} alt={`Illustration de ${oeuvre.titre}`} className="illuCarouselHome" />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

import React from 'react'
import NavBar from '../Components/Navbar'
import HeroSection from '../Components/HomePage-Components/Hero'
import Steps from '../Components/HomePage-Components/Steps'
import Features from '../Components/HomePage-Components/Features'
import Review from '../Components/HomePage-Components/Review'

export default function HomePage() {
  return (
    <div>
      <NavBar />
      <div>
        <HeroSection />
        <Steps/>
        <Features/>
        <Review/>
      </div>
    </div>
  )
}

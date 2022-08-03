import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import OneSignal from 'react-onesignal';
import './scss/style.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Landing = React.lazy(() => import('./views/application/Landing'))

const App = () => {
  useEffect(() => {
    OneSignal.init({
      appId: "569117be-390c-4e5b-b865-f7522b09dcf2",
      allowLocalhostAsSecureOrigin: true
    });
    OneSignal.showSlidedownPrompt();
  }, []);


  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/landing" name="Landing Page" element={<Landing />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App

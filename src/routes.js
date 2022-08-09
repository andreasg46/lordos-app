import React from 'react'

const Landing = React.lazy(() => import('./views/application/Landing'))
const Home = React.lazy(() => import('./views/application/Home'))
const Questions = React.lazy(() => import('./views/application/Questions'))

const Admin = React.lazy(() => import('./views/application/Administrator/Admin'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/landing', name: 'Landing', element: Landing },
  { path: '/home', name: 'Home', element: Home },
  { path: '/questions', name: 'Questions', element: Questions },
  { path: '/admin', name: 'Admin', element: Admin },

]

export default routes

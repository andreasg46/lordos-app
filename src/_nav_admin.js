import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowCircleRight,
  cilHome,
  cilList,
  cilLockLocked,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react-pro'

const _nav = [
  {
    component: CNavTitle,
    name: 'Admin',
  },
  {
    component: CNavItem,
    name: 'Admin',
    to: '/admin',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Application',
  },
  {
    component: CNavItem,
    name: 'Landing',
    to: '/landing',
    icon: <CIcon icon={cilArrowCircleRight} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Questions',
    to: '/questions',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
]



export default _nav

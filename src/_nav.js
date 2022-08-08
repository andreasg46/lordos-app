import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react-pro'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
]

export default _nav

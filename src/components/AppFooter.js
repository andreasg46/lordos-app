import React from 'react'
import { CButton, CFooter } from '@coreui/react-pro'
import { useNavigate } from 'react-router-dom';
import { getCookie } from 'src/views/application/functions/cookies'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'

const AppFooter = () => {
  const navigate = useNavigate();
  return (
    <CFooter>
      <div>
        <a href="https://silversky3d.com" target="_blank" rel="noopener noreferrer">
          SS3D
        </a>
        <span className="ms-1">&copy; 2022 silversky3DLabs.</span>
      </div>
      <div className='ms-1' style={{ display: getCookie('is_admin') === 'true' ? 'block' : 'none' }}>
        <CButton variant='outline'
          onClick={() => {
            navigate('/admin')
          }}>
          <CIcon icon={cilLockLocked} size={'lg'} ></CIcon><strong>Administrator Settings</strong>
        </CButton>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

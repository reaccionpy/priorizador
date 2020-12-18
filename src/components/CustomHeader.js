import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Menu from './Menu';

export default function CustomHeader(props) {
  const [showMenu, setShowMenu] = React.useState(false);
  return (
    <>
      <div className="header" style={{ maxHeight: '20vh' }}>
        <div className="header-info" style={{ marginRight: '15px' }}>
          <MenuOutlined onClick={() => setShowMenu(!showMenu)} />
        </div>
        <img
          className="header-logo"
          src="priorizador_logo_1_blanco_horizontal.png"
          alt="Priorizador"
          style={{ height: 43, marginLeft: '-10px' }}
        />
        <div className="header-right">
          <img
            className="header-logo"
            src={
              props.showSelector
                ? 'reaccion-logo-white.svg'
                : 'isotipo-reaccion-white.svg'
            }
            alt="Reaccion"
            style={{ height: 43 }}
          />
          <img
            className="header-logo"
            src={
              props.showSelector
                ? 'codium-logo-white.svg'
                : 'isotipo-codium-white.svg'
            }
            alt="Codium"
            style={{ height: 38 }}
          />
        </div>
      </div>
      <Menu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        isDesktop={props.showSelector}
      />
    </>
  );
}

import React from 'react';
import '../css/menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faMap,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function Menu(props) {
  return (
    <>
      {props.isDesktop && (
        <div
          className={props.showMenu ? 'menu-sidebar' : 'menu-sidebar collapsed'}
        >
          <Link
            className="menu-link"
            to="/about"
            onClick={() => props.setShowMenu(!props.showMenu)}
          >
            <div className="menu-option">
              <div className="menu-option-icon">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <div className="menu-option-desc">Acerca de</div>
            </div>
          </Link>
          <Link
            className="menu-link"
            to="/"
            onClick={() => props.setShowMenu(!props.showMenu)}
          >
            <div className="menu-option">
              <div className="menu-option-icon">
                <FontAwesomeIcon icon={faMap} />
              </div>
              <div className="menu-option-desc">Mapa</div>
            </div>
          </Link>
          <Link
            className="menu-link"
            to="/analysis"
            onClick={() => props.setShowMenu(!props.showMenu)}
          >
            <div className="menu-option">
              <div className="menu-option-icon">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <div className="menu-option-desc">An&aacute;lisis</div>
            </div>
          </Link>
        </div>
      )}
      {!props.isDesktop && (
        <div className={props.showMenu ? 'menu' : 'menu collapsed'}>
          <Link
            className="menu-link"
            to="/about"
            onClick={() => props.setShowMenu(!props.showMenu)}
          >
            <div className="menu-option"> Acerca de </div>
          </Link>
          <Link
            className="menu-link"
            to="/"
            onClick={() => props.setShowMenu(!props.showMenu)}
          >
            <div className="menu-option"> Mapa </div>
          </Link>
          <Link
            className="menu-link"
            to="/analysis"
            onClick={() => props.setShowMenu(!props.showMenu)}
          >
            <div className="menu-option"> An&aacute;lisis </div>
          </Link>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';

export default function TextSwitch(props) {
  const [showText, setshowText] = useState(
    props.showText !== undefined ? props.showText : false
  );
  let title = props.title !== undefined ? props.title : '';

  const onHandleSwitch = () => {
    setshowText(!showText);
  };

  return (
    <>
      <div onClick={() => onHandleSwitch()}>
        <h2>
          <FontAwesomeIcon icon={showText ? faMinusSquare : faPlusSquare} />
          &nbsp; {title}
        </h2>
      </div>
      {showText && props.children}
    </>
  );
}

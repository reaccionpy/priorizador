import '../css/colorscale.css';
import React, { useEffect, useState } from 'react';

export default function ColorScale(props) {
  var colorsAndQuantities = props.colorsAndQuantities;
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const removeDuplicateArrays = array => {
      return Array.from(new Set(array.map(JSON.stringify)), JSON.parse);
    };

    colorsAndQuantities = removeDuplicateArrays(colorsAndQuantities);

    // order by quantity
    colorsAndQuantities = colorsAndQuantities.sort(function(a, b) {
      return b[1] - a[1];
    });

    let labelsArray = [];
    for (let i = 0; i < colorsAndQuantities.length; i++) {
      const label = (
        <>
          <i
            style={{ background: colorsAndQuantities[i][0] }}
            key={colorsAndQuantities[i][0]}
          ></i>
          &nbsp; {colorsAndQuantities[i][1]} <br></br>
        </>
      );
      labelsArray.push(label);
    }

    setLabels(labelsArray);
  }, [props.colorsAndQuantities]);

  return (
    <>
      {colorsAndQuantities.length}
      {labels.length > 0 && (
        <div id="info-legend" className="info legend">
          {labels.map(label => label)}
        </div>
      )}
    </>
  );
}

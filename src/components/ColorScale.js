import '../css/colorscale.css';
import React, { useEffect, useState } from 'react';

export default function ColorScale(props) {
  const { colorsAndQuantities, colorBy } = props;
  const [labels, setLabels] = useState([]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const removeDuplicateArrays = array => {
      return Array.from(new Set(array.map(JSON.stringify)), JSON.parse);
    };

    var uniqueColorsAndQuantities = removeDuplicateArrays(colorsAndQuantities);

    uniqueColorsAndQuantities = uniqueColorsAndQuantities.sort((a, b) => {
      return a[1] - b[1];
    });

    const getMaxAndMinQuantitiesFromColor = color => {
      const quantitiesWithColor = uniqueColorsAndQuantities.filter(array => {
        return array[0] === color;
      });
      const quantitiesOnly = quantitiesWithColor.map(array => array[1]);
      var maxQuantity = Math.max(...quantitiesOnly);
      var minQuantity = Math.min(...quantitiesOnly);
      return { max: maxQuantity, min: minQuantity };
    };

    var availableColors = [
      ...new Set(uniqueColorsAndQuantities.map(array => array[0]))
    ];

    var labelsArray = [];
    for (var index = 0; index < availableColors.length; index++) {
      var color = availableColors[index];
      var maxAndMinQuantity = getMaxAndMinQuantitiesFromColor(color);
      const max = maxAndMinQuantity['max'];
      const min = maxAndMinQuantity['min'];
      const label = (
        <>
          <div
            style={{
              paddingRight: '10px',
              paddingLeft: '10px',
              minWidth: '50px'
            }}
          >
            {max !== min ? min + ' - ' + max : min}
          </div>
          <div
            style={{ background: color, opacity: '1', height: '15px' }}
          ></div>
        </>
      );
      labelsArray.push(label);
    }
    setLabels(labelsArray.slice());
  }, [colorsAndQuantities]);

  useEffect(() => {
    switch (colorBy) {
      case 'tekopora':
        setTopic('beneficiarios');
        break;
      case 'fundacion':
        setTopic('familias en situación de pobreza');
        break;
      case 'techo':
        setTopic('asentamientos');
        break;
      case 'almuerzo':
        setTopic('escuelas priorizadas');
        break;
      case 'ande':
        setTopic('beneficiados');
        break;
      default:
        break;
    }
  }, [colorBy]);

  return (
    <>
      {labels.length > 1 && (
        <>
          <div id="info-legend" className="info legend">
            <div id="data" style={{ display: 'inline-block' }}>
              {labels.map((label, index) => {
                return (
                  <div style={{ float: 'left' }} key={index}>
                    {label}
                  </div>
                );
              })}
            </div>
            <div id="title">Cantidad de {topic}</div>
          </div>
        </>
      )}
    </>
  );
}

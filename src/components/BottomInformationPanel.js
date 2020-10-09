import React from 'react';

export default function BottomInformationPanel(props) {
  const [panelClass, setPanelClass] = React.useState('');
  const title = 'Panel Informativo: Titulo';
  const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Aliquam varius metus quis ornare interdum. Mauris sit amet urna diam. Ut dolor
   ipsum, commodo ac odio quis, pharetra ultrices sapien. Sed viverra ipsum sit
   amet nibh molestie porttitor. Pellentesque habitant morbi tristique senectus
   et netus et malesuada fames ac turpis egestas. Nullam eu pharetra ligula, nec
    gravida purus. Donec efficitur ultricies gravida. Donec tincidunt diam a
    libero efficitur rhoncus. Donec sagittis varius ornare. Suspendisse libero
    justo, finibus non lorem sit amet, dapibus volutpat augue. Etiam et
    vestibulum massa. Donec euismod lectus ut sem condimentum, non iaculis
    mauris congue. Suspendisse at aliquet dolor. Praesent nisl odio, finibus
    non volutpat vel, tristique et dui. Suspendisse placerat dolor vitae urna
    volutpat ullamcorper. Nulla ornare volutpat ligula, sed pharetra quam
    bibendum ut.
    `;

  return (
    <>
      {
        <>
          <button
            id="show-panel-button"
            onClick={() => setPanelClass('')}
            className={panelClass}
          >
            <div style={{ fontSize: '20px' }}> &#94; </div>
          </button>
        </>
      }
      {
        <div id="bottom-information-panel" className={panelClass}>
          <div className="card">
            <div
              style={{
                cursor: 'pointer',
                float: 'right',
                marginTop: '5px',
                width: '20px'
              }}
              onClick={() => setPanelClass('hide')}
            >
              &#x2716;
            </div>

            <h1> {title} </h1>

            <hr />
            <p style={{ fontSize: '18px' }}> {content} </p>
          </div>
          {/* <Card title={title}>{content}</Card> */}
        </div>
      }
    </>
  );
}

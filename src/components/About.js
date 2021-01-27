import React from 'react';
import '../css/about.css';

export default function About() {
  return (
    <>
      <div className="about-content">
        <h1>Priorizador v1.0</h1>
        <h2> ¿Qu&eacute; es el Priorizador? </h2>
        <p>
          El Priorizador es una herramienta que contribuye a identificar los
          barrios m&aacute;s vulnerables de un municipio y visibilizar el
          destino de la ayuda de fuentes p&uacute;blicas o privadas.
        </p>
        <p>
          La herramienta se encuentra en su primera versi&oacute;n y
          seguir&aacute; en desarrollo para facilitar la focalizaci&oacute;n
          basada en evidencia de pol&iacute;ticas p&uacute;blicas.
        </p>

        <h2>&iquest;Cu&aacute;les son los objetivos del Priorizador?</h2>

        <p>
          La pandemia COVID-19 expuso la necesidad de invertir eficientemente
          los pocos recursos disponibles. No hay suficientes recursos para
          beneficiar a todas las familias que necesitan ayuda por lo que primero
          se debe priorizar y canalizar ayuda hacia aquellas que m&aacute;s
          necesitan.
        </p>

        <ol>
          <li>
            Identificar los barrios donde las necesidades y vulnerabilidades ya
            exist&iacute;an antes de la pandemia para permitir la
            focalizaci&oacute;n de la ayuda en donde m&aacute;s se necesita.
          </li>
          <li>
            Visibilizar y analizar si la ayuda de fuentes p&uacute;blicas y
            privadas ha alcanzado prioritariamente a los barrios y familias
            m&aacute;s necesitadas del municipio.
          </li>
        </ol>

        <h2>
          &iquest;C&oacute;mo se identifican los barrios m&aacute;s vulnerables?
        </h2>
        <p>
          El Priorizador utiliza distintas bases de datos de fuentes oficiales
          del gobierno y de la sociedad civil que podr&iacute;an sugerir la
          concentraci&oacute;n de mayores necesidades en ciertos barrios de un
          municipio.
        </p>
        <p>
          Entre mayor la superposici&oacute;n de variables que indican
          vulnerabilidad en una zona, mayor la certeza de que se trata de un
          barrio que necesita ser priorizado. Por ejemplo, la cantidad de
          familias beneficiadas por el <u>Programa Tekopor&atilde;</u> en un
          mismo barrio sugiere que ese espacio geogr&aacute;fico tiene
          caracter&iacute;sticas diferentes a otros. Para reforzar la
          hip&oacute;tesis de que ese barrio tiene m&aacute;s necesidades que
          otros en t&eacute;rminos comparativos tambi&eacute;n se contabilizan
          otras variables relacionadas como la cantidad de familias beneficiadas
          por la <u>Tarifa Social de la ANDE</u>. Tanto Tekopor&atilde; como la
          Tarifa Social son programas que se asignan luego de comprobar que las
          familias realmente sufren cierto tipo de vulnerabilidad o pobreza.
        </p>
        <p>
          Se asume que aquellos barrios que ya ten&iacute;an muchas necesidades,
          vulnerabilidades y pobreza antes de la pandemia, habr&aacute;n
          empeorado desde su inicio.
        </p>

        <h2>&iquest;C&oacute;mo interpretar la informaci&oacute;n?</h2>
        <p>
          La herramienta tiene datos para 4 municipios de Alto Paran&aacute;:
          Ciudad del Este, Hernandarias, Presidente Franco y Minga Guaz&uacute;.
          Se pueden activar o desactivar dos filtros, cuya presentaci&oacute;n
          en el mapa es distinta.
        </p>
        <p>
          Todas las variables sobre subsidios que indican necesidades se exponen
          como mapas de calor: entre m&aacute;s oscuro el color, mayor la
          concentraci&oacute;n y por ende mayor la necesidad.
        </p>
        <p>
          Las variables de ayuda se presentan como puntos, permitiendo que se
          superpongan al mapa de calor de necesidades.
        </p>
        <p>
          Idealmente, los barrios de color m&aacute;s oscuro en el mapa (los
          m&aacute;s necesitados) deber&iacute;an tener una mayor
          concentraci&oacute;n de puntos por ayuda entregada. Esto
          implicar&iacute;a que la ayuda se concentr&oacute; en donde m&aacute;s
          se necesitaba. Por otro lado, si los puntos de ayuda se concentran
          sobre &aacute;reas de color claro, esto significar&iacute;a que los
          recursos no se focalizaron donde hab&iacute;a mayor urgencia.
        </p>

        <h2> &iquest;Cu&aacute;les son los datos utilizados? </h2>
        <p> Necesidades: </p>
        <ul>
          <li>
            Cantidad de beneficiarios del Programa Tekopor&atilde; por barrios
            (2020).
          </li>
          <li>
            Listado de beneficiarios de la Tarifa Social de la ANDE (2020).
          </li>
          <li>Mapeo de asentamientos - TECHO (2019). </li>
          <li>
            Instituciones Educativas que reciben Almuerzo Escolar MEC
            (2015-2020).
          </li>
          <li>
            Sem&aacute;foro de Eliminaci&oacute;n de la Pobreza -
            Fundaci&oacute;n Paraguaya (2015).
          </li>
        </ul>

        <p>Ayuda:</p>
        <ul>
          <li>
            <a href="https://d-riveros-garcia.medium.com/pintar-la-ciudad-con-tu-ayuda-pintaconayuda-8c8656cd8e22">
              Pint&aacute; con Ayuda
            </a>{' '}
            (2020).
          </li>
          <li>
            Distribuci&oacute;n de cestas b&aacute;sicas - Municipalidad de
            Ciudad del Este (2020).
          </li>
        </ul>

        <br></br>

        <p>&Uacute;ltima actualizaci&oacute;n: 27/01/2021</p>

        <br></br>

        <p>
          M&aacute;s informaci&oacute;n sobre el origen de la herramienta en
          este{' '}
          <a href="https://d-riveros-garcia.medium.com/una-propuesta-para-que-la-ayuda-covid-19-llegue-a-tantas-familias-paraguayas-como-sea-posible-8adfe1101806">
            {' '}
            link{' '}
          </a>
          .
        </p>
      </div>
    </>
  );
}

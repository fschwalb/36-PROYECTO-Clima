const container  = document.querySelector('.container');
const resultado  = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener( 'load', () => {

    formulario.addEventListener( 'submit', buscarClima );

});

function buscarClima( e ) {

    e.preventDefault();

    // Validar Formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if( ciudad === '' || pais === '' ) {
        mostrarError( 'Ambos campos son obligatorios' );

        return
    };

    // Consultar API
    consutlarAPI( ciudad, pais );

};

function mostrarError( mensaje ) {

    const alerta = document.querySelector('.bg-red-100');

    if( !alerta ) {

        // Crear una Alerta
        const alerta = document.createElement('div');
    
        alerta.classList.add( 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center' );
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${ mensaje }</span>
        `;
    
        container.appendChild( alerta );

        // Eliminar la Alerta con setTimeOut
        setTimeout(() => {
            alerta.remove();
        }, 2500);

    };


};

function consutlarAPI( ciudad, pais ) {

    const appId = '43860d8cd999a27c3259f5ffa4fbd1a6';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ ciudad },${ pais }&appid=${ appId }`;

    // Muestra Spinner de Loading
    Spinner();

    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( datos => {

            // Limpiar el HTML previo
            limpiarHTML();

            if( datos.cod === '404' ) {
                mostrarError( 'Ciudad no encontrada' )

                return;
            };
            
            //Imprime la respuesta en el HTML
            mostrarClima( datos );

        })


};

function mostrarClima( datos ) {

    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados( temp );
    const max = kelvinACentigrados( temp_max );
    const min = kelvinACentigrados( temp_min );

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${ name }`;
    nombreCiudad.classList.add( 'font-bold', 'text-2xl' );

    const actual = document.createElement('p');
    actual.innerHTML = `${ centigrados } &#8451;`;
    actual.classList.add( 'font-bold', 'text-6xl' );

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${ max } &#8451`;
    tempMaxima.classList.add( 'text-xl' );

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${ min } &#8451`;
    tempMinima.classList.add( 'text-xl' );

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add( 'text-center', 'text-white' );

    resultadoDiv.appendChild( nombreCiudad );
    resultadoDiv.appendChild( actual );
    resultadoDiv.appendChild( tempMinima );
    resultadoDiv.appendChild( tempMaxima );
    resultado.appendChild( resultadoDiv );

};

const kelvinACentigrados = grados => parseInt( grados -273.15 );

function limpiarHTML() {

    while ( resultado.firstChild ) {
        resultado.removeChild( resultado.firstChild );
    };

};

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add( 'sk-chase', 'mx-auto' );

    divSpinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild( divSpinner );
    
};
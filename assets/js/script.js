// wait until DOM it's fully loaded
$('document').ready(function () {
  $('#form').on('submit', function (event) {
    event.preventDefault();
    // guardar parametro de busqueda & convertirlo a numero
    let searchQuery = parseInt($('#searchInpt').val());

    // Si el parametro es "falso" (en js existen los valores "falsey") &&
    // si la cadena es vacía, se envía alert para pedir valor numérico
    // caso contrario, se ejecuta la lógica
    if (searchQuery && searchQuery !== '') {
      // preparar objeto con parametros de la función
      let requestData = {
        url:
          'https://www.superheroapi.com/api.php/10222117104690713/' +
          searchQuery,
        contentType: 'application/json; charset=utf-8',
      };

      // Llamada a función de Ajax (se usa when porque usé la función fuera y la llamo
      // , lo que devuelve una "promesa"... when solo se ejecuta cuando esa promesa esta finalizada)
      $.when(getAjaxData(requestData)).then((data) => {
        console.log(data);

        // modificar el DOM con los detalles de superheroe
        $('#hero-img').attr('src', data.image.url);
        $('#hero-name').text(data.name);
        $('#hero-connections').text(data.connections['group-affiliation']);
        $('#hero-occupation').text(data.work.occupation);
        $('#hero-fAppearance').text(data.biography['first-appearance']);
        $('#hero-height').text(data.appearance.height.join(' - '));
        $('#hero-weight').text(data.appearance.weight.join(' - '));
        $('#hero-aliases').text(data.biography.aliases.join(', '));
        // mostrar tabla solo cuando se obtienen resultados modificando CSS
        $('#hero-details').css('display', 'block');

        // GRAFICO
        // guardar data.powerstats en una variable para reducir la
        // cantidad de escritura posterior
        let powerstats = data.powerstats;
        // console.log(powerstats);

        // Creación de objeto CanvasJs pasando los parametros
        // como indica la documentación
        var chart = new CanvasJS.Chart('chartContainer', {
          animationEnabled: true,
          title: {
            text: 'Desktop Search Engine Market Share - 2016',
          },
          data: [
            {
              type: 'pie',
              startAngle: 240,
              yValueFormatString: '##0.00"%"',
              indexLabel: '{label} {y}',
              dataPoints: [
                // acá se agregan los valores obtenidos en powerstats
                { y: powerstats.combat, label: 'Combate' },
                { y: powerstats.durability, label: 'Durabilidad' },
                { y: powerstats.intelligence, label: 'Inteligencia' },
                { y: powerstats.power, label: 'Poder' },
                { y: powerstats.speed, label: 'Velocidad' },
                { y: powerstats.strength, label: 'Fuerza' },
              ],
            },
          ],
        });

        // llamada al objeto Canvas generado
        chart.render();
      });
    } else {
      alert('Debe ingresar solo numeros');
    }
  });
});

// FUNCTIONS
async function getAjaxData({ url, contentType }) {
  let response;
  await $.ajax({
    url,
    contentType,
  })
    .then((res) => (response = res))
    .catch((err) => (response = err));

  return response;
}

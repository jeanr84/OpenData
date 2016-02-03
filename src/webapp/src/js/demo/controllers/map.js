(function () {
  'use strict';

  angular
    .module('material-lite')
    .controller('MapController', ['$scope', MapController]);

  function MapController($scope) {
    var container = d3.select('#map').node().getBoundingClientRect();

    var width = container.width;
    var height = 400;

    /*
     * On créait un nouvel objet path qui permet
     * de manipuler les données géographiques.
     */
    var path = d3.geo.path();

    // On définit les propriétés de la projection à utiliser
    var projection = d3.geo.conicConformal() // Lambert-93
      .center([2.454071, 47.279229]) // On centre la carte sur la France
      .scale(1700)
      .translate([width / 2, height / 2]);

    path.projection(projection); // On assigne la projection au path

    /*
     * On créait un nouvel élément svg à la racine de notre div #map,
     * définie plus haut dans le HTML
     */
    var svg = d3.select('#map').append("svg")
      .attr("width", width)
      .attr("height", height);

    /*
     * On créait un groupe SVG qui va accueillir toutes nos régions
     */
    var regions = svg
      .append("g")
      .attr("id", "regions");

    /*
     * On charge les données GeoJSON
     */

    d3.json('regions.json', function (req, geojson) {
      /*
       * On "bind" un élément SVG path pour chaque entrée
       * du tableau features de notre objet geojson
       */
      var features = regions
        .selectAll("path")
        .data(geojson.features);

      /*
       * On créait un ColorScale, qui va nous
       * permettre d'assigner plus tard une
       * couleur de fond à chacun de nos
       * départements
       */
      var colorScale = d3.scale.category20();

      /*
       * Pour chaque entrée du tableau feature, on
       * créait un élément SVG path, avec les
       * propriétés suivantes
       */
      features.enter()
        .append("path")
        .attr('class', 'region')
        .attr('fill', function (d) {
          return colorScale(+d.properties.CODE_REG);
        })
        .attr("d", path)
        .on('click', regionClickHandler);

    });

    function regionClickHandler(d) {

      var nomFichier = "./regions/reg" + d.properties.CODE_REG + ".json";

      /*
       * On créait un groupe SVG qui va accueillir
       * tous nos départements
       */
      var deps = svg
        .append("g")
        .attr("id", "departements");

      d3.json(nomFichier, function (req, geojson) {

        var features = deps
          .selectAll("path")
          .data(geojson.features);

        var colorScale = d3.scale.category20c();

        features.enter()
          .append("path")
          .attr('class', 'departement')
          .attr('fill', function (d) {
            return colorScale(+d.properties.CODE_DEPT);
          })
          .attr("d", path);

      });

    }
  }

})();

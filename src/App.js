import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import Place from './Place';
import PlaceNearby from './PlaceNearby';
import Comentario from './Comentario'
import './App.css'
import './estilos.css'

class App extends Component {
  constructor(props){
    super(props);
    this.state={photo:'',pyrmont:'',morePlaces:'none', getNextPage:null, mensajeCercanos:'Mas lugares', nextPageExist:true,desdeHasta:'partida',inicio:null,destino:null}
  }

  map=''

  componentDidMount(){
    const googlePlaceAPILoad = setInterval(() => {
      if (window.google){
        this.google=window.google;
        clearInterval(googlePlaceAPILoad);
        const mapCenter = new this.google.maps.LatLng(4.624335,-74.064644);
        this.map = new this.google.maps.Map(document.getElementById('map'), {
          center: mapCenter,
          zoom: 15
        });
        var marcador = new this.google.maps.Marker({position:mapCenter, map:this.map})
        this.showMap(mapCenter);
      };
    },100);
  }

  showMap(mapCenter) {
    // The map, centered at Uluru
    this.map = new window.google.maps.Map(
        document.getElementById('map'), {zoom: 15, center: mapCenter});
    // The marker, positioned at Uluru
    var marker = new window.google.maps.Marker({position: mapCenter, map: this.map});
  }

  manejoOnClick = (e) => {
    var findValue = e.target.id==='botonBusqueda'? document.getElementById('origen').value:e.target.id;
    this.setState({photo:'',pyrmont:'',placesNearby:[''],morePlaces:'none'})
    const request = {
      query: findValue,
      fields: ['photos', 'formatted_address', 'name','place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, this.findPlaceResult);
  }

  findPlaceResult = (results, status) => {
    var placesTemp=[]
    var placeId = ''
    if (status ===  'OK') {
      results.map((place) => {
        var placePhotos=['']
        const placeTemp = {id:place.place_id, name:place.name,
          address:place.formatted_address,photos:placePhotos,horario:place.url}
          placeId = place.place_id;
        placesTemp.push(<Place placeData={placeTemp}/>);
      })
    }
    if (placesTemp.length>0)
      this.findPlaceDetail(placeId);
    else{
      const placeTemp = {id:'N/A', name:<div className='mt-5'><strong className='text-center'>
          No hay resultados</strong></div>,
        address:'',photos:['']}
      placesTemp.push(<Place placeData={placeTemp}/>);
      this.setState({places:placesTemp})
    }
    
  }

  findPlaceDetail = (placeIdFound) => {
    var request = {
      placeId: placeIdFound
    };
    this.service.getDetails(request, this.foundPlaceDatail);
  }

  foundPlaceDatail = (place, status) => {
    if (status === 'OK'){
      var placePhotos=['']
      if (place.photos){
        place.photos.map((placePhoto, index) => {
          placePhotos[index]=placePhoto.getUrl({'maxWidth': 160, 'maxHeight': 120})
          if (index === 6) return;
        })
      }

      const horarios = place.opening_hours ? place.opening_hours.weekday_text.map((dia)=>{return(<div>{dia}</div>)}) : '';
      const comentario = place.reviews ? place.reviews.map((comentarioSub)=>{return(<Comentario comentarios={comentarioSub}></Comentario>)}) : '';
      const placeTemp = { id:place.place_id, 
                          name:place.name,
                          address:place.formatted_address,
                          photos:placePhotos, 
                          website:place.website,
                          horario:horarios,
                          calificacion:place.rating,
                          comentarios:comentario,
                          types:place.types
                        }
      const placesTemp = <Place placeData={placeTemp}/>;
      
      this.setState({places:placesTemp,pyrmont:place.geometry.location,inicio:placesTemp.props.placeData.address})
      this.showMap(place.geometry.location);
    }
  }

  manejoOnClickNearby = (e) =>{
    var pyrmont = this.state.pyrmont;
    var types = this.state.places.types;

    this.service.nearbySearch(
      {location: pyrmont, radius: 1000, type: types},
      this.search);

  }

  search = (results, status, pagination) => {
    if (status !== 'OK') return;  

    const placesTempNearby = results.map((resultado,index)=>{
      
        var placePhotos=['']
        if (resultado.photos){
          resultado.photos.map((placePhoto, i) => {
            placePhotos[i]=placePhoto.getUrl({'maxWidth': 160, 'maxHeight': 120})
          })
        }
        const placesTempNearbyI = {
                                    photos:placePhotos,
                                    name:resultado.name,
                                    rating:resultado.rating
                                  }
        return(<PlaceNearby funcionActualizar={this.manejoOnClick} placeData={placesTempNearbyI}></PlaceNearby>)
      
    })

    const masPagina = 'block';
    this.setState({mensajeCercanos:'Mas lugares'})
    
    this.state.getNextPage = pagination.hasNextPage && function() {
      pagination.nextPage();
    };


    this.setState({placesNearby:placesTempNearby.slice(0,9),placesNearbyAll:placesTempNearby.slice(9,placesTempNearby.length),morePlaces:masPagina,nextPageExist:pagination.hasNextPage})
  }

  manejoOnClickNearby2 = (e) =>{
    
      if(!this.state.placesNearbyAll.length){
        this.setState({mensajeCercanos:'Mas lugares'})
        if (this.state.getNextPage) this.state.getNextPage();
      }else{
        var newPlaces = this.state.placesNearby;
        newPlaces.push(this.state.placesNearbyAll.slice(0,3));
        this.setState({placesNearby:newPlaces,placesNearbyAll:this.state.placesNearbyAll.slice(3,this.state.placesNearbyAll.length)}) 
        if(this.state.placesNearbyAll.length<3){
          this.setState({mensajeCercanos:'Siguiente pagina'})
          if(!this.state.nextPageExist){
            this.setState({mensajeCercanos:''})
          }
        }     
      
    }
   }

   manejoOnClickDireccionamiento = (e) => {
    this.showMap(this.state.pyrmont);
    if(!document.getElementById('punto2').value){
      alert(`Ingrese punto de ${this.state.desdeHasta}`)
    }else{
      var directionsService = new this.google.maps.DirectionsService;
      var directionsRenderer = new this.google.maps.DirectionsRenderer({map: this.map});
      var stepDisplay = new this.google.maps.InfoWindow;
      var markerArray = [];

      this.calculateAndDisplayRoute(directionsRenderer, directionsService, markerArray, stepDisplay, this.map);
    }
    /*
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
    */

   }
   
  calculateAndDisplayRoute(directionsRenderer, directionsService,markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap( );
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
      origin: this.state.inicio, //punto de inicio
      destination: this.state.destino, //this.state.places.props.placeData.address, //punto de fin
      travelMode: document.getElementById('medio').value //metodo de viaje
    }, (response, status) => {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      if (status === 'OK') {

        document.getElementById('warnings-panel').innerHTML =
          response.routes[0].warnings ? '<b>' + response.routes[0].warnings + '</b>':'';
        directionsRenderer.setDirections(response);
        this.showSteps(response, markerArray, stepDisplay, map);
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  }

  showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
      var marker = markerArray[i] =  new this.google.maps.Marker;
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(
          stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
  }

  attachInstructionText(stepDisplay, marker, text, map) {
    
    
    this.google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }

  changeMode=()=>{
    const inicioChanger=this.state.destino;
    const destinoChanger=this.state.inicio;
    this.setState({
      desdeHasta:this.state.desdeHasta==='partida'?'destino':'partida',
      inicio:inicioChanger,
      destino:destinoChanger
    })    
  }

  agregarPuntoDestino=()=>{
    this.setState({destino:document.getElementById('punto2').value});
  }






  render() {
    return (
      <div className="App" >
     
        <div className='container border rounded p-3 mt-4' style={{width:'50%'}}>
          <div className='row'>
            <div className='col-4'></div>
            <div className='col-4 text-center'>
              <label><strong>Indica el lugar</strong></label>
            </div>
            <div className='col-4'></div>
          </div>
          <div className='row'>
            <div className='col-4'></div>
            <div className='col-4 py-2'><input id='origen' type='text' placeholder='Lugar a buscar'/*onKeyPress={this.manejoOnClick}*//></div>
            <div className='col-4'></div>
          </div>
          <div className='row'>
            <div className='col-4'></div>
            <div className='col-4 text-center'>
              <div id='botonBusqueda' className='btn btn-primary text-center' onClick={this.manejoOnClick}>Buscar Lugar</div>
            </div>
            <div className='col-4'></div>
          </div>
          {this.state.places}
          <br/>
          <div style={{display:this.state.pyrmont?'block':'none'}} className='row'>
            <div className='col-12 text-center'>
              <div className='btn btn-primary text-center' onClick={this.manejoOnClickNearby} id='NearbyPlaces'>Lugares Cercanos Similares</div>

                <div style={{display:'inline'}} className='row container2'>{this.state.placesNearby}</div>

              <p className='text-center pb-0 mb-0'>
                <small><a style={{cursor:'pointer', color:'blue', display:this.state.morePlaces}} onClick={this.manejoOnClickNearby2} id='morePlaces'>{this.state.mensajeCercanos}</a></small>
              </p>
            </div>
          </div>
          <br/>
          <div style={{display:this.state.pyrmont?'block':'none'}} className='row'>
            <div className='col-12 text-center'>
              <div className='btn btn-primary text-center' onClick={this.manejoOnClickDireccionamiento} id='Directions'>Dirigirse all&iacute;</div>              
            </div>
            <br/>
            <div className='col-12 text-center'>
              <div>{'Punto de '+this.state.desdeHasta+': '}</div>
            </div>
            <div className='col-12 py-2'>
              <i onClick={this.changeMode}class="btn fa fa-refresh fa-2x fa-fw" aria-hidden="true"></i>
              <input id='punto2' type='text' placeholder={'Punto de '+this.state.desdeHasta} onKeyPress={this.agregarPuntoDestino}/>
            </div>
            <select id="medio">
              <option value="DRIVING">Veh&iacute;culo</option>
              <option value="WALKING">Caminata</option>
              <option value="BICYCLING">Bicicleta</option>
              <option value="TRANSIT">Transporte P&uacute;blico</option>
            </select>
            <div id="warnings-panel"></div>
          </div>
          <br/>
          <div id='map' className='mt-2' ></div>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'

export default class PlaceNearby extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  manejoOnClickPlaceNearby = (e) => {
    /*${this.props.placeData.name}*/
      var entrada=document.getElementById('origen');
      this.props.funcionActualizar(e);
      console.log(e.target.id)
      
      
  }

  render() {
    var htmlPhotos=[];
    this.props.placeData.photos.map((photo, index) => {
      htmlPhotos.push(
        <div id={this.props.placeData.name} key={index} className={'col-12 text-center'} >
          <img id={this.props.placeData.name}  key={index} src={photo} alt={this.props.placeData.name}/>
        </div>);
        if (index === 1) return
    })
    return (
      <div id={this.props.placeData.name} style={{cursor:'pointer'}} onClick={this.manejoOnClickPlaceNearby} className='col-4 fa-border' >
        <div id={this.props.placeData.name} className='text-center' >
            {this.props.placeData.name}
        </div>
        <div id={this.props.placeData.name} className='text-center' >
            Calificaci&oacute;n: {this.props.placeData.rating? this.props.placeData.rating:'No tiene'}
        </div>        
        <div id={this.props.placeData.name}>
          {htmlPhotos.slice(0)} 
        </div>  
      </div>
    )
  }
}

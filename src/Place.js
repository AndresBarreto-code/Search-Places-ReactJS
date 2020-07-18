import React, { Component } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import StarRatio from './StarRatio';


export default class Place extends Component {
  constructor(props){
    super(props);
    this.state={
      mostarHorario:'none',
      mostarCalificacion: 'none',
      mostarComentarios: 'none'
    }
  }

  mostarHorario=(e)=>{
    var newState = this.state.mostarHorario === 'block' ? 'none' : 'block';
    this.setState({mostarHorario:newState});
  }

  mostarCalificacion=(e)=>{
    var newState = this.state.mostarCalificacion === 'block' ? 'none' : 'block';
    this.setState({mostarCalificacion:newState});
  }

  mostarComentarios=(e)=>{
    var newState = this.state.mostarComentarios === 'block' ? 'none' : 'block';
    this.setState({mostarComentarios:newState});
  }




  render() {
    var cantPhotos = this.props.placeData.photos.length;
    if (cantPhotos > 6)
      cantPhotos = 6;
    else
      cantPhotos = 3;
    const colSize = 4
    var htmlPhotos=[];
    this.props.placeData.photos.map((photo, index) => {
      htmlPhotos.push(
        <div key={index} className={'col-'+colSize+' text-center'} >
          <img key={index} src={photo} alt={this.props.placeData.name}/>
        </div>);
        if (index === (cantPhotos-1)) return
    })
    return (
      <div>
        <div className='row py-2'>
          <div className='col-12 text-center' >{this.props.placeData.name}</div>
        </div>
        <div className='row py-2'>
          {htmlPhotos.slice(0,3)} 
        </div>
        <div className='row py-2'>
          {htmlPhotos.slice(3,6)} 
        </div>
        <div className='row' >
          <div className='col-12 text-center'> {this.props.placeData.address}</div>
        </div>
        <br/>
        <div className='row' >
          <div className='col-12 text-center'><a style={{cursor:'pointer'}} onClick={this.mostarHorario}><strong>HORARIO:</strong></a>
            <div style={{display:this.state.mostarHorario}}>{this.props.placeData.horario}            
            </div>          
          </div>
        </div>
        <br/>
        <div className='row' >
          <div className='col-12 text-center'><a style={{cursor:'pointer'}}onClick={this.mostarCalificacion}><strong>CALIFICACI&Oacute;N:</strong></a>
            <div style={{display:this.state.mostarCalificacion}}>{this.props.placeData.calificacion}
              <StarRatio rating={this.props.placeData.calificacion}></StarRatio>
            </div>   
          </div>
        </div>
        <br/>
        <div className='row' >
          <div className='col-12 text-center'><a style={{cursor:'pointer'}}onClick={this.mostarComentarios}><strong>COMENTARIOS:</strong></a>
            <ol style={{display:this.state.mostarComentarios}} className='col-12 text-left'>{this.props.placeData.comentarios}            
            </ol>          
          </div>
        </div>
        <br/>
        <div className='row' >
          <div className='col-3'><strong>WEBSITE:</strong></div>
          <div className='col-3'>
            <a href={this.props.placeData.website} target="_blank"> {this.props.placeData.website}</a>
          </div>
        </div>
        
      </div>
    )
  }
}

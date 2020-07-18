import React, { Component } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'

export default class Comentario extends Component {
  constructor(props){
    super(props);
    
  }

  



  
  render() {
    return (   
      
        <li>{this.props.comentarios.author_name} dice: "{this.props.comentarios.text}" {this.props.comentarios.relative_time_description}</li>
         
    )
  }
}

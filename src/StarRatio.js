import React, { Component } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import star2 from './star2.svg';
import backBlue from './plain-blue-background.jpg';

export default class StarRatio extends Component {
  constructor(props){
    super(props);
    
  }
 
  render() {

    const percent = this.props.rating*20;

    const style={
      margin: '0',
      padding: '0',
      backgroundImage: `url(${backBlue})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize:`${percent}%`
    }
    
    
    return (   
      <div key='1001' style={style}>
        <img key='1001' src={star2} alt='rating'></img>
      </div>     
    )
  }
}

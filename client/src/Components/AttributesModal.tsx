
import Modal from 'react-modal';
import { AttributesModalInput } from '../types';




export default function AttributesModal({attributes,headers,setHeaders,modal,showModal}:AttributesModalInput){

  const attributesComponent = attributes.map(entry => {
    let selected = headers.includes(entry)
    return(
      <div 
      className={selected ? 'attribute selected':'attribute'}
      onClick={()=>{
        if(selected){
          let newHeaders = headers.filter(header => header !== entry)
          setHeaders(newHeaders)
        } else {
          setHeaders([...headers,entry])
        }
      }}
    >
      {entry.replace('_',' ')}
    </div>  
    )
  })

  return(
    <Modal 
    className='attributes-modal'
    overlayClassName='attributes-modal-overlay'
    isOpen={modal}
    onRequestClose={()=>showModal(false)}
  >            
    <div 
      style={{position:'absolute',height:'0px',top:'10px',right:'10px',cursor:'pointer'}}
      onClick={()=>showModal(false)}
    >
      &#x2715;
    </div>
    <div className='title'>
      Add Attributes
      <div style={{fontSize:'8pt',fontWeight:'normal',marginTop:'8px',width:'80%',alignSelf:"center"}}>Click on an attribute to add to the visualization. Selectd attributes can also be removed by clicking on them again.</div>
    </div>
    <div className='attributes-container'>
      {attributesComponent}
    </div>
  </Modal>
  )

}
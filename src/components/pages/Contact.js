import {SiWhatsapp, SiGmail } from "react-icons/si";
import { BsFillTelephoneFill } from "react-icons/bs";

import Styles from './Contact.module.css'

function Contact (){
    return(
        <div className={Styles.contact}>
        <h1>Contact</h1>
        <p><BsFillTelephoneFill /> Telefone: (99) 9999-999</p>
        <p><SiGmail /> Email: emailsuaempresa@empresa.com</p>
        <p><SiWhatsapp /> Whatsapp: (99) 9 9999-9999</p> 
        </div>
    )
}

export default Contact
import { Link } from "react-router-dom";

function Navbar(){

return(

<div style={{
display:"flex",
justifyContent:"space-between",
padding:"15px",
background:"#111",
color:"white"
}}>

<h2>SoleMate</h2>

<div>
<Link to="/" style={{marginRight:"20px",color:"white"}}>Home</Link>
<Link to="/cart" style={{color:"white"}}>Cart</Link>
</div>

</div>

)

}

export default Navbar
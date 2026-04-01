import Products from "./Products";

function Home(){

return(

<div>

<div style={{
background:"linear-gradient(to right,#4facfe,#8e44ad)",
padding:"80px",
textAlign:"center",
color:"white"
}}>

<h1>Shop Smarter, Live Better</h1>
<p>Discover thousands of products</p>

</div>

<Products/>

</div>

)

}

export default Home
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Products(){

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  function addToCart(productId){
    fetch("http://127.0.0.1:8000/cart/api/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_id: productId
      })
    })
    .then(res => res.json())
    .then(() => alert("Added To Cart"))
  }

  return(
    <div style={{padding:"40px"}}>

      <h2>Products</h2>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
        gap:"20px"
      }}>

        {products.map(p => (
          <div key={p.id}>

            <img 
              src={`http://127.0.0.1:8000${p.image}`} 
              width="200"
            />

            <h3>
              <Link to={`/product/${p.id}`}>{p.name}</Link>
            </h3>

            <p>₹{p.price}</p>

            <button onClick={() => addToCart(p.id)}>
              Add To Cart
            </button>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Products
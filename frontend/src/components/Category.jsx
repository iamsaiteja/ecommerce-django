function Category(){
  return(
    <div style={{padding:"40px"}}>

      <h2>Shop by Category</h2>

      <div style={{
        display:"flex",
        gap:"20px",
        marginTop:"20px"
      }}>

        <div style={{
          padding:"30px",
          border:"1px solid #eee"
        }}>
          Sneakers
        </div>

        <div style={{
          padding:"30px",
          border:"1px solid #eee"
        }}>
          Mobiles
        </div>

      </div>

    </div>
  )
}

export default Category
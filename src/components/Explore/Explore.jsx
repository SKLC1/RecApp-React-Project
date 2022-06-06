import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Header from "../Utility/Header";
import './Explore.css'
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";


function ExplorePage() {
  const [categoriesArr, setCategoriesArr] = useState([])
  const dataCollectionRef = collection(db, 'Videos')

  useEffect(()=>{
    getCategoryData()
  },[])
  useEffect(()=>{
    insertCategories()
  },[categoriesArr])

  async function getCategoryData(){
    const data = await getDocs(dataCollectionRef)
    setCategoriesArr(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
    console.log(categoriesArr);
  }
  function insertCategories(){
    const filterCategoriesArr = [];
     categoriesArr.forEach(el => {
       if(!filterCategoriesArr.includes(el.category)) filterCategoriesArr.push(el.category)
     })
    return filterCategoriesArr.map((category,idx)=>{
        return <Link key={idx} to={`/category${category}`}><div className='category bn632-hover bn22'>{category}</div></Link>
    })
  }
  return ( 
    <>
      <Header/>
      <div className="flexCol">
        <h3>Our Top Picks</h3>
         <div className="divider"></div>
         this will be top picks cont
        <div className="divider"></div>
        <h4>Find More</h4>
      <div className="categories-container">{insertCategories()}</div>
      </div>
    </>
   )
}

export default ExplorePage;
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import Header from "../../Utility/Header";
import './category.css'
import '../Explore.css'


function Category(props) {
  const [subCategoriesArr, setSubCategoriesArr] = useState([])
  const { chosenCategory } = useParams();
  const videoCollectionRef = collection(db, 'Videos')
  const [isLoading,setIsLoading] = useState(true)
  const [searched,setSearched] = useState("")


  useEffect(()=>{
    getSubcategoryData()
  },[])
  useEffect(()=>{
    insertSubcategories()
    setIsLoading(false)
  },[subCategoriesArr])
  
  async function getSubcategoryData(){
    const data = await getDocs(videoCollectionRef)
    setSubCategoriesArr(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
  }
  function insertSubcategories(value){
    const filterSubCategoriesArr = [];
     subCategoriesArr.forEach(el => {
       if(!filterSubCategoriesArr.includes(el.subCategory)&&(el.category === chosenCategory)
       &&(el.subCategory.toLowerCase().includes(searched.toLowerCase()))) {
         filterSubCategoriesArr.push(el.subCategory)
        }
     })
    return filterSubCategoriesArr.map((subcategory)=>{
        return <Link key={subcategory} to={`/subcategory${subcategory}`}><div className='subcategory bn632-hover bn22'>
          {subcategory}</div></Link>
    })
  }
  function handleSearch(value){
    setSearched(value)
  }
  return ( 
    <>
    <Header/>
       <div className="flexCol">
        <div>{chosenCategory}</div>
        <input placeholder="Search" onChange={(e)=>handleSearch(e.target.value)}></input>
        <div>{`These are all the ${chosenCategory} sub-categories`}</div>
       </div>
      <div className="subcategory-container">
        {isLoading?<div className="lds-dual-ring"></div>:insertSubcategories()}
        </div>
    </>
   );
}
export default Category

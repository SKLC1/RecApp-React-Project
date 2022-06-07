import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { UserContext } from "../../UserContext/UserContext";
import './UserVideos.css'

function UserVideos() {
  const currentUser = useContext(UserContext)
  const [allVideosData,setAllVideosData] = useState([])
  const videoCollectionRef = collection(db, 'Videos')

  useEffect(()=>{
    getVideos()
  },[])
  useEffect(()=>{
    insertUserVideos()
  },[allVideosData])

  async function getVideos() {
    const data = await getDocs(videoCollectionRef)
    setAllVideosData(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
    console.log(allVideosData)
    // setIsLoading(false)
  }
  function insertUserVideos(){
    const userVideosArr = allVideosData.filter(post=>post.user == currentUser.displayName)
    return userVideosArr.map(post=>{
      return <div key={post.id} className='user-video-outer'>
       <video
       key={post.id}
       muted className='user-video' 
       loop autoPlay type={'video/mp4'.toString()} src={post.videoURL}>
       </video>
      </div>
    })
  }
  if (currentUser) { 
    return ( 
      <div className="user-container">    
      <div>
        <img className="user-photo" src={currentUser.photoURL}></img>
        <div className="user-name">{currentUser.displayName}</div>
        <Link to='/upload'>Upload here</Link>
      </div>
      <div className="user-videos-cont">
        {insertUserVideos()}
      </div>
    </div>
   );
  }
}

export default UserVideos;
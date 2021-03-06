import { async } from '@firebase/util';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase/firebase';
import { UserContext } from '../../UserContext/UserContext';
import Comments from '../Comments/Comments';
import './video.css'

function Video({post}) {
  const [playing,setPlaying] = useState(false)
  const [liked,setLiked] = useState(false)
  const [likedCounter,setLikedCounter] = useState(post.likes.length+1)
  const [showComments,setShowComments] = useState(false)
  const [updateLocalLike,setUpdateLocalLike] = useState(false)
  const navigate = useNavigate();
  const videoRef = useRef(null)
  const currentUser = useContext(UserContext)
  // const likedCounter = post.likes.length
  useEffect(()=>{
    if (currentUser) { 
      if(post.likes.includes(currentUser.displayName))
      setLiked(true)
    }
  },[])
  useEffect(()=>{
    if(liked){
      setLikedCounter(likedCounter+1)
    } else {
      setLikedCounter(likedCounter-1)
    }
  },[updateLocalLike])
  function onVideoPress(){
     playing?videoRef.current.play():videoRef.current.pause();
     setPlaying(!playing)
    }
   async function handleLike(){
     if(!currentUser){
      navigate("/login", { replace: true })
     }
     const docRef = doc(db,"Videos",post.id)
     if(!post.likes.includes(currentUser.displayName)){
       try{
         await updateDoc(docRef,{likes: [...post.likes,currentUser.displayName]}) //async
         handleLocalLike()
        } catch(e) {
          console.log(e)
        } 
      } else {
        handleLocalLike()
      }
     function handleLocalLike(){
       setLiked(!liked)
       setUpdateLocalLike(true)
     }
     if (liked){
       console.log(post.id)
       const newLikedCount = [...post.likes].filter(liker=>liker!==currentUser.displayName)
      updateDoc(docRef,{likes: newLikedCount}) 
     } 
  } 

  return ( 
    <>
    <div className='video' id={post.id}>
    <video ref={videoRef} muted loop controls className='video-player'
    autoPlay="autoplay" type={'video/mp4'.toString()} src={post.videoURL}></video>
    {showComments && <Comments className="comment-cont" post={post}/>}
    <div className='uploader-info'>
      <div className='flexCol like-cont'>
     <i className={`fa-solid fa-heart  fa-2x like ${liked && "is-liked"}`} onClick={handleLike}></i>
     <div className='uploader-name'>{likedCounter}</div>
      </div>
      <div className='flexCol like-cont'>
     <i class="fa-solid fa-comment-dots fa-2x" onClick={()=>setShowComments(!showComments)}></i>
     <div className='uploader-name'>{post.comments.length-1}</div>
      </div>
     <div className='uploader-name'>@{post.user}</div>
     <div className='uploader-description'>{post.description}</div>
    </div>
    </div>
    </>
  );
}

export default Video;
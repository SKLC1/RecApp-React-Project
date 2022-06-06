import { async } from "@firebase/util";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app, db, storage } from "../../../firebase/firebase";

function UploadVideo() {
  const [progress, setProgress] = useState(0)
  const [fileUrl, setFileUrl] = useState("")
  const [category, setCategory] = useState()
  const [subCategory, setSubCategory] = useState()
  function formHandler(e){
    e.preventDefault();
    const file = e.target[2].files[0];
    uploadFiles(file)
  }

  function uploadFiles(file){
    if(!file) return;
    const storageRef = ref(storage, `/demoVideos/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed', (snapshot)=>{
      const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      setProgress(prog)
    }, (err) => console.log(err), 
    ()=> {
      getDownloadURL(uploadTask.snapshot.ref)
      .then((url)=>{
        setFileUrl(url)
        console.log(fileUrl)
        addToDataBase(fileUrl)
      })
    })
  }
  async function addToDataBase(url) {
    const collectionRef = collection(db,'Videos');
    const payload = {category: [category], subCategory: [subCategory], user: '', videoURL: [url]} 
    const docRef = await addDoc(collectionRef, payload)
    console.log(docRef.id)
  }
  return ( 
    <div>
      <h2>Upload your Video</h2>
      <form onSubmit={formHandler}>
        <label>Category:</label>
       <input type='text' onChange={(e)=>setCategory(e.target.value)}/>
        <label>SubCategory:</label>
       <input type='text' onChange={(e)=>setSubCategory(e.target.value)}/>
       <input type='file'/>
       <button type="submit">Upload</button>
      </form>
      <h3> Uploaded {progress}%</h3>

    </div>
   )
}

export default UploadVideo;
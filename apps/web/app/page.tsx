"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [slug, setSlug] = useState('');
  const router = useRouter()

  return (
    <div  style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <input style={{
        padding: 10,
        width: 200,
        height: 30
      }}
      value={slug}
      onChange={(e) => {
        setSlug(e.target.value)
      }}
       type="text" />
      <button style={{
        padding: '5px',
        width: '100px'
      }}
      onClick={() => { router.push(`/room/${slug}`)}}>Join</button>
      
    </div>
  );
}

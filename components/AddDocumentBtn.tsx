'use client'
import React from 'react'
import { Button } from './ui/button'
import { createDocument } from '@/lib/actions/room.actions'
import { useRouter } from 'next/navigation'
const AddDocumentBtn = ({userId,email}:AddDocumentBtnProps) => {

    const router=useRouter();
    const addDocumentHandler= async()=>{
        try {
        const room= await createDocument({userId, email})
        if(room) router.push(`/documents/${room.id}`)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button className='gradient-blue flex gap-1 shadow-md' type="submit" onClick={addDocumentHandler}>

        <p className='hidden sm:block'>+ Start a blank document</p>
      
    </Button>
  )
}

export default AddDocumentBtn

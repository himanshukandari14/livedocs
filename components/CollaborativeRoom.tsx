"use client"
import edit from '@/public/assets/icons/edit.svg'
import React, { useEffect, useRef, useState } from 'react'
import {
LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,

} from "@liveblocks/react/suspense";

import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators';
import { Input } from './ui/input';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';
const CollaborativeRoom = ({roomId,roomMetadata,users,currentUserType}: 
  CollaborativeRoomProps) => {

    const[editing,setEditing]= useState(false);
    const[loading, setLoading]=useState(false);
    const [documentTitle,setDocumentTitle]= useState(roomMetadata.title);

    const containerRef=useRef<HTMLDivElement>(null);
     const inputRef=useRef<HTMLDivElement>(null);

    //  update
    const updateTitleHeader= async (e:React.KeyboardEvent<HTMLInputElement>)=>{
      if(e.key == 'Enter'){
        setLoading(true);
        try {
          if(documentTitle !== roomMetadata.title){
            const updatedDocument= await updateDocument(roomId,documentTitle);

            if(updatedDocument){
              setEditing(false)
            }
          }
        } catch (error) {
          console.log(error)
        }

        setLoading(false)
      }
    }

    // for saving title
    useEffect(()=>{
      const handleClickOutside=(e:MouseEvent)=>{
        if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        
      }

      updateDocument(roomId,documentTitle)
      }

      document.addEventListener('mousedown',handleClickOutside);

      return()=>{
        document.removeEventListener('mousedown',handleClickOutside);
      }

    },[roomId,documentTitle])


    useEffect(()=>{
      if(editing && inputRef.current){
        inputRef.current.focus();
      }
    },[editing])
  return (
    <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
         <div ref={containerRef} className='collaborative-room'>

            <Header>
      <div className='flex w-fit items-center justify-center gap-2'>
        {
          editing && !loading ?(
            <Input type='text' value={documentTitle} ref={inputRef} placeholder='Enter Title' onChange={(e) => setDocumentTitle(e.target.value)} onKeyDown={updateTitleHeader} disable={!editing}
            className='document-title-input' />

          ):(
            <>
             <p className='document-title'>{documentTitle}</p>
            </>
          )
        }
       {currentUserType==='editor' && !editing && (
        <Image
        src={edit}
        alt='edit'
        height={24}
        width={24}
        onClick={()=>setEditing(true)}
        className='pointer'
         />
       )}


       {currentUserType !=='editor' && !editing && (
        <p className='view-only-svg'>View only</p>
       )}

       {loading && <p className='text-sm text-gray-400'>saving...</p>}
      </div>
      <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
        <ActiveCollaborators />
        <ShareModal
        roomId={roomId}
        collaborators={users}
        creatorId={roomMetadata.creatorId}
        currentUserType={currentUserType}
         />
        <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      
      </SignedIn>
      </div>
      
      </Header>
      <Editor roomId={roomId} currentUserType={currentUserType} />
         </div>
        </ClientSideSuspense>
      </RoomProvider>
  )
}

export default CollaborativeRoom

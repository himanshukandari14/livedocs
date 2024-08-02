import Image from 'next/image'
import React from 'react'
import loader from '@/public/assets/icons/loader.svg'
const Loader = () => {
  return (
    <div className='loader'>
        <Image
        className='animate-spin'
        src={loader}
        height={32}
        width={32}
        alt='loader' />
        Loading...
      
    </div>
  )
}

export default Loader

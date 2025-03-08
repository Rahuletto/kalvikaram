'use client'

import React, { useState } from 'react'
import { resources } from '@/utils/getResources'
import { BsFileEarmarkPdf } from 'react-icons/bs'
import { TbLayoutSidebarRight } from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'
import { IoLibrarySharp } from 'react-icons/io5'

export default function Resources() {
  const [isOpen, setIsOpen] = useState(true)

  const handleOpenPDF = (filename: string) => {
    window.open(`/resources/${filename}`, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="sidebar"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            duration: 0.15,
            ease: "easeInOut"
          }}
          className='fixed inset-0 md:relative w-[90vw] max-md:left-[10vw] md:w-[20vw] bg-white/95 dark:bg-black/95 md:bg-black/5 md:dark:bg-white/5 backdrop-blur-sm md:rounded-2xl md:backdrop-blur-none z-50'
        >
          <div className='h-full w-full md:rounded-xl p-4 md:p-3 md:px-5'>
            <div className='flex items-center justify-between'>
              <h2 className='font-medium text-sm text-black/60 dark:text-white/60'>Resources</h2>
              <button onClick={() => setIsOpen(false)}>
                <TbLayoutSidebarRight />
              </button>
            </div>
            <div className='mt-3 flex flex-col gap-2 overflow-auto max-h-[92vh] md:max-h-[86vh]'>
              {resources.map((resource, index) => (
                <button
                  key={index}
                  onClick={() => handleOpenPDF(resource.filename)}
                  className='flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150 text-left'
                >
                  <BsFileEarmarkPdf className='text-red text-lg stroke-red fill-red' />
                  <span className='text-sm font-medium'>{resource.title}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="toggle"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            duration: 0.15,
            ease: "easeInOut"
          }}
          onClick={() => setIsOpen(true)}
          className='fixed z-50 right-0 pr-4 md:pr-5 top-[74px] p-2 md:p-3 text-lg md:rounded-l-xl transition-all dura rounded-l-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
        >
          <IoLibrarySharp />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

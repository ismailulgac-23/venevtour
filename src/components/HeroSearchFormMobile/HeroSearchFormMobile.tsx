'use client'

import { ButtonCircle } from '@/shared/Button'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonThird from '@/shared/ButtonThird'
import { CloseButton, Dialog, DialogPanel, TabGroup, TabPanel, TabPanels } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  FilterVerticalIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { useState } from 'react'
import { useTimeoutFn } from 'react-use'
import ExperienceSearchFormMobile from './experience-search-form/ExperienceSearchFormMobile'

const HeroSearchFormMobile = ({ className }: { className?: string }) => {
  const [showModal, setShowModal] = useState(false)

  // FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
  const [showDialog, setShowDialog] = useState(false)
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1)
  //
  function closeModal() {
    setShowModal(false)
  }

  function openModal() {
    setShowModal(true)
  }

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        className="relative flex w-full items-center rounded-full border border-neutral-200 bg-white px-4 py-3 pe-11 shadow-lg dark:border-neutral-600 dark:bg-neutral-900"
      >
        <HugeiconsIcon icon={Search01Icon} size={20} color="currentColor" strokeWidth={1.5} />

        <div className="ms-3 flex-1 overflow-hidden text-start">
          <span className="block text-sm font-bold text-neutral-900 dark:text-neutral-100">Nereye?</span>
          <span className="mt-0.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span className="line-clamp-1">Her yer • Her zaman • Katılımcı ekle</span>
          </span>
        </div>

        <span className="absolute end-2 top-1/2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-700 dark:text-neutral-300">
          <HugeiconsIcon icon={FilterVerticalIcon} size={20} color="currentColor" strokeWidth={1.5} />
        </span>
      </button>
    )
  }

  return (
    <div className={clsx(className, 'relative z-10 w-full max-w-lg')}>
      {renderButtonOpenModal()}
      <Dialog as="div" className="relative z-max" onClose={closeModal} open={showModal}>
        <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
          <div className="flex h-full">
            <DialogPanel
              transition
              className="relative flex-1 transition data-closed:translate-y-28 data-closed:opacity-0"
            >
              {showDialog && (
                <TabGroup manual className="relative flex h-full flex-1 flex-col justify-between">
                  <div className="absolute end-4 top-4 z-10">
                    <CloseButton color="light" as={ButtonCircle} className="size-10! bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700">
                      <XMarkIcon className="size-5!" />
                    </CloseButton>
                  </div>

                  <TabPanels className="flex flex-1 overflow-hidden px-1.5 sm:px-4">
                    <div className="hidden-scrollbar flex-1 overflow-y-auto pt-4 pb-4 px-0">
                      <TabPanel
                        as="div"
                        className="animate-[myblur_0.4s_ease-in-out] transition-opacity"
                      >
                        <ExperienceSearchFormMobile />
                      </TabPanel>
                    </div>
                  </TabPanels>
                  <div className="flex justify-between items-center border-t border-neutral-100 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <ButtonThird
                      className="text-sm font-bold underline"
                      onClick={() => {
                        setShowDialog(false)
                        resetIsShowingDialog()
                      }}
                    >
                      Temizle
                    </ButtonThird>
                    <ButtonPrimary
                      type="submit"
                      form="form-hero-search-form-mobile"
                      onClick={closeModal}
                      className="px-8 h-12 rounded-2xl shadow-xl shadow-primary-500/10 font-bold"
                    >
                      <HugeiconsIcon icon={Search01Icon} size={18} className="mr-2" />
                      <span>Ara</span>
                    </ButtonPrimary>
                  </div>
                </TabGroup>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default HeroSearchFormMobile

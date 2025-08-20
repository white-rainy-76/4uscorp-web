'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/shared/ui/utils'
import {
  useAttachDriverMutation,
  useDetachDriverMutation,
} from '../api/attach-detach-driver.mutations'
import {
  AttachDetachDriverPayload,
  AttachDetachDriverPayloadSchema,
} from '../api/payload/attach-detach-driver.payload'
import { Driver } from '@/entities/driver'
import { truckUnitQueries } from '@/entities/truck'
import { useQuery } from '@tanstack/react-query'

interface AttachDetachDriverFormProps {
  onClose: () => void
  driver?: Driver
}

export const AttachDetachDriverForm = ({
  onClose,
  driver,
}: AttachDetachDriverFormProps) => {
  const [open, setOpen] = useState(false)
  const [selectedTruckId, setSelectedTruckId] = useState<string>('')
  const [selectedTruckUnit, setSelectedTruckUnit] = useState<string>('')
  console.log(driver)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AttachDetachDriverPayload>({
    resolver: zodResolver(AttachDetachDriverPayloadSchema),
    defaultValues: {
      driverId: '',
      truckId: '',
    },
  })

  const { data: truckUnits, isLoading: isLoadingTrucks } = useQuery(
    truckUnitQueries.list(),
  )

  const { mutateAsync: attachDriver, isPending: isAttaching } =
    useAttachDriverMutation({
      onSuccess: () => {
        reset()
        onClose()
      },
    })

  const { mutateAsync: detachDriver, isPending: isDetaching } =
    useDetachDriverMutation({
      onSuccess: () => {
        reset()
        onClose()
      },
    })

  useEffect(() => {
    if (driver) {
      setValue('driverId', driver.id)
    }
  }, [driver, setValue])

  const handleFormSubmit = async (data: AttachDetachDriverPayload) => {
    try {
      if (driver?.truck?.id) {
        // Detach - используем текущий truckId драйвера
        await detachDriver({ driverId: driver.id, truckId: driver.truck.id })
      } else {
        // Attach - используем выбранный truckId
        await attachDriver({ driverId: driver!.id, truckId: selectedTruckId })
      }
    } catch (error) {
      console.error('Failed to attach/detach driver:', error)
    }
  }

  const isAttached = !!driver?.truck?.id
  const isSubmitDisabled = isAttached
    ? isDetaching
    : !selectedTruckId || isAttaching

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-[30px]">
      {!isAttached && (
        <div className="space-y-3">
          <label className="block text-sm font-extrabold text-[#A8A8A8]">
            Выберите трак
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-10 border-gray-300 bg-gray-50 text-black">
                {selectedTruckUnit ? selectedTruckUnit : 'Выберите трак...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0">
              <Command>
                <CommandInput placeholder="Поиск по номеру трака..." />
                <CommandList>
                  <CommandEmpty>Трак не найден.</CommandEmpty>
                  <CommandGroup>
                    {selectedTruckId && (
                      <CommandItem
                        className="text-red-600 font-medium"
                        onSelect={() => {
                          setSelectedTruckId('')
                          setSelectedTruckUnit('')
                          setValue('truckId', '')
                          setOpen(false)
                        }}>
                        Отвязать от трака
                      </CommandItem>
                    )}
                    {truckUnits?.map((truckUnit) => (
                      <CommandItem
                        key={truckUnit.truckId}
                        value={truckUnit.unit}
                        className="text-black"
                        onSelect={() => {
                          setSelectedTruckId(truckUnit.truckId)
                          setSelectedTruckUnit(truckUnit.unit)
                          setValue('truckId', truckUnit.truckId)
                          setOpen(false)
                        }}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedTruckId === truckUnit.truckId
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {truckUnit.unit}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.truckId && (
            <p className="text-sm text-red-500">{errors.truckId.message}</p>
          )}
        </div>
      )}

      {isAttached && (
        <div className="space-y-3">
          <label className="block text-sm font-extrabold text-[#A8A8A8]">
            Текущий трак
          </label>
          <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
            <span className="text-sm text-gray-700">
              {driver.truck?.unitNumber
                ? `#${driver.truck.unitNumber}`
                : 'Номер не указан'}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full rounded-[22px]">
        {isAttaching || isDetaching
          ? 'Загрузка...'
          : isAttached
            ? 'Открепить от трака'
            : 'Прикрепить к траку'}
      </Button>
    </form>
  )
}

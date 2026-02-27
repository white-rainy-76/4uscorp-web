'use client'

import React, { useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { cn } from '@/shared/ui/utils'

export type ComboboxOption = {
  value: string
  label: string
  hint?: string
}

type ComboboxProps = {
  value: string | null
  options: ComboboxOption[]
  placeholder: string
  searchPlaceholder: string
  emptyText: string
  onChange: (next: string) => void
  className?: string
}

export function Combobox({
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  onChange,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-11 rounded-xl bg-background',
            className,
          )}>
          <span className="truncate text-text-heading">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className="cursor-pointer text-text-heading">
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      option.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="min-w-0">
                    <div className="truncate">{option.label}</div>
                    {option.hint ? (
                      <div className="text-xs text-muted-foreground truncate">
                        {option.hint}
                      </div>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

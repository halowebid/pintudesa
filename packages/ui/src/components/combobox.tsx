"use client"

import * as React from "react"
import {
  Combobox as ComboboxPrimitive,
  useListCollection,
} from "@ark-ui/react/combobox"
import { useFilter } from "@ark-ui/react/locale"
import { Portal } from "@ark-ui/react/portal"
import { Icon } from "@yopem-ui/react-icons"
import { cn } from "@yopem-ui/utils"

import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface Item {
  label: string
  value: string
}

export interface ComboboxBaseProps
  extends Omit<
    React.ComponentProps<typeof ComboboxPrimitive.Root>,
    | "children"
    | "onSelect"
    | "collection"
    | "onInputValueChange"
    | "value"
    | "inputValue"
  > {
  items: Item[]
  placeholder?: string
  groupLabel?: string
  onSelect?: (item: Item) => void
  className?: string
  mode?: "portal" | "inline"
  onInputValueChange?: (value: string) => void
  inputValue?: string
  value?: string[]
}

export const ComboboxBase = ({
  items,
  placeholder = "Search...",
  groupLabel = "Suggestions",
  className,
  mode = "portal",
  ...props
}: ComboboxBaseProps) => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection<Item>({
    initialItems: items,
    filter: contains,
  })

  const Content = (
    <ComboboxPrimitive.Content>
      {collection.items.length > 0 ? (
        <ComboboxPrimitive.ItemGroup>
          <ComboboxPrimitive.ItemGroupLabel className="text-muted-foreground px-3 py-1 text-xs font-medium">
            {groupLabel}
          </ComboboxPrimitive.ItemGroupLabel>
          {collection.items.map((item) => (
            <ComboboxPrimitive.Item
              key={item.value}
              item={item}
              className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm"
            >
              <ComboboxPrimitive.ItemText>
                {item.label}
              </ComboboxPrimitive.ItemText>
              <ComboboxPrimitive.ItemIndicator asChild>
                <Icon name="Check" className="size-4" />
              </ComboboxPrimitive.ItemIndicator>
            </ComboboxPrimitive.Item>
          ))}
        </ComboboxPrimitive.ItemGroup>
      ) : (
        <div className="text-muted-foreground px-3 py-4 text-center text-sm">
          No results found.
        </div>
      )}
    </ComboboxPrimitive.Content>
  )

  return (
    <ComboboxPrimitive.Root
      {...props}
      value={props.value}
      inputValue={props.inputValue}
      onInputValueChange={({ inputValue }) => {
        filter(inputValue)
        props.onInputValueChange?.(inputValue)
      }}
      onSelect={({ value }) => {
        const selected = items.find((item) => item.value === value[0])
        if (selected) {
          props.onSelect?.(selected)
        }
      }}
      collection={collection}
      className={cn("overflow-hidden rounded-md border", className)}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Icon name="Search" className="text-muted-foreground size-4" />
        <ComboboxPrimitive.Input
          placeholder={placeholder}
          className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
        />
        <ComboboxPrimitive.ClearTrigger
          className="text-muted-foreground hover:text-muted-foreground/80"
          asChild
        >
          <Icon name="X" className="size-4" />
        </ComboboxPrimitive.ClearTrigger>
      </div>

      {mode === "portal" ? (
        <ComboboxPrimitive.Positioner>
          <Portal>{Content}</Portal>
        </ComboboxPrimitive.Positioner>
      ) : (
        Content
      )}
    </ComboboxPrimitive.Root>
  )
}

export interface ComboboxPopoverProps {
  value?: string
  onSelect?: (value: string) => void
  onInputValueChange?: (value: string) => void
  items: Item[]
  placeholder?: string
  defaultInputValue?: string
  defaultLabel?: string
  onClear?: () => void
  isClearable?: boolean
  buttonClassName?: string
  popoverClassName?: string
  groupLabel?: string
  className?: string
}

export const ComboboxPopover = ({
  value,
  onSelect,
  items,
  placeholder,
  defaultLabel,
  defaultInputValue,
  buttonClassName,
  popoverClassName,
  groupLabel,
  className,
  onInputValueChange,
}: ComboboxPopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(defaultInputValue)

  const selectedItem = items.find((item) => item.value === value)
  const selectedLabel =
    selectedItem?.label ?? defaultLabel ?? placeholder ?? "Pilih opsi"

  return (
    <Popover open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <div className="flex w-full items-center justify-center">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "w-[calc(100%-60px)] justify-between pr-10",
              buttonClassName,
            )}
          >
            <span className="truncate">{selectedLabel}</span>
            <Icon name="ChevronsUpDown" className="ml-auto size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>

      <PopoverContent className={cn("p-0", popoverClassName)}>
        <ComboboxBase
          mode="inline"
          items={items}
          value={value ? [value] : []}
          inputValue={inputValue}
          onInputValueChange={(val) => {
            setInputValue(val)
            onInputValueChange?.(val)
          }}
          onSelect={(item) => {
            setIsOpen(false)
            setInputValue(item.label)
            onSelect?.(item.value)
          }}
          placeholder={placeholder}
          groupLabel={groupLabel}
          className={className}
        />
      </PopoverContent>
    </Popover>
  )
}

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
    "children" | "onSelect" | "collection"
  > {
  items: Item[]
  placeholder?: string
  groupLabel?: string
  onSelect?: (item: Item) => void
  className?: string
  mode?: "portal" | "inline"
}

export const ComboboxBase = ({
  items,
  placeholder = "Search...",
  groupLabel = "Suggestions",
  onSelect,
  className,
  mode = "portal",
  ...props
}: ComboboxBaseProps) => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection<Item>({
    initialItems: items,
    filter: contains,
  })

  const handleInputChange = (details: { inputValue: string }) => {
    filter(details.inputValue)
  }

  const handleSelect = (details: { value: string[] }) => {
    const selectedValue = details.value[0]
    const selectedItem = items.find((item) => item.value === selectedValue)
    if (selectedItem) {
      onSelect?.(selectedItem)
    }
  }

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
      onInputValueChange={handleInputChange}
      onSelect={handleSelect}
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

export interface ComboboxPopoverProps
  extends Omit<
    ComboboxBaseProps,
    "mode" | "value" | "onSelect" | "onValueChange" | "onOpenChange"
  > {
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  buttonClassName?: string
}

export const ComboboxPopover = ({
  value,
  onValueChange,
  open,
  onOpenChange,
  items,
  buttonClassName,
  ...rest
}: ComboboxPopoverProps) => {
  const selectedLabel =
    items.find((item) => item.value === value)?.label ?? "Select option"

  return (
    <Popover
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", buttonClassName)}
        >
          {selectedLabel}
          <Icon name="ChevronsUpDown" className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ComboboxBase
          {...rest}
          open={true}
          mode="inline"
          items={items}
          defaultValue={value ? [value] : undefined}
          onSelect={(item) => {
            onOpenChange?.(false)
            onValueChange?.(item.value)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

"use client"

import * as React from "react"
import {
  Combobox as CommandPrimitive,
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

export interface CommandComboboxBaseProps
  extends Omit<
    React.ComponentProps<typeof CommandPrimitive.Root>,
    "children" | "onSelect" | "collection"
  > {
  items: Item[]
  placeholder?: string
  groupLabel?: string
  onSelect?: (item: Item) => void
  className?: string
  mode?: "portal" | "inline"
}

export const CommandComboboxBase = ({
  items,
  placeholder = "Search...",
  groupLabel = "Suggestions",
  onSelect,
  className,
  mode = "portal",
  ...props
}: CommandComboboxBaseProps) => {
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
    <CommandPrimitive.Content>
      {collection.items.length > 0 ? (
        <CommandPrimitive.ItemGroup>
          <CommandPrimitive.ItemGroupLabel className="text-muted-foreground px-3 py-1 text-xs font-medium">
            {groupLabel}
          </CommandPrimitive.ItemGroupLabel>
          {collection.items.map((item) => (
            <CommandPrimitive.Item
              key={item.value}
              item={item}
              className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm"
            >
              <CommandPrimitive.ItemText>
                {item.label}
              </CommandPrimitive.ItemText>
              <CommandPrimitive.ItemIndicator asChild>
                <Icon name="Check" className="size-4" />
              </CommandPrimitive.ItemIndicator>
            </CommandPrimitive.Item>
          ))}
        </CommandPrimitive.ItemGroup>
      ) : (
        <div className="text-muted-foreground px-3 py-4 text-center text-sm">
          No results found.
        </div>
      )}
    </CommandPrimitive.Content>
  )

  return (
    <CommandPrimitive.Root
      {...props}
      onInputValueChange={handleInputChange}
      onSelect={handleSelect}
      collection={collection}
      className={cn("overflow-hidden rounded-md border", className)}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Icon name="Search" className="text-muted-foreground size-4" />
        <CommandPrimitive.Input
          placeholder={placeholder}
          className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
        />
        <CommandPrimitive.ClearTrigger
          className="text-muted-foreground hover:text-muted-foreground/80"
          asChild
        >
          <Icon name="X" className="size-4" />
        </CommandPrimitive.ClearTrigger>
      </div>

      {mode === "portal" ? (
        <CommandPrimitive.Positioner>
          <Portal>{Content}</Portal>
        </CommandPrimitive.Positioner>
      ) : (
        Content
      )}
    </CommandPrimitive.Root>
  )
}

export interface CommandComboboxPopoverProps
  extends Omit<
    CommandComboboxBaseProps,
    "mode" | "value" | "onSelect" | "onValueChange" | "onOpenChange"
  > {
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  buttonClassName?: string
}

export const CommandComboboxPopover = ({
  value,
  onValueChange,
  open,
  onOpenChange,
  items,
  buttonClassName,
  ...rest
}: CommandComboboxPopoverProps) => {
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
        <CommandComboboxBase
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

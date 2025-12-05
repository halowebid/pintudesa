"use client"

import { useMemo, useState } from "react"
import { Icon } from "@yopem-ui/react-icons"

import type { SuratType } from "@/lib/db/schema"
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/ui"
import {
  getVariablesForSuratType,
  searchVariables,
  type VariableDefinition,
} from "./variable-definitions"

interface VariableInsertMenuProps {
  suratType: SuratType
  onInsert: (variableName: string) => void
}

export function VariableInsertMenu({
  suratType,
  onInsert,
}: VariableInsertMenuProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const allVariables = useMemo(
    () => getVariablesForSuratType(suratType),
    [suratType],
  )

  const filteredVariables = useMemo(() => {
    if (!searchQuery) return allVariables
    return searchVariables(allVariables, searchQuery)
  }, [allVariables, searchQuery])

  const groupedVariables = useMemo(() => {
    const groups: Record<string, VariableDefinition[]> = {
      desa: [],
      pemohon: [],
      surat: [],
    }

    for (const variable of filteredVariables) {
      const group = groups[variable.category]
      group.push(variable)
    }

    return groups
  }, [filteredVariables])

  const handleInsert = (variableName: string) => {
    onInsert(variableName)
    setOpen(false)
    setSearchQuery("")
  }

  const categoryLabels = {
    desa: "Informasi Desa",
    pemohon: "Data Pemohon",
    surat: "Data Surat",
  }

  return (
    <Popover open={open} onOpenChange={(details) => setOpen(details.open)}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="default"
          size="sm"
          title="Insert Variable"
          className="h-8"
        >
          <Icon name="Braces" className="mr-1 h-4 w-4" />
          Variabel
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="space-y-2 p-2">
          {/* Search input */}
          <div className="relative">
            <Icon
              name="Search"
              className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4"
            />
            <Input
              placeholder="Cari variabel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Variable list */}
          <div className="max-h-[400px] overflow-y-auto">
            <div className="space-y-4 p-2">
              {Object.entries(categoryLabels).map(([category, label]) => {
                const variables = groupedVariables[category]
                if (variables.length === 0) return null

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-semibold">{label}</h4>
                    <div className="space-y-1">
                      {variables.map((variable) => (
                        <button
                          key={variable.name}
                          type="button"
                          onClick={() => handleInsert(variable.name)}
                          className="hover:bg-accent flex w-full flex-col items-start rounded-md p-2 text-left text-sm"
                        >
                          <div className="font-medium">{variable.label}</div>
                          <div className="text-muted-foreground text-xs">
                            {`{{${variable.name}}}`}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {variable.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {filteredVariables.length === 0 && (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  Tidak ada variabel ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

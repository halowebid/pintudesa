"use client"

import type { UrlObject } from "url"
import * as React from "react"
import {
  Button,
  Menu,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuTrigger,
} from "@pintudesa/ui"
import { Icon } from "@yopem-ui/react-icons"

import AlertDelete from "@/components/alert-delete"
import Link from "@/components/link"

interface ShowOptionsProps extends React.ComponentProps<typeof Menu> {
  onDelete?: () => void
  editUrl?: string | UrlObject
  editUrlNewTab?: string | UrlObject
  translateUrl?: string | UrlObject
  viewUrl?: string | UrlObject
  seperateUrl?: string | UrlObject
  description: string | null
}

const ShowOptions = (props: ShowOptionsProps) => {
  const {
    onDelete,
    editUrl,
    editUrlNewTab,
    viewUrl,
    seperateUrl,
    description,
  } = props

  const [openDialogDelete, setOpenDialogDelete] = React.useState<boolean>(false)

  return (
    <>
      <Menu>
        <MenuTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-auto flex h-8">
            <Icon name="EllipsisVertical" className="mr-2 size-4" />
          </Button>
        </MenuTrigger>
        <MenuContent className="w-[150px] p-2">
          <MenuItemGroup>
            {onDelete && (
              <MenuItem value="Hapus" asChild>
                <Button
                  variant="ghost"
                  onClick={() => setOpenDialogDelete(true)}
                  className="w-full justify-start !px-2 py-1.5 text-sm"
                >
                  <Icon name="Trash" className="mr-2 size-4" />
                  Hapus
                </Button>
              </MenuItem>
            )}
            {editUrl && (
              <MenuItem value="Edit" asChild>
                <Link href={editUrl}>
                  <Icon name="Edit" className="mr-2 size-4" />
                  Edit
                </Link>
              </MenuItem>
            )}
            {editUrlNewTab && (
              <MenuItem value="Edit" asChild>
                <Link href={editUrlNewTab} target="_blank">
                  <Icon name="Edit" className="mr-2 size-4" />
                  Edit
                </Link>
              </MenuItem>
            )}
            {viewUrl && (
              <MenuItem value="Lihat" asChild>
                <Link href={viewUrl} target="_blank">
                  <Icon name="Eye" className="mr-2 size-4" />
                  Lihat
                </Link>
              </MenuItem>
            )}
            {seperateUrl && (
              <MenuItem value="Pisah" asChild>
                <Link href={seperateUrl}>
                  <Icon name="Ungroup" className="mr-2 size-4" />
                  Pisah
                </Link>
              </MenuItem>
            )}
          </MenuItemGroup>
        </MenuContent>
      </Menu>
      {onDelete && (
        <AlertDelete
          description={description}
          isOpen={openDialogDelete}
          className="max-w-[366px]"
          onDelete={onDelete}
          onClose={() => setOpenDialogDelete(false)}
        />
      )}
    </>
  )
}

export default ShowOptions

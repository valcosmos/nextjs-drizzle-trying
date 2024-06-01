import React, { useEffect } from 'react'
import { Label } from '../ui/label'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { MessageProps } from '@/server/db/validate-schema'
import { Button } from '../ui/button'
import { trpcClientReact } from '@/utils/api'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

export type FormProps = {
  name: string
  email: string
  message: string
  id: number
}

export default function AddMessage({
  open,
  onSuccess,
  resetFromData
}: {
  open: boolean
  onSuccess: (v: boolean) => void
  resetFromData?: FormProps
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormProps>()

  const { mutateAsync: setMessage } = trpcClientReact.setMessage.useMutation()
  const { mutateAsync: updateMessage } = trpcClientReact.updateMessage.useMutation()

  if (status === 'success') {
    onSuccess(false)
  }
  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    if (resetFromData) {
      await updateMessage(data)
    } else {
      await setMessage(data)
    }
    onSuccess(false)
  }

  useEffect(() => {
    if (resetFromData) {
      reset(resetFromData)
    }
  }, [resetFromData])

  return (
    <Dialog open={open} onOpenChange={() => onSuccess(!open)}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-3xl font-bold">New Message</h2>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label>Name</Label>
            <Input {...register('name', { required: 'Name is required' })} />
            <span className="text-red-500">{errors.name?.message}</span>
          </div>
          <div>
            <Label>Email</Label>
            <Input {...register('email', { required: 'Email is required' })} />
            <span className="text-red-500">{errors.email?.message}</span>
          </div>
          <div>
            <Label>Message</Label>
            <Input {...register('message', { required: 'Message is required' })} />
            <span className="text-red-500">{errors.message?.message}</span>
          </div>

          <Button type="submit">{resetFromData ? 'Update' : 'Submit'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

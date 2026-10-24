import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/text-input'
import { appConfig } from '@/lib/auth/permissions'
import { configurationApi } from '@/features/home/api/configurationApi'
import { noteSchema, type NoteFormValues } from '@/features/home/schemas/noteSchema'

export function HomePage() {
  const { t } = useTranslation()
  const [savedNote, setSavedNote] = useState('')
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { note: '' },
  })

  return (
    <section className="space-y-6">
      <h1 className="type-page-title-24-b">{t('Welcome')}</h1>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit((values) => {
          setSavedNote(values.note)
        })}
      >
        <label className="type-body-14-r block" htmlFor="note">
          {t('Note')}
        </label>
        <TextInput
          id="note"
          variant={form.formState.errors.note ? 'wrong' : 'Default'}
          aria-invalid={form.formState.errors.note ? true : undefined}
          {...form.register('note')}
        />
        {form.formState.errors.note ? (
          <p className="type-body-14-r text-icon-danger">{t(form.formState.errors.note.message ?? 'NoteRequired')}</p>
        ) : null}
        <Button type="submit">{t('SaveNote')}</Button>
        {savedNote ? <p>{savedNote}</p> : null}
      </form>
    </section>
  )
}

export function AppHomePage() {
  const { t } = useTranslation()
  const { isGranted } = appConfig.usePolicies()
  const configuration = useQuery({
    queryKey: ['application-configuration'],
    queryFn: () => configurationApi.get(),
  })
  const userName = configuration.data?.currentUser.userName

  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-semibold">{t('Menu:App')}</h1>
      {userName ? <p>{t('SignedInAs', { name: userName })}</p> : <p>{t('Welcome')}</p>}
      {isGranted('AbpIdentity.Users') ? <p>{t('Menu:Home')}</p> : null}
    </section>
  )
}
